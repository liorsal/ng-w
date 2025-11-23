document.addEventListener('DOMContentLoaded', () => {
    initWidgetTriggers();
    initCopyButton();
    initStickyHeader();
    initSmoothScroll();
});

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

/**
 * 2. פונקציונליות "העתק קוד" בחלון ההטמעה
 */
function initCopyButton() {
    const copyBtn = document.querySelector('.btn-copy');
    const codeBlock = document.querySelector('code');

    if (!copyBtn || !codeBlock) return;

    copyBtn.addEventListener('click', async () => {
        try {
            // העתקה ללוח
            await navigator.clipboard.writeText(codeBlock.innerText);
            
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