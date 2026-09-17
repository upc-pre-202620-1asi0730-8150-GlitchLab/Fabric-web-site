let currentLang = 'en';

function updateContent(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}

function updateToggleState(lang) {
    // Desktop
    const desktopBtns = document.querySelectorAll('.lang-btn');
    desktopBtns.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('bg-white', 'shadow-sm', 'text-main');
            btn.classList.remove('text-graytext');
        } else {
            btn.classList.remove('bg-white', 'shadow-sm', 'text-main');
            btn.classList.add('text-graytext');
        }
    });

    // Mobile
    const mobileBtns = document.querySelectorAll('.lang-btn-mob');
    mobileBtns.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('bg-gray-200', 'text-main');
            btn.classList.remove('text-graytext');
        } else {
            btn.classList.remove('bg-gray-200', 'text-main');
            btn.classList.add('text-graytext');
        }
    });
}

// Initialize click events for lang toggle
document.querySelectorAll('.lang-btn, .lang-btn-mob').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        if (lang !== currentLang) {
            currentLang = lang;
            updateContent(currentLang);
            updateToggleState(currentLang);
        }
    });
});

// Mobile menu toggle
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Initial setup
updateContent(currentLang);
updateToggleState(currentLang);