
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open');
        });

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

document.addEventListener('DOMContentLoaded', () => {
    const successMessage = document.getElementById('plan-success');

    if (!successMessage) {
        console.error('No se encontró el elemento #plan-success en index.html');
        return;
    }

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
