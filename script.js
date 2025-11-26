document.addEventListener('DOMContentLoaded', () => {
    initWidgetTriggers();
    initCopyButton();
    initStickyHeader();
    initSmoothScroll();
    initScrollReveal();
    initMobileMenu();
    initAccordion();
    initBeforeAfterSlider();
    initDarkModeToggle();
    initContactForm();
});

function initDarkModeToggle() {
    const card = document.getElementById('card-darkmode');
    const toggle = document.getElementById('dm-toggle');
    
    if(!card || !toggle) return;

    // Set initial state (Active)
    let isActive = true;
    card.classList.add('is-dark');

    card.addEventListener('click', () => {
        isActive = !isActive;
        if(isActive) {
            card.classList.add('is-dark');
            toggle.classList.add('active');
        } else {
            card.classList.remove('is-dark');
            toggle.classList.remove('active');
        }
    });
}

/**
 * 1. חיבור כפתורי ה-CTA בדף לווידג'ט הנגישות
 */
function initWidgetTriggers() {
    // כפתור ראשי ב-Hero וכפתור בתפריט (אם נוסיף כזה)
    const triggers = document.querySelectorAll('#open-widget-hero, #nav-open-widget');
    
    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // מחפשים את הכפתור האמיתי של הווידג'ט שהוזרק לדף
            const widgetBtn = document.querySelector('.lior-acc-button');
            
            if (widgetBtn) {
                // מדמים לחיצה עליו
                widgetBtn.click();
                
                // אופציונלי: גלילה לראש הדף אם הווידג'ט שם
                // window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.warn('Accessibility widget not fully loaded yet.');
                // במקרה שהאינטרנט איטי והווידג'ט טרם נטען
                btn.textContent = 'טוען...';
                setTimeout(() => btn.textContent = 'התנסות בדמו חי', 2000);
            }
        });
    });

    // חיבור לינק "הצהרת נגישות" בפוטר
    const footerDeclLink = document.getElementById('footer-trigger');
    if (footerDeclLink) {
        footerDeclLink.addEventListener('click', (e) => {
            e.preventDefault();
            const declBtn = document.getElementById('lior-acc-declaration');
            
            if (declBtn) {
                declBtn.click();
            } else {
                // אם הפאנל סגור, ננסה לפתוח את הווידג'ט קודם
                const widgetBtn = document.querySelector('.lior-acc-button');
                if (widgetBtn) {
                    widgetBtn.click();
                    // נחכה שהפאנל ייפתח ואז נלחץ על ההצהרה
                    setTimeout(() => {
                        const declBtnLate = document.getElementById('lior-acc-declaration');
                        if(declBtnLate) declBtnLate.click();
                    }, 100);
                }
            }
        });
    }
}

function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    if (!headers.length) return;

    headers.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            
            // Close all others
            headers.forEach(otherBtn => {
                otherBtn.setAttribute('aria-expanded', 'false');
                const otherContent = otherBtn.nextElementSibling;
                if (otherContent) {
                    otherContent.style.maxHeight = null;
                }
            });

            // Toggle current
            if (!isExpanded && content) {
                button.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

function initBeforeAfterSlider() {
    const slider = document.querySelector('.ba-slider');
    const afterPanel = document.querySelector('.ba-panel.ba-after');

    if (!slider || !afterPanel) return;

    const update = () => {
        const value = slider.value || 50;
        afterPanel.style.setProperty('--ba-position', value + '%');
    };

    slider.addEventListener('input', update);
    update();
}

/**
 * 2. פונקציונליות "העתק קוד" בחלון ההטמעה
 */
function initCopyButton() {
    const copyBtn = document.querySelector('.btn-copy');
    const codeBlock = document.getElementById('integration-code');

    if (!copyBtn || !codeBlock) return;

    copyBtn.addEventListener('click', async () => {
        try {
            const codeToCopy = codeBlock.textContent.trim();

            if (!codeToCopy) {
                throw new Error('Missing code snippet content');
            }

            // העתקה ללוח
            await navigator.clipboard.writeText(codeToCopy);
            
            // פידבק ויזואלי למשתמש
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'הועתק בהצלחה! ✓';
            copyBtn.classList.add('copied');
            
            // החזרת הכפתור למצב התחלתי
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyBtn.textContent = 'שגיאה בהעתקה';
        }
    });
}

function initScrollReveal() {
    const reveals = document.querySelectorAll('.feature-card, .section-header, .hero-content, .code-panel, .wall-category');
    
    // Add class initially
    reveals.forEach(el => el.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();
}

function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    
    if(btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Close on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
}

/**
 * 3. הוספת צל לתפריט העליון בעת גלילה
 */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
}

/**
 * 4. גלילה חלקה ללינקים פנימיים (עוגנים)
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // התעלמות מלינקים ריקים
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('contact-status');

    if (!form || !statusEl) return;

    const apiUrl = 'https://zg89bs3zgb.execute-api.us-east-1.amazonaws.com/contact';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const name = (formData.get('name') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const message = (formData.get('message') || '').toString().trim();

        if (!name || !email || !message) {
            statusEl.textContent = 'אנא מלא את כל השדות.';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        statusEl.textContent = 'שולח...';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                data = {};
            }

            if (response.ok && data && data.success) {
                statusEl.textContent = 'הודעתך נשלחה בהצלחה!';
                form.reset();
            } else {
                statusEl.textContent = 'ארעה שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.';
            }
        } catch (error) {
            console.error('Contact form error:', error);
            statusEl.textContent = 'שגיאת רשת. נסה שוב מאוחר יותר.';
        } finally {
            const submitBtnFinally = form.querySelector('button[type="submit"]');
            if (submitBtnFinally) {
                submitBtnFinally.disabled = false;
            }
        }
    });
}