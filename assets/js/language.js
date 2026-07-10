/* Core Language Service for 0 A.D. Mods Website */

// Language Service
const LanguageService = {
  currentLang: 'en',
  translations: null,
  
  // Detect user language based on browser/region and saved preference
  async detectLanguage() {
    // Check localStorage first for saved preference
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && ['en', 'es'].includes(saved)) {
      return saved;
    }
    
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.toLowerCase().split('-')[0];
    
    return ['en', 'es'].includes(langCode) ? langCode : 'en';
  },
  
  // Load translations from JSON file
  async loadTranslations() {
    try {
      const response = await fetch('/gamestudio/assets/data/translations.json');
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }
      this.translations = await response.json();
      console.log('Translations loaded successfully');
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to minimal translations to prevent crashes
      this.translations = {
        en: { common: { error: 'Translation service unavailable' } },
        es: { common: { error: 'Servicio de traducción no disponible' } }
      };
    }
  },
  
  // Get translation for a key, with fallback support for dot notation
  t(key, fallback = null) {
    if (!this.translations || !this.translations[this.currentLang]) {
      return fallback || key;
    }
    
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (!value || !value[k]) {
        return fallback || key;
      }
      value = value[k];
    }
    
    return typeof value === 'string' ? value : fallback || key;
  },
  
  // Switch language and update all UI elements
  switchLanguage(lang) {
    if (!['en', 'es'].includes(lang)) {
      console.warn('Unsupported language:', lang);
      return;
    }
    
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update UI elements with translations
    this.updateUIElements();
    
    // Update URL without reloading (for SEO and bookmarks)
    const url = new URL(window.location);
    if (lang === 'en') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.pushState({}, '', url);
    
    console.log('Language switched to:', lang);
  },
  
  // Update all elements with data-i18n attributes
  updateUIElements() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const fallback = element.getAttribute('data-i18n-fallback') || key;
      const translation = this.t(key, fallback);
      
      if (element.tagName === 'INPUT' && element.getAttribute('placeholder') !== null) {
        element.placeholder = translation;
      } else if (element.tagName === 'TITLE') {
        document.title = translation;
      } else if (element.innerHTML.includes('{{')) {
        // Handle templated content
        element.innerHTML = translation.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
          return element.getAttribute(`data-var-${varName}`) || match;
        });
      } else {
        element.textContent = translation;
      }
    });
  },
  
  // Get current language display name
  getCurrentLanguageDisplay() {
    const displays = {
      en: 'English',
      es: 'Español'
    };
    return displays[this.currentLang] || 'English';
  }
};

// Initialize language system
async function initializeLanguageSystem() {
  // Detect user language
  LanguageService.currentLang = await LanguageService.detectLanguage();
  
  // Load translations
  await LanguageService.loadTranslations();
  
  // Update UI with detected language
  LanguageService.updateUIElements();
  
  // Update language switcher
  updateLanguageSwitcher();
  
  console.log('Language system initialized:', LanguageService.currentLang);
}

// Update language switcher select element
function updateLanguageSwitcher() {
  const selects = document.querySelectorAll('#languageSwitcher select');
  
  selects.forEach(select => {
    select.value = LanguageService.currentLang;
    
    const newSelect = select.cloneNode(true);
    select.parentNode.replaceChild(newSelect, select);
    
    newSelect.addEventListener('change', (e) => {
      LanguageService.switchLanguage(e.target.value);
    });
  });
}

// Export for use in other modules
window.LanguageService = LanguageService;
window.initializeLanguageSystem = initializeLanguageSystem;