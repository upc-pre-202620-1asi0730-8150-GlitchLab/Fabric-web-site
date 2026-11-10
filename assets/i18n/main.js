// Enables the CSS states that depend on JavaScript (e.g. reveal on scroll)
document.documentElement.classList.add('js');

/* ===== Mobile menu ===== */
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burger && mobileMenu) {
        const setOpen = isOpen => {
            burger.classList.toggle('is-open', isOpen);
            mobileMenu.classList.toggle('is-open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
        };

        burger.addEventListener('click', () => {
            setOpen(!mobileMenu.classList.contains('is-open'));
        });

        // Close the menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setOpen(false));
        });
    }
});

/* ===== Header: shadow on scroll and active link ===== */
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const updateNav = () => nav.classList.toggle('nav--scrolled', window.scrollY > 12);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    const links = document.querySelectorAll('.nav__link[href^="#"], .nav__mobile-link[href^="#"]');
    const sections = [...new Set([...links].map(link => link.getAttribute('href')))]
        .map(id => document.querySelector(id))
        .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setActive = id => {
        links.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
    };

    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActive(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(section => spy.observe(section));
});

/* ===== Reveal sections smoothly when they enter the screen ===== */
document.addEventListener('DOMContentLoaded', () => {
    const selectors = [
        '.hero__text', '.hero__media',
        '.section__header',
        '.card', '.solution-card', '.feature', '.benefit',
        '.screenshot-wrapper', '.video', '.plan',
        '.team__member', '.about-team', '.cta-banner',
        '.legal-hero .container', '.legal-toc', '.legal-item', '.legal-note',
        '.footer__top > *'
    ];

    const elements = document.querySelectorAll(selectors.join(','));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('reveal', 'is-visible'));
        return;
    }

    elements.forEach(el => {
        // Hide the element instantly (without animating the hiding)
        el.style.transition = 'none';
        el.classList.add('reveal');
        void el.offsetHeight;
        el.style.transition = '';

        // Elements inside the same group appear one after another
        const siblings = [...el.parentElement.children].filter(child => child.matches(selectors.join(',')));
        const index = siblings.indexOf(el);
        if (index > 0) el.style.transitionDelay = `${Math.min(index, 5) * 90}ms`;
    });

    // Once visible, give the element back its own hover transitions
    const cleanUp = el => {
        el.classList.remove('reveal', 'is-visible');
        el.style.transitionDelay = '';
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('is-visible');
            el.addEventListener('transitionend', () => cleanUp(el), { once: true });
            obs.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
});

/* ===== Translations ===== */
function applyTranslations(lang) {
    const t = window.translations && window.translations[lang];

    if (!t) {
        console.warn(`No translations found for: ${lang}`);
        return;
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');

        if (t[key]) {
            el.textContent = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');

        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });

    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('.lang-btn, .lang-btn-mob').forEach(btn => {
        btn.classList.toggle(
            'active',
            btn.getAttribute('data-lang') === lang
        );
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

/* ===== Plan selection popup ===== */
document.addEventListener('DOMContentLoaded', () => {
    const successMessage = document.getElementById('plan-success');

    // Only the landing page has plans
    if (!successMessage) return;

    document.querySelectorAll('#plans .plan__buy').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();

            const planElement = button.closest('.plan')
                ?.querySelector('.plan__name');

            const plan = planElement
                ? planElement.textContent.trim()
                : 'seleccionado';

            const isSpanish = document.documentElement.lang === 'es';

            successMessage.innerHTML = `
                <div class="plan-success__box" role="dialog"
                     aria-modal="true"
                     aria-labelledby="plan-success-title">
                    <button type="button"
                            class="plan-success__x"
                            aria-label="${isSpanish ? 'Cerrar' : 'Close'}">
                        &times;
                    </button>

                    <div class="plan-success__check" aria-hidden="true">✓</div>

                    <h2 id="plan-success-title">
                        ${isSpanish ? '¡Plan seleccionado!' : 'Plan selected!'}
                    </h2>

                    <p>
                        ${isSpanish
                ? `Has seleccionado el plan ${plan} correctamente.`
                : `You have successfully selected the ${plan} plan.`}
                    </p>

                    <button type="button"
                            class="btn btn--primary plan-success__close">
                        ${isSpanish ? 'Aceptar' : 'OK'}
                    </button>
                </div>
            `;

            successMessage.hidden = false;

            const closePopup = () => {
                successMessage.hidden = true;
            };

            successMessage.querySelector('.plan-success__close')
                .addEventListener('click', closePopup);

            successMessage.querySelector('.plan-success__x')
                .addEventListener('click', closePopup);

            successMessage.onclick = event => {
                if (event.target === successMessage) {
                    closePopup();
                }
            };

            successMessage.querySelector('.plan-success__close').focus();
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !successMessage.hidden) {
            successMessage.hidden = true;
        }
    });
});
