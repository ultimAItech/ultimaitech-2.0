/**
 * Internationalization (i18n) System
 * Handles multi-language support for EN, DE, NL
 */

class I18n {
  constructor() {
    this.currentLang = 'en';
    this.translations = {};
    this.supportedLanguages = ['en', 'de', 'nl'];
    this.init();
  }

  async init() {
    // Detect language from URL, localStorage, or browser
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const storedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];

    if (urlLang && this.supportedLanguages.includes(urlLang)) {
      this.currentLang = urlLang;
    } else if (storedLang && this.supportedLanguages.includes(storedLang)) {
      this.currentLang = storedLang;
    } else if (this.supportedLanguages.includes(browserLang)) {
      this.currentLang = browserLang;
    }

    // Load translations
    await this.loadTranslations(this.currentLang);
    this.applyTranslations();
    this.setupLanguageSwitcher();
  }

  async loadTranslations(lang) {
    try {
      const response = await fetch(`/translations/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang} translations`);
      this.translations = await response.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        await this.loadTranslations('en');
      }
    }
  }

  applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getNestedTranslation(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
  }

  getNestedTranslation(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations);
  }

  setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-option');
    
    langButtons.forEach(button => {
      const lang = button.getAttribute('data-lang');
      
      // Set active state
      if (lang === this.currentLang) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }

      // Add click handler
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeLanguage(lang);
      });
    });
  }

  async changeLanguage(lang) {
    if (!this.supportedLanguages.includes(lang) || lang === this.currentLang) {
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    await this.loadTranslations(lang);
    this.applyTranslations();
    this.setupLanguageSwitcher();

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.pushState({}, '', url);
  }

  t(key) {
    return this.getNestedTranslation(key) || key;
  }
}

// Initialize i18n when DOM is ready
let i18n;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
  });
} else {
  i18n = new I18n();
}

export default i18n;
