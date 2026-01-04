// Common I18n System for All Pages
class I18nSystem {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.supportedLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'pt-br', 'nl', 'sv', 'da', 'no', 'fi', 'pl', 'ru', 'uk', 'cs', 'hu', 'ro', 'tr', 'ar', 'fa', 'hi', 'bn', 'th', 'vi', 'id', 'ms', 'fil', 'zh', 'zh-tw', 'ja', 'ko'];
        this.websiteConfig = null;
    }

    async loadWebsiteConfig() {
        try {
            const configPath = window.WEBSITE_CONFIG_PATH || './config/website_config.json';
            const response = await fetch(configPath);
            if (response.ok) {
                this.websiteConfig = await response.json();
            }
        } catch (error) {
            console.warn('Failed to load website config, using defaults');
            this.websiteConfig = {
                websiteName: 'Example.Com',
                websiteDomain: 'example.com',
                companyName: 'Example Company'
            };
        }
    }

    replaceVariables(text) {
        if (!text || typeof text !== 'string') return text;
        
        if (this.websiteConfig) {
            return text
                .replace(/\{websiteName\}/g, this.websiteConfig.websiteName)
                .replace(/\{websiteDomain\}/g, this.websiteConfig.websiteDomain)
                .replace(/\{companyName\}/g, this.websiteConfig.companyName);
        }
        
        return text;
    }

    async loadLanguage(lang) {
        try {
            // Load website config if not already loaded
            if (!this.websiteConfig) {
                await this.loadWebsiteConfig();
            }

            const cached = localStorage.getItem(`lang_${lang}`);
            if (cached) {
                this.translations[lang] = JSON.parse(cached);
                this.applyLanguage(lang);
                this.dispatchReadyEvent();
                return;
            }

            const response = await fetch(`./locales/${this.getPageType()}/${lang}.json`);
            if (!response.ok) {
                throw new Error('Language not found');
            }
            
            const data = await response.json();
            
            // Replace variables in the translation data
            this.translations[lang] = this.replaceVariablesInObject(data);
            
            localStorage.setItem(`lang_${lang}`, JSON.stringify(this.translations[lang]));
            this.applyLanguage(lang);
            document.getElementById('langs').value = lang;
            this.dispatchReadyEvent();
        } catch (error) {
            if (lang !== 'en') {
                await this.loadLanguage('en');
            }
        }
    }

    replaceVariablesInObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return this.replaceVariables(obj);
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.replaceVariablesInObject(item));
        }
        
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = this.replaceVariablesInObject(value);
        }
        return result;
    }
    
    dispatchReadyEvent() {
        // Dispatch custom event when I18nSystem is ready
        const event = new CustomEvent('i18nReady', {
            detail: { language: this.currentLang }
        });
        document.dispatchEvent(event);
    }

    getPageType() {
        // Determine page type based on current URL or page context
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('cur');
        
        switch(currentPage) {
            case 'home': return 'home';
            case 'loading': return 'loading';
            case 'connect': return 'connect';
            case 'finish': return 'finish';
            default: return 'home';
        }
    }

    applyLanguage(lang) {
        this.currentLang = lang;
        const t = this.translations[lang];
        if (!t) return;

        // Update page title
        document.title = t.pageTitle || 'Example.Com';

        // Handle RTL languages
        const rtlLanguages = ['ar', 'fa', 'he', 'ur'];
        const isRTL = rtlLanguages.includes(lang);
        
        // Update document direction
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        
        // Update body direction
        document.body.style.direction = isRTL ? 'rtl' : 'ltr';
        document.body.style.textAlign = isRTL ? 'right' : 'left';

        // Update all text elements based on page type
        this.updatePageContent(t, isRTL);

        // Update language selector options
        this.updateLanguageOptions(t.languageOptions || {});
    }

    updatePageContent(t, isRTL) {
        const pageType = this.getPageType();
        
        switch(pageType) {
            case 'loading':
                this.updateLoadingContent(t, isRTL);
                break;
            case 'home':
                this.updateHomeContent(t, isRTL);
                break;
            case 'connect':
                this.updateConnectContent(t, isRTL);
                break;
            case 'finish':
                this.updateFinishContent(t, isRTL);
                break;
        }
    }

    updateLoadingContent(t, isRTL) {
        const textMap = {
            'main-title': 'mainTitle',
            'description': 'description',
            'note': 'note'
        };

        Object.entries(textMap).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el && t[key]) {
                el.textContent = t[key];
                
                if (isRTL) {
                    el.style.textAlign = 'right';
                    el.style.direction = 'rtl';
                } else {
                    el.style.textAlign = 'left';
                    el.style.direction = 'ltr';
                }
            }
        });
    }

    updateHomeContent(t, isRTL) {
        const textMap = {
            'main-title': 'mainTitle',
            'description-1': 'description1',
            'cooperation-text': 'cooperationText',
            'terms-text': 'termsText',
            'terms-link': 'termsLink',
            'verify-btn-text': 'verifyBtnText',
            'security-btn-text': 'securityBtnText',
            'modal-title-text': 'modalTitle',
            'signs-title': 'signsTitle',
            'action-title': 'actionTitle',
            'modal-note': 'modalNote'
        };

        Object.entries(textMap).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el && t[key]) {
                el.textContent = t[key];
            }
        });

        this.updateDate();
        this.safeRenderList('signs-list', t.signsList || []);
        this.safeRenderList('action-list', t.actionList || []);
    }

    updateConnectContent(t, isRTL) {
        const textMap = {
            'main-title': 'mainTitle',
            'description-1': 'description1',
            'instructions': 'instructions',
            'paste-info': 'pasteInfo',
            'error-message': 'errorMessage',
            'confirm-button': 'confirmButton',
            'security-btn-text': 'securityBtnText',
            'modal-title-text': 'modalTitle',
            'best-practices-title': 'bestPracticesTitle',
            'protection-title': 'protectionTitle',
            'modal-note': 'modalNote'
        };

        Object.entries(textMap).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el && t[key]) el.textContent = t[key];
        });

        const phraseMap = {
            'phrase-12': 'phrase12',
            'phrase-15': 'phrase15',
            'phrase-18': 'phrase18',
            'phrase-21': 'phrase21',
            'phrase-24': 'phrase24'
        };

        Object.entries(phraseMap).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el && t[key]) el.textContent = t[key];
        });

        this.updateList('best-practices-list', t.bestPracticesList);
        this.updateList('protection-list', t.protectionList);
    }

    updateFinishContent(t, isRTL) {
        const textMap = {
            'main-title': 'mainTitle',
            'description-1': 'description1',
            'security-title': 'securityTitle',
            'security-message': 'securityMessage',
            'thank-you-text': 'thankYouText',
            'home-button-text': 'homeButtonText'
        };

        Object.entries(textMap).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el && t[key]) {
                el.textContent = t[key];
                
                // Apply RTL styling to text elements
                if (isRTL) {
                    el.style.textAlign = 'right';
                    el.style.direction = 'rtl';
                } else {
                    el.style.textAlign = 'left';
                    el.style.direction = 'ltr';
                }
            }
        });
        

    }

    updateLanguageOptions(options) {
        const select = document.getElementById('langs');
        if (!select) return;

        // Clear existing options
        select.innerHTML = '';

        // If no options provided, try to get them from English translations
        if (!options || Object.keys(options).length === 0) {
            if (this.translations['en'] && this.translations['en'].languageOptions) {
                options = this.translations['en'].languageOptions;
            } else {
                // Fallback to basic options if English is not available
                options = {
                    "en": "English",
                    "es": "Español",
                    "fr": "Français",
                    "de": "Deutsch",
                    "it": "Italiano",
                    "pt": "Português",
                    "pt-br": "Português (Brasil)",
                    "nl": "Nederlands",
                    "sv": "Svenska",
                    "da": "Dansk",
                    "no": "Norsk",
                    "fi": "Suomi",
                    "pl": "Polski",
                    "ru": "Русский",
                    "uk": "Українська",
                    "cs": "Čeština",
                    "hu": "Magyar",
                    "ro": "Română",
                    "tr": "Türkçe",
                    "ar": "العربية",
                    "fa": "فارسی",
                    "hi": "हिन्दी",
                    "bn": "বাংলা",
                    "th": "ไทย",
                    "vi": "Tiếng Việt",
                    "id": "Bahasa Indonesia",
                    "ms": "Bahasa Melayu",
                    "fil": "Filipino",
                    "zh": "中文(简体)",
                    "zh-tw": "中文(繁體)",
                    "ja": "日本語",
                    "ko": "한국어"
                };
            }
        }

        // Generate options dynamically
        Object.entries(options).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            option.style.direction = 'ltr';
            option.style.textAlign = 'left';
            select.appendChild(option);
        });

        // Set the current language as selected
        select.value = this.currentLang;
    }

    updateList(listId, items = []) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        list.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }

    safeRenderText(id, text) {
        const element = document.getElementById(id);
        if (!element || !text) return;
        
        // Create temporary element to safely set text content
        const temp = document.createElement('div');
        temp.textContent = text;
        element.innerHTML = temp.textContent;
    }

    safeRenderList(listId, items) {
        const list = document.getElementById(listId);
        if (!list) return;
        
        list.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });
    }

    updateDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateStr = tomorrow.toLocaleDateString(this.currentLang, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const t = this.translations[this.currentLang];
        if (!t) return;
        
        const deadlineElement = document.getElementById('deadline-text');
        if (!deadlineElement) return;
        
        while (deadlineElement.firstChild) {
            deadlineElement.removeChild(deadlineElement.firstChild);
        }
        
        const [beforeDate, afterDate] = t.deadlineText.split('{date}');
        
        if (beforeDate) {
            deadlineElement.appendChild(document.createTextNode(beforeDate));
        }
        
        const strongDate = document.createElement('strong');
        strongDate.id = 'dynamic-date';
        strongDate.textContent = dateStr;
        deadlineElement.appendChild(strongDate);
        
        if (afterDate) {
            deadlineElement.appendChild(document.createTextNode(afterDate));
        }
        
        const restrictionText = document.createElement('b');
        restrictionText.id = 'restriction-text';
        restrictionText.textContent = t.restrictionText || '';
        deadlineElement.appendChild(restrictionText);
    }

    init() {
        // Clear all cached language data to force fresh load
        this.supportedLangs.forEach(lang => {
            localStorage.removeItem(`lang_${lang}`);
        });

        // Get saved language preference
        const savedLang = localStorage.getItem('preferredLang');
        
        // Detect browser language with fallback chain
        const browserLang = this.detectBrowserLanguage();
        
        // Determine default language: saved preference > browser language > English
        let defaultLang = 'en';
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            defaultLang = savedLang;
        } else if (browserLang && this.supportedLangs.includes(browserLang)) {
            defaultLang = browserLang;
            // Store browser language as default if no saved preference
            localStorage.setItem('preferredLang', browserLang);
        }

        // Generate language options immediately
        this.updateLanguageOptions();

        this.loadLanguage(defaultLang);

        // Set up language selector event listener
        const langSelect = document.getElementById('langs');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                const selectedLang = e.target.value;
                this.loadLanguage(selectedLang);
                localStorage.setItem('preferredLang', selectedLang);
            });
        }
    }
    
    detectBrowserLanguage() {
        // Get browser language preferences
        const languages = navigator.languages || [navigator.language];
        
        // Check each language in order of preference
        for (let lang of languages) {
            // Extract base language code (e.g., 'en' from 'en-US')
            const baseLang = lang.split('-')[0].toLowerCase();
            
            // Check if it's supported
            if (this.supportedLangs.includes(baseLang)) {
                return baseLang;
            }
            
            // Special handling for Chinese variants
            if (lang.toLowerCase().startsWith('zh')) {
                if (lang.toLowerCase().includes('tw') || lang.toLowerCase().includes('hk')) {
                    return 'zh-tw';
                } else {
                    return 'zh';
                }
            }
            
            // Special handling for Portuguese variants
            if (lang.toLowerCase().startsWith('pt')) {
                if (lang.toLowerCase().includes('br')) {
                    return 'pt-br';
                } else {
                    return 'pt';
                }
            }
        }
        
        // Return null if no supported language found
        return null;
    }
} 