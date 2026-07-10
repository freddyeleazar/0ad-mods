const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(__dirname, '.env');
const TRANSLATIONS_PATH = path.join(ROOT, 'assets', 'data', 'translations.json');
const DICT_PATH = path.join(__dirname, 'dictionary.json');
const OVERRIDES_PATH = path.join(__dirname, 'manual_overrides.json');
const CACHE_PATH = path.join(__dirname, 'translation_cache.json');
const MOD_TERMS_DIR = path.join(ROOT, 'assets', 'data', 'mods');

// Load .env
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('ERROR: .env file not found at', ENV_PATH);
    process.exit(1);
  }
  const content = fs.readFileSync(ENV_PATH, 'utf8');
  const match = content.match(/^DEEPL_API_KEY=(.+)$/m);
  if (!match) {
    console.error('ERROR: DEEPL_API_KEY not found in .env');
    process.exit(1);
  }
  return match[1].trim();
}

// Load JSON helper
function loadJSON(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  [warn] ${label} not found at ${filePath}`);
    return {};
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// DeepL translation via API
function translateWithDeepL(texts, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      text: texts,
      target_lang: 'ES',
      source_lang: 'EN'
    });
    const options = {
      hostname: 'api-free.deepl.com',
      path: '/v2/translate',
      method: 'POST',
      rejectUnauthorized: false,
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`DeepL API error ${res.statusCode}: ${data}`));
          return;
        }
        try {
          const result = JSON.parse(data);
          resolve(result.translations.map(t => t.text));
        } catch (e) {
          reject(new Error('Failed to parse DeepL response: ' + data));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Recursively collect all leaf string values from an object
function collectStrings(obj, path = '', results = []) {
  if (typeof obj === 'string') {
    results.push({ path, value: obj });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => collectStrings(item, `${path}[${i}]`, results));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      collectStrings(obj[key], path ? `${path}.${key}` : key, results);
    }
  }
  return results;
}

// Rebuild object from flat path-value pairs
function rebuildObject(entries) {
  const result = {};
  for (const { path, value } of entries) {
    const parts = path.split('.');
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isArray = part.includes('[');
      if (isArray) {
        const [arrayKey, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        if (!current[arrayKey]) current[arrayKey] = [];
        if (i === parts.length - 1) {
          current[arrayKey][index] = value;
        } else {
          if (!current[arrayKey][index]) current[arrayKey][index] = {};
          current = current[arrayKey][index];
        }
        break;
      } else {
        if (i === parts.length - 1) {
          current[part] = value;
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      }
    }
  }
  return result;
}

// Build a flat lookup from nested translation sources
function buildLookup(...sources) {
  const lookup = new Map();
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      lookup.set(key, value);
    }
  }
  return lookup;
}

async function main() {
  console.log('=== Translation Generator ===\n');
  
  // Load everything
  const apiKey = loadEnv();
  console.log('✓ API key loaded');
  
  const translations = loadJSON(TRANSLATIONS_PATH, 'translations.json');
  if (!translations.en) {
    console.error('ERROR: translations.json must have an "en" block');
    process.exit(1);
  }
  console.log('✓ translations.json (EN) loaded');
  
  const dictionary = loadJSON(DICT_PATH, 'dictionary.json');
  console.log(`  dictionary: ${Object.keys(dictionary).length} entries`);
  
  const manualOverrides = loadJSON(OVERRIDES_PATH, 'manual_overrides.json');
  console.log(`  manual_overrides: ${Object.keys(manualOverrides).length} entries`);
  
  // Load mod terms
  let modTerms = {};
  if (fs.existsSync(MOD_TERMS_DIR)) {
    const files = fs.readdirSync(MOD_TERMS_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const terms = loadJSON(path.join(MOD_TERMS_DIR, file), file);
      Object.assign(modTerms, terms);
    }
  }
  console.log(`  mod_terms: ${Object.keys(modTerms).length} entries`);
  
  let cache = loadJSON(CACHE_PATH, 'translation_cache.json');
  console.log(`  cache: ${Object.keys(cache).length} cached translations\n`);
  
  // Build combined lookup: dictionary → manualOverrides → modTerms
  const overrideLookup = buildLookup(dictionary, manualOverrides, modTerms);
  
  // Collect all English strings
  const enStrings = collectStrings(translations.en);
  console.log(`Found ${enStrings.length} strings to translate\n`);
  
  // Translate each string
  let newTranslations = 0;
  let cachedCount = 0;
  let overrideCount = 0;
  let apiCalls = 0;
  let failedCount = 0;
  
  const esEntries = [];
  const apiBatch = []; // { entry, text }
  
  for (const entry of enStrings) {
    const text = entry.value;
    
    // Check override lookup
    if (overrideLookup.has(text)) {
      esEntries.push({ path: entry.path, value: overrideLookup.get(text) });
      overrideCount++;
      continue;
    }
    
    // Check cache
    if (cache[text]) {
      esEntries.push({ path: entry.path, value: cache[text] });
      cachedCount++;
      continue;
    }
    
    // Need API
    apiBatch.push(entry);
  }
  
  // Process API batch (send in chunks of 50)
  const CHUNK_SIZE = 50;
  for (let i = 0; i < apiBatch.length; i += CHUNK_SIZE) {
    const chunk = apiBatch.slice(i, i + CHUNK_SIZE);
    const texts = chunk.map(e => e.value);
    
    try {
      console.log(`  Calling DeepL API (${texts.length} texts)...`);
      const results = await translateWithDeepL(texts, apiKey);
      apiCalls++;
      
      for (let j = 0; j < chunk.length; j++) {
        const entry = chunk[j];
        const translation = results[j];
        esEntries.push({ path: entry.path, value: translation });
        cache[entry.value] = translation;
        newTranslations++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`  API error for chunk: ${err.message}`);
      for (const entry of chunk) {
        esEntries.push({ path: entry.path, value: entry.value + ' [UNTRANSLATED]' });
        failedCount++;
      }
    }
  }
  
  // Build ES object
  const es = rebuildObject(esEntries);
  
  // Write final translations.json
  const finalOutput = { en: translations.en, es };
  fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(finalOutput, null, 2) + '\n', 'utf8');
  
  // Update cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
  
  // Report
  console.log(`\n=== Translation Complete ===`);
  console.log(`  ${overrideCount} from overrides`);
  console.log(`  ${cachedCount} from cache`);
  console.log(`  ${newTranslations} new (${apiCalls} API calls)`);
  if (failedCount > 0) console.log(`  ${failedCount} FAILED`);
  console.log(`  Total: ${esEntries.length} ES strings`);
  console.log(`\nSaved to: ${TRANSLATIONS_PATH}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
