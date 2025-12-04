// Language Handling
let currentLang = localStorage.getItem('language') || 'nl';

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = translations[currentLang];
        keys.forEach(key => {
            if (value) value = value[key];
        });

        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else if (element.tagName === 'UL' && Array.isArray(value)) {
                // Handle lists (like pricing features)
                element.innerHTML = value.map(item => `<li>${item}</li>`).join('');
            } else if (element.tagName === 'OPTION') {
                element.textContent = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update active state in switcher if present
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        updateContent();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateContent();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Language Switcher Click Handlers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage(btn.getAttribute('data-lang'));
        });
    });
});

