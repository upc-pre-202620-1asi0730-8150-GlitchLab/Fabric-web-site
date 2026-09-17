document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open');
        });

        // Cierra el menú al hacer clic en un enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('is-open');
                mobileMenu.classList.remove('is-open');
            });
        });
    }
});

function applyTranslations(lang) {
    const t = window.translations && window.translations[lang];
    if (!t) {
        console.warn(`No translations found for: ${lang}`);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.setAttribute('placeholder', t[key]);
    });

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('.lang-btn, .lang-btn-mob').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('lang') || 'en';
    applyTranslations(saved);

    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            applyTranslations(btn.getAttribute('data-lang'));
        });
    });
});