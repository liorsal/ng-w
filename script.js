// ניהול כפתור נגישות
class AccessibilityManager {
    constructor() {
        this.fontSize = 100; // אחוז
        this.settings = {
            highContrast: false,
            largeCursor: false,
            underlineLinks: false,
            readableFont: false
        };
        
        this.init();
        this.loadSettings();
    }

    init() {
        // אלמנטים
        this.accessibilityBtn = document.getElementById('accessibilityBtn');
        this.accessibilityPanel = document.getElementById('accessibilityPanel');
        this.closePanel = document.getElementById('closePanel');
        this.decreaseFont = document.getElementById('decreaseFont');
        this.increaseFont = document.getElementById('increaseFont');
        this.fontSizeDisplay = document.getElementById('fontSizeDisplay');
        this.highContrast = document.getElementById('highContrast');
        this.largeCursor = document.getElementById('largeCursor');
        this.underlineLinks = document.getElementById('underlineLinks');
        this.readableFont = document.getElementById('readableFont');
        this.resetSettings = document.getElementById('resetSettings');

        // אירועים
        this.accessibilityBtn.addEventListener('click', () => this.togglePanel());
        this.closePanel.addEventListener('click', () => this.closePanelHandler());
        this.decreaseFont.addEventListener('click', () => this.decreaseFontSize());
        this.increaseFont.addEventListener('click', () => this.increaseFontSize());
        this.highContrast.addEventListener('change', (e) => this.toggleHighContrast(e.target.checked));
        this.largeCursor.addEventListener('change', (e) => this.toggleLargeCursor(e.target.checked));
        this.underlineLinks.addEventListener('change', (e) => this.toggleUnderlineLinks(e.target.checked));
        this.readableFont.addEventListener('change', (e) => this.toggleReadableFont(e.target.checked));
        this.resetSettings.addEventListener('click', () => this.resetAllSettings());

        // סגירת פאנל בלחיצה מחוץ לו
        document.addEventListener('click', (e) => {
            if (this.accessibilityPanel.classList.contains('active') &&
                !this.accessibilityPanel.contains(e.target) &&
                !this.accessibilityBtn.contains(e.target)) {
                this.closePanelHandler();
            }
        });

        // סגירת פאנל ב-ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.accessibilityPanel.classList.contains('active')) {
                this.closePanelHandler();
            }
        });

        // עדכון מצב הפאנל ל-ARIA
        this.updateAriaAttributes();
    }

    togglePanel() {
        const isActive = this.accessibilityPanel.classList.contains('active');
        if (isActive) {
            this.closePanelHandler();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.accessibilityPanel.classList.add('active');
        this.accessibilityPanel.setAttribute('aria-hidden', 'false');
        this.closePanel.focus();
    }

    closePanelHandler() {
        this.accessibilityPanel.classList.remove('active');
        this.accessibilityPanel.setAttribute('aria-hidden', 'true');
        this.accessibilityBtn.focus();
    }

    updateAriaAttributes() {
        const isActive = this.accessibilityPanel.classList.contains('active');
        this.accessibilityPanel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    }

    decreaseFontSize() {
        if (this.fontSize > 75) {
            this.fontSize -= 25;
            this.applyFontSize();
            this.saveSettings();
        }
    }

    increaseFontSize() {
        if (this.fontSize < 200) {
            this.fontSize += 25;
            this.applyFontSize();
            this.saveSettings();
        }
    }

    applyFontSize() {
        const body = document.body;
        body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large', 'font-size-xlarge', 'font-size-xxlarge');
        
        if (this.fontSize <= 75) {
            body.classList.add('font-size-small');
        } else if (this.fontSize <= 100) {
            body.classList.add('font-size-medium');
        } else if (this.fontSize <= 125) {
            body.classList.add('font-size-large');
        } else if (this.fontSize <= 150) {
            body.classList.add('font-size-xlarge');
        } else {
            body.classList.add('font-size-xxlarge');
        }

        this.fontSizeDisplay.textContent = `${this.fontSize}%`;
    }

    toggleHighContrast(enabled) {
        this.settings.highContrast = enabled;
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        this.saveSettings();
    }

    toggleLargeCursor(enabled) {
        this.settings.largeCursor = enabled;
        if (enabled) {
            document.body.classList.add('large-cursor');
        } else {
            document.body.classList.remove('large-cursor');
        }
        this.saveSettings();
    }

    toggleUnderlineLinks(enabled) {
        this.settings.underlineLinks = enabled;
        if (enabled) {
            document.body.classList.add('underline-links');
        } else {
            document.body.classList.remove('underline-links');
        }
        this.saveSettings();
    }

    toggleReadableFont(enabled) {
        this.settings.readableFont = enabled;
        if (enabled) {
            document.body.classList.add('readable-font');
        } else {
            document.body.classList.remove('readable-font');
        }
        this.saveSettings();
    }

    resetAllSettings() {
        // איפוס הגדרות
        this.fontSize = 100;
        this.settings = {
            highContrast: false,
            largeCursor: false,
            underlineLinks: false,
            readableFont: false
        };

        // הסרת כל הקלאסים
        document.body.classList.remove(
            'high-contrast',
            'large-cursor',
            'underline-links',
            'readable-font',
            'font-size-small',
            'font-size-medium',
            'font-size-large',
            'font-size-xlarge',
            'font-size-xxlarge'
        );

        // עדכון UI
        this.applyFontSize();
        this.highContrast.checked = false;
        this.largeCursor.checked = false;
        this.underlineLinks.checked = false;
        this.readableFont.checked = false;

        // שמירה
        this.saveSettings();
        
        // הודעת אישור
        this.showNotification('הגדרות אופסו בהצלחה');
    }

    saveSettings() {
        const data = {
            fontSize: this.fontSize,
            settings: this.settings
        };
        localStorage.setItem('accessibilitySettings', JSON.stringify(data));
    }

    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.fontSize = data.fontSize || 100;
                this.settings = { ...this.settings, ...data.settings };

                // יישום הגדרות
                this.applyFontSize();
                this.highContrast.checked = this.settings.highContrast;
                this.largeCursor.checked = this.settings.largeCursor;
                this.underlineLinks.checked = this.settings.underlineLinks;
                this.readableFont.checked = this.settings.readableFont;

                if (this.settings.highContrast) {
                    document.body.classList.add('high-contrast');
                }
                if (this.settings.largeCursor) {
                    document.body.classList.add('large-cursor');
                }
                if (this.settings.underlineLinks) {
                    document.body.classList.add('underline-links');
                }
                if (this.settings.readableFont) {
                    document.body.classList.add('readable-font');
                }
            } catch (e) {
                console.error('שגיאה בטעינת הגדרות:', e);
            }
        }
    }

    showNotification(message) {
        // יצירת הודעת התראה
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// הוספת אנימציות CSS להודעות
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// אתחול כשהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
});

