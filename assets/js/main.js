/* Core JavaScript for 0 A.D. Mods Website */

// Global state
const App = {
  mods: [],
  currentMod: null,
  activeTab: 'overview'
};

// DOM Elements
const DOM = {
  modGrid: document.getElementById('modGrid'),
  modDetail: document.getElementById('modDetail'),
  modDetailContent: document.getElementById('modDetailContent'),
  tabs: document.querySelectorAll('.mod-detail-tab'),
  navLinks: document.querySelectorAll('.nav-links a')
};

// Load mods data from JSON (populated from mods.json)
async function loadModsData() {
  try {
    const response = await fetch('/gamestudio/assets/data/mods.json');
    if (!response.ok) throw new Error('Failed to fetch mods data');
    const modsData = await response.json();
    
    // Convert object to array
    App.mods = Object.values(modsData);
    return App.mods;
  } catch (error) {
    console.error('Error loading mods data:', error);
    // Fallback to placeholder data if JSON doesn't exist yet
    return loadPlaceholderMods();
  }
}

// Fallback placeholder mods for development
function loadPlaceholderMods() {
  return App.mods = [
    {
      id: "daynight_cycle",
      name: "Day/Night Cycle",
      tagline: "Real-time virtual clock with atmospheric color tints",
      shortDescription: "A dynamic day/night cycle overlay that displays a real-time virtual clock on the HUD with a full-screen color tint that transitions smoothly through dawn, day, dusk, and night — bringing atmospheric immersion to every match.",
      version: "0.1.0",
      gameVersion: "0.28.0",
      category: "GUI / Immersion",
      tags: ["HUD", "atmosphere", "cosmetic", "no-performance-impact"],
      screenshots: ["/gamestudio/assets/images/mod-covers/daynight_cycle-card.jpg"],
      downloadUrl: "https://github.com/daynight_cycle/releases/latest/download/daynight_cycle.zip",
      detailedDescription: "## What it does\nAdds a persistent HUD overlay showing the current in-game time (00:00–23:59) and phase name (NOCHE / AMANECER / DÍA / ATARDECER), plus a full-screen color tint that shifts in real time: deep midnight blues → warm dawn oranges → bright midday → dusky reds → back to night.",
      installInstructions: "1. Download ZIP\n2. Extract to `mods/daynight_cycle/`\n3. Enable in Mod Selection screen\n4. Bind toggle hotkey in Settings → Hotkeys",
      configOptions: [
        {key: "gui.session.daynightcycle", type: "boolean", default: true, description: "Enable/disable overlay"}
      ],
      hotkeys: [
        {action: "daynightcycle.toggle", default: "unbound", description: "Toggle day/night overlay visibility"}
      ],
      compatibility: "Pure GUI mod — compatible with all gameplay mods. Requires 0 A.D. 0.28.0.",
      author: "nous",
      license: "MIT",
      sourceCode: "https://github.com/daynight_cycle"
    },
    {
      id: "personal_names",
      name: "Personal Names",
      tagline: "Historically accurate individual names for every unit",
      shortDescription: "Every human unit receives a unique, historically-accurate personal name based on their civilization and gender — no two soldiers share a name in a single match.",
      version: "0.2.0",
      gameVersion: "0.28.0",
      category: "Gameplay / Immersion",
      tags: ["simulation", "units", "historical-authenticity", "localization"],
      screenshots: ["/gamestudio/assets/images/mod-covers/personal_names-card.jpg"],
      downloadUrl: "https://github.com/personal_names/releases/latest/download/personal_names.zip",
      detailedDescription: "## What it does\nReplaces generic unit names (\"Citizen Soldier\", \"Hoplite\") with individually assigned personal names drawn from authentic historical sources for each civilization and gender. Once a name is used in a match, it won't be reused — every unit feels like an individual.",
      installInstructions: "1. Download ZIP\n2. Extract to `mods/personal_names/`\n3. Enable in Mod Selection screen\n4. Optional: Add custom name pools to `simulation/data/`",
      configOptions: [],
      hotkeys: [],
      compatibility: "Overrides `Identity` component via `Engine.ReRegisterComponentType` — compatible with other mods that don't also override Identity. Requires 0 A.D. 0.28.0.",
      author: "nous",
      license: "MIT",
      sourceCode: "https://github.com/personal_names"
    },
    {
      id: "skills_mod",
      name: "Experience Skills",
      tagline: "RPG-style progression system with 14 unit skills",
      shortDescription: "An RPG-style progression system where every unit gains experience and levels up 14 distinct skills — gatherers harvest faster, soldiers hit harder and survive longer, builders construct quicker.",
      version: "1.0.0",
      gameVersion: "0.28.0",
      category: "Gameplay / RPG Systems",
      tags: ["progression", "units", "simulation", "RPG", "localization"],
      screenshots: ["/gamestudio/assets/images/mod-covers/skills_mod-card.jpg"],
      downloadUrl: "https://github.com/skills_mod/releases/latest/download/skills_mod.zip",
      detailedDescription: "## Core concept\nUnits learn by doing. A lumberjack who chops wood all game becomes a master Woodcutter. A spearman who survives dozens of melee engagements gains Melee Resistance. A healer who tanks arrows earns Health XP. Every unit tells a story through its skill sheet.",
      installInstructions: "1. Download ZIP\n2. Extract to `mods/skills_mod/`\n3. Enable in Mod Selection screen\n4. Edit `simulation/data/skills.json` for custom progression",
      configOptions: [],
      hotkeys: [],
      compatibility: "Overrides 4 simulation components via prototype replacement — compatible with other mods that don't also override ResourceGatherer, DelayedDamage, Health, or Builder. Requires 0 A.D. 0.28.0.",
      author: "nous",
      license: "MIT",
      sourceCode: "https://github.com/skills_mod"
    }
  ];
}

// Render mod cards to grid
function renderModCards() {
  if (!DOM.modGrid) return;
  
  DOM.modGrid.innerHTML = '';
  
  App.mods.forEach(mod => {
    const modCard = document.createElement('div');
    modCard.className = 'mod-card';
    modCard.innerHTML = `
      <img src="${mod.screenshots[0] || '/gamestudio/assets/images/icons/mod-default.svg'}" alt="${mod.name}" onerror="this.src='/gamestudio/assets/images/icons/mod-default.svg'">
      <div class="mod-card-content">
        <h3 class="mod-card-title">${mod.name}</h3>
        <p class="mod-card-tagline">${mod.tagline}</p>
        <div class="mod-card-meta">
          <span class="mod-card-tag">${mod.category}</span>
          ${mod.version ? `<span class="mod-card-version">v${mod.version}</span>` : ''}
          ${mod.gameVersion ? `<span class="mod-card-version">0.A.D. ${mod.gameVersion}</span>` : ''}
        </div>
        <div style="margin-top: 16px; margin-bottom: 16px; color: var(--text-secondary); font-size: 0.875rem;">
          ${mod.shortDescription.substring(0, 120)}...
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
          ${mod.tags.slice(0, 3).map(tag => `
            <span style="background: var(--secondary-bg); color: var(--text-secondary); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">${tag}</span>
          `).join('')}
        </div>
        <div class="mod-card-buttons">
          <a href="pages/mod-detail.html?id=${mod.id}" class="btn btn-primary" data-i18n="common.viewDetails" data-i18n-fallback="View Details">View Details</a>
          <a href="${mod.downloadUrl}" class="btn btn-secondary" data-i18n="common.download" data-i18n-fallback="Download">Download</a>
        </div>
      </div>
    `;
    DOM.modGrid.appendChild(modCard);
  });
}

// Handle mod detail page
function handleModDetailPage() {
  // Only handle mod detail page if we're on it (modDetailContent exists)
  if (!DOM.modDetailContent) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  const modId = urlParams.get('id');
  
  if (!modId) {
    window.location.href = '../index.html';
    return;
  }
  
  App.currentMod = App.mods.find(mod => mod.id === modId);
  
  if (!App.currentMod) {
    showNotFoundMessage();
    return;
  }
  
  // Render mod detail
  renderModDetail();
  initializeConflictChecker();
}

// Render mod detail page content
function renderModDetail() {
  if (!DOM.modDetailContent || !App.currentMod) return;
  
  DOM.modDetailContent.innerHTML = '';
  
  // Determine active tab from URL or default to overview
  const tab = new URLSearchParams(window.location.search).get('tab') || 'overview';
  App.activeTab = tab;
  
  // Update tab buttons
  DOM.tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  
  // Render content based on active tab
  let content = '';
  
  switch(tab) {
    case 'overview':
      content = renderOverviewTab();
      break;
    case 'features':
      content = renderFeaturesTab();
      break;
    case 'screenshots':
      content = renderScreenshotsTab();
      break;
    case 'install':
      content = renderInstallTab();
      break;
    case 'compatibility':
      content = renderCompatibilityTab();
      break;
    default:
      content = renderOverviewTab();
  }
  
  DOM.modDetailContent.innerHTML = content;
  
  // Update page title
  document.title = `${App.currentMod.name} - 0 A.D. Mods`;
}

// Render overview tab
function renderOverviewTab() {
  // Check if the mod has translated detailedDescription
  const detailedDescription = App.currentMod.detailedDescription || '';
  
  // Extract features from description
  const features = extractKeyFeatures(detailedDescription);
  
  return `
    <h2 data-i18n="mod.titlePrefix" data-i18n-fallback="Overview">Overview</h2>
    <p>${detailedDescription}</p>
    
    <h3>Key Features</h3>
    <ul>
      ${features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>
    
    <h3>Version & Compatibility</h3>
    <p><strong>Version:</strong> ${App.currentMod.version}</p>
    <p><strong>Game Version:</strong> ${App.currentMod.gameVersion}</p>
    <p><strong>Category:</strong> ${App.currentMod.category}</p>
    <p><strong>Compatibility:</strong> ${App.currentMod.compatibility}</p>
  `;
}

// Render features tab
function renderFeaturesTab() {
  const features = extractFeatures(App.currentMod.detailedDescription);
  
  return `
    <h2>Features & Gameplay</h2>
    ${features ? `
      <ul>
        ${features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
    ` : '<p>No detailed features listed in description.</p>'}
    
    <h3>Technical Details</h3>
    <p><strong>Tags:</strong></p>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
      ${App.currentMod.tags.map(tag => `
        <span style="background: var(--accent-secondary); color: var(--text-primary); padding: 8px 16px; border-radius: 4px; font-size: 0.875rem; font-weight: bold;">${tag}</span>
      `).join('')}
    </div>
    
    ${App.currentMod.configOptions.length > 0 ? `
      <h3>Configuration Options</h3>
      <div style="background: var(--secondary-bg); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
        ${App.currentMod.configOptions.map(config => `
          <div style="margin-bottom: 16px;">
            <strong>${config.key}:</strong> ${config.description} (Default: ${JSON.stringify(config.default)})
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${App.currentMod.hotkeys.length > 0 ? `
      <h3>Hotkeys</h3>
      <div style="background: var(--secondary-bg); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
        ${App.currentMod.hotkeys.map(hotkey => `
          <div style="margin-bottom: 8px;">
            <strong>${hotkey.action}:</strong> ${hotkey.description} (Default: ${hotkey.default})
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

// Render screenshots tab
function renderScreenshotsTab() {
  return `
    <h2 data-i18n="mod.tabs.screenshots" data-i18n-fallback="Screenshots">Screenshots</h2>
    ${App.currentMod.screenshots.map(screenshot => `
      <img src="${screenshot}" alt="Screenshot of ${App.currentMod.name}" class="mod-detail-screenshot" onerror="this.src='/gamestudio/assets/images/icons/screenshot-error.svg'; this.alt='Screenshot not available';">
    `).join('')}
    
    <h3>Image Guidelines</h3>
    <p data-i18n="mod.screenshots.guidelines" data-i18n-fallback="All screenshots should be 1920×1080 resolution for best display quality.">All screenshots should be 1920×1080 resolution for best display quality.</p>
  `;
}

// Render install tab
function renderInstallTab() {
  return `
    <h2 data-i18n="mod.tabs.install" data-i18n-fallback="Install">Install</h2>
    <h3>Install Instructions</h3>
    <pre><code>${App.currentMod.installInstructions}</code></pre>
    
    <h3>Download</h3>
    <p><a href="${App.currentMod.downloadUrl}" class="btn btn-primary" data-i18n="common.download" data-i18n-fallback="Download">Download Latest Version</a></p>
    
    <h3>Version</h3>
    <p><strong>Current Version:</strong> ${App.currentMod.version}</p>
    
    <h3>Source Code</h3>
    <p><a href="${App.currentMod.sourceCode}" target="_blank" data-i18n="mod.sourceCode" data-i18n-fallback="View Source Code on GitHub">View Source Code on GitHub</a></p>
    
    <h3>License</h3>
    <p><strong>License:</strong> ${App.currentMod.license}</p>
    <p><strong>Author:</strong> ${App.currentMod.author}</p>
  `;
}

// Render compatibility tab
function renderCompatibilityTab() {
  return `
    <h2 data-i18n="mod.tabs.compatibility" data-i18n-fallback="Compatibility">Compatibility</h2>
    <h3>System Requirements</h3>
    <ul>
      <li><strong>Game Version:</strong> ${App.currentMod.gameVersion}</li>
      <li><strong>Operating System:</strong> Cross-platform (Windows, Linux, macOS)</li>
      <li><strong>Architecture:</strong> 64-bit</li>
    </ul>
    
    <h3>Mod Dependencies</h3>
    <p>${App.currentMod.compatibility}</p>
    
    ${App.currentMod.category.includes('Gameplay') ? `
      <h3>Conflict Information</h3>
      <div id="conflictChecker">
        <p><em>Check for conflicts with other mods</em></p>
        <button class="btn btn-secondary" onclick="checkConflicts()" data-i18n="common.checkConflicts" data-i18n-fallback="Check Conflicts">Check Conflicts</button>
        <div id="conflictResult" class="mt-16 hidden"></div>
      </div>
    ` : ''}
    
    <h3>Multiplayer Support</h3>
    <p>Yes - All mods support multiplayer if all players have the same version.</p>
  `;
}

// Extract key features from description
function extractKeyFeatures(description) {
  const features = description.match(/- [^\n]+/g) || [];
  return features.slice(0, 5).map(f => f.replace('- ', ''));
}

// Extract features from description  
function extractFeatures(description) {
  const features = description.match(/- [^\n]+/g) || [];
  return features.filter(f => f.includes('pure GUI') || f.includes('zero') || f.includes('compatible') || f.includes('no') || f.includes('automatically') || f.includes('override') || f.includes('component'));
}

// Initialize conflict checker
function initializeConflictChecker() {
  if (App.currentMod.category.includes('Gameplay')) {
    window.checkConflicts = function() {
      const conflicts = [];
      
      if (App.currentMod.id === 'personal_names') {
        conflicts.push('Identity component override (may conflict with other Identity overrides)');
      }
      if (App.currentMod.id === 'skills_mod') {
        conflicts.push('ResourceGatherer, DelayedDamage, Health, Builder component overrides');
      }
      
      const result = document.getElementById('conflictResult');
      if (conflicts.length > 0) {
        result.innerHTML = `
          <div style="background: #5a0000; border: 1px solid #ff0000; padding: 16px; border-radius: 4px;">
            <strong>Potential Conflicts Detected:</strong>
            <ul style="margin-top: 8px;">
              ${conflicts.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <p style="margin-top: 8px; font-size: 0.875rem;">Ensure all players have the same version of conflicting mods, or disable conflicting mods.</p>
          </div>
        `;
      } else {
        result.innerHTML = `
          <div style="background: #005a00; border: 1px solid #00ff00; padding: 16px; border-radius: 4px;">
            <strong>No conflicts detected</strong> with recommended mod combinations.
          </div>
        `;
      }
      result.classList.remove('hidden');
    };
  }
}

// Show not found message
function showNotFoundMessage() {
  if (DOM.modDetailContent) {
    DOM.modDetailContent.innerHTML = `
      <div class="text-center" style="padding: 64px 0;">
        <h2>Mod Not Found</h2>
        <p>The requested mod could not be found or may have been removed.</p>
        <a href="index.html" class="btn btn-primary">Back to Mods</a>
      </div>
    `;
  }
}

// Initialize language switcher using the new LanguageService
function initializeLanguageSwitcher() {
  const languageSwitchers = document.querySelectorAll('[id="languageSwitcher"]');
  
  languageSwitchers.forEach(switcher => {
    const select = switcher.querySelector('select');
    if (select) {
      select.value = LanguageService.currentLang;
      select.addEventListener('change', (e) => {
        LanguageService.switchLanguage(e.target.value);
      });
    }
  });
}

// Event Listeners
function initializeEventListeners() {
  // Tab switching
  DOM.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      updateURLParameter('tab', tabName);
      renderModDetail();
    });
  });
  
  // Navigation
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      window.location.href = href;
    });
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Update URL parameter
function updateURLParameter(param, value) {
  const url = new URL(window.location);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.pushState({}, '', url);
}

// Initialize app
async function init() {
  await initializeLanguageSystem();
  await loadModsData();
  renderModCards();
  initializeEventListeners();
  handleModDetailPage();
  updateLanguageSwitcher();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}