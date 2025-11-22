/**
 * ווידג'ט נגישות מתקדם - גרסה 2
 * עיצוב מודרני ומלוטש
 */

(function() {
  'use strict';

  // ניהול רישיון
  const LICENSE_MANAGER = {
    validKeys: ['TEST-555', 'DEMO-123', 'PROD-KEY'],
    validate: function(key) {
      return this.validKeys.includes(key) || key.startsWith('TEST-');
    },
    getClientKey: function() {
      const scripts = document.querySelectorAll('script[data-client-key]');
      if (scripts.length > 0) {
        return scripts[scripts.length - 1].getAttribute('data-client-key');
      }
      return null;
    }
  };

  // בדיקת רישיון
  const clientKey = LICENSE_MANAGER.getClientKey();
  if (!clientKey || !LICENSE_MANAGER.validate(clientKey)) {
    console.warn('ליאור Accessibility Widget: מפתח לקוח לא תקין או חסר');
    return;
  }

  // מצבים מוכנים מראש
  const PRESETS = {
    dyslexia: {
      name: 'דיסלקסיה',
      icon: '📖',
      settings: {
        fontSize: 125,
        readableFont: true,
        letterSpacing: '0.1em',
        wordSpacing: '0.2em',
        lineHeight: 1.8,
        disableAnimations: true
      }
    },
    vision: {
      name: 'לקויי ראייה',
      icon: '👁️',
      settings: {
        fontSize: 150,
        highContrast: true,
        underlineLinks: true,
        largeCursor: true,
        readableFont: true
      }
    },
    cognitive: {
      name: 'קוגניטיבי',
      icon: '🧠',
      settings: {
        fontSize: 120,
        readableFont: true,
        disableAnimations: true,
        highlightFocus: true,
        simplifyLayout: true
      }
    }
  };

  // מחלקת ווידג'ט נגישות
  class AccessibilityWidget {
    constructor() {
      this.isOpen = false;
      this.settings = this.loadSettings();
      this.ttsEnabled = false;
      this.ttsUtterance = null;
      this.init();
    }

    init() {
      this.createWidget();
      this.applySettings(this.settings);
      this.attachEvents();
    }

    createWidget() {
      const root = document.createElement('div');
      root.id = 'lior-acc-root';
      root.setAttribute('role', 'complementary');
      root.setAttribute('aria-label', 'תפריט נגישות');
      
      root.innerHTML = `
        <button class="lior-acc-button" 
                aria-label="פתח תפריט נגישות"
                aria-expanded="false"
                title="נגישות">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H13V9H21ZM14 10V12H22V10H14ZM20.5 13.08L15.08 18.5L13.5 16.92L14.92 15.5L11 15.5V13.5L14.92 13.5L13.5 12.08L15.08 10.5L20.5 15.92Z" fill="currentColor"/>
          </svg>
          <span class="lior-acc-pulse"></span>
        </button>

        <div class="lior-acc-panel" role="dialog" aria-labelledby="panel-title" aria-hidden="true">
          <div class="lior-acc-panel-header">
            <div class="lior-acc-header-content">
              <h2 id="panel-title">⚙️ הגדרות נגישות</h2>
              <p class="lior-acc-subtitle">התאם את האתר לצרכים שלך</p>
            </div>
            <button class="lior-acc-close" aria-label="סגור">&times;</button>
          </div>
          
          <div class="lior-acc-panel-content">
            <section class="lior-acc-section">
              <h3>🎯 מצבים מוכנים מראש</h3>
              <div class="lior-acc-presets">
                ${Object.entries(PRESETS).map(([key, preset]) => `
                  <button class="lior-acc-preset-btn" data-preset="${key}">
                    <span class="preset-icon">${preset.icon}</span>
                    <span class="preset-name">${preset.name}</span>
                  </button>
                `).join('')}
              </div>
            </section>

            <section class="lior-acc-section">
              <label class="lior-acc-label">גודל טקסט</label>
              <div class="lior-acc-control-group">
                <button class="lior-acc-control-btn" id="decrease-font" aria-label="הקטן">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <div class="lior-acc-display-wrapper">
                  <span class="lior-acc-display" id="font-size-display">${this.settings.fontSize || 100}%</span>
                </div>
                <button class="lior-acc-control-btn" id="increase-font" aria-label="הגדל">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6V18M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </section>

            <section class="lior-acc-section">
              <h3>🎨 התאמות עיצוב</h3>
              <div class="lior-acc-options">
                <label class="lior-acc-option">
                  <input type="checkbox" id="high-contrast" ${this.settings.highContrast ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  <span class="option-text">
                    <strong>ניגודיות גבוהה</strong>
                    <small>שיפור הקריאות</small>
                  </span>
                </label>
                <label class="lior-acc-option">
                  <input type="checkbox" id="readable-font" ${this.settings.readableFont ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  <span class="option-text">
                    <strong>גופן קריא</strong>
                    <small>גופן מותאם לקריאה</small>
                  </span>
                </label>
                <label class="lior-acc-option">
                  <input type="checkbox" id="underline-links" ${this.settings.underlineLinks ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  <span class="option-text">
                    <strong>קו תחתון לקישורים</strong>
                    <small>זיהוי קל יותר</small>
                  </span>
                </label>
                <label class="lior-acc-option">
                  <input type="checkbox" id="large-cursor" ${this.settings.largeCursor ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  <span class="option-text">
                    <strong>סמן גדול</strong>
                    <small>נוחות שימוש</small>
                  </span>
                </label>
                <label class="lior-acc-option">
                  <input type="checkbox" id="disable-animations" ${this.settings.disableAnimations ? 'checked' : ''}>
                  <span class="checkmark"></span>
                  <span class="option-text">
                    <strong>ביטול אנימציות</strong>
                    <small>למשתמשים רגישים</small>
                  </span>
                </label>
              </div>
            </section>

            <section class="lior-acc-section">
              <h3>🔊 קריאה בקול</h3>
              <div class="lior-acc-tts-controls">
                <button class="lior-acc-tts-btn primary" id="read-page" aria-label="קרא את הדף">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" fill="none"/>
                  </svg>
                  קרא את הדף
                </button>
                <button class="lior-acc-tts-btn secondary" id="stop-reading" aria-label="עצור קריאה" style="display:none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
                  </svg>
                  עצור
                </button>
              </div>
            </section>

            <section class="lior-acc-section">
              <button class="lior-acc-reset" id="reset-settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12Z" stroke="currentColor" stroke-width="2" fill="none"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                איפוס הגדרות
              </button>
            </section>
          </div>
        </div>
      `;

      this.injectStyles();
      document.body.appendChild(root);
      
      this.elements = {
        root: root,
        button: root.querySelector('.lior-acc-button'),
        panel: root.querySelector('.lior-acc-panel'),
        closeBtn: root.querySelector('.lior-acc-close'),
        decreaseFont: root.querySelector('#decrease-font'),
        increaseFont: root.querySelector('#increase-font'),
        fontSizeDisplay: root.querySelector('#font-size-display'),
        highContrast: root.querySelector('#high-contrast'),
        readableFont: root.querySelector('#readable-font'),
        underlineLinks: root.querySelector('#underline-links'),
        largeCursor: root.querySelector('#large-cursor'),
        disableAnimations: root.querySelector('#disable-animations'),
        readPage: root.querySelector('#read-page'),
        stopReading: root.querySelector('#stop-reading'),
        resetSettings: root.querySelector('#reset-settings'),
        presetButtons: root.querySelectorAll('.lior-acc-preset-btn')
      };
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        #lior-acc-root {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 10000;
          font-family: "Rubik", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
        }

        .lior-acc-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #0066cc;
          color: white;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
          overflow: visible;
        }

        .lior-acc-button:hover {
          background: #0052a3;
          box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
          transform: translateY(-2px);
        }

        .lior-acc-button:active {
          transform: translateY(0);
        }

        .lior-acc-button:focus {
          outline: 3px solid rgba(0, 102, 204, 0.3);
          outline-offset: 4px;
        }

        .lior-acc-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #0066cc;
          opacity: 0.4;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        .lior-acc-panel {
          position: absolute;
          bottom: 80px;
          left: 0;
          width: 380px;
          max-width: calc(100vw - 48px);
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(10px);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          max-height: calc(100vh - 140px);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .lior-acc-panel.active {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: all;
        }

        .lior-acc-panel-header {
          background: #0066cc;
          color: white;
          padding: 20px 24px;
          position: relative;
        }

        .lior-acc-header-content {
          position: relative;
          z-index: 1;
        }

        .lior-acc-panel-header h2 {
          margin: 0 0 4px 0;
          font-size: 22px;
          font-weight: 700;
        }

        .lior-acc-subtitle {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .lior-acc-close {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
          z-index: 2;
        }

        .lior-acc-close:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .lior-acc-panel-content {
          padding: 24px;
          overflow-y: auto;
          max-height: calc(100vh - 200px);
        }

        .lior-acc-section {
          margin-bottom: 28px;
        }

        .lior-acc-section:last-child {
          margin-bottom: 0;
        }

        .lior-acc-section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #1e293b;
          font-weight: 600;
        }

        .lior-acc-label {
          display: block;
          margin-bottom: 12px;
          font-weight: 600;
          color: #334155;
          font-size: 14px;
        }

        .lior-acc-presets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lior-acc-preset-btn {
          padding: 14px 12px;
          background: #e6f2ff;
          border: 1px solid #b3d9ff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #1f2937;
        }

        .lior-acc-preset-btn:hover {
          background: #cce6ff;
          border-color: #0066cc;
        }

        .preset-icon {
          font-size: 24px;
        }

        .preset-name {
          font-size: 13px;
        }

        .lior-acc-control-group {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f5f7fa;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .lior-acc-control-btn {
          width: 44px;
          height: 44px;
          border: 2px solid #0066cc;
          background: white;
          color: #0066cc;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .lior-acc-control-btn:hover {
          background: #0066cc;
          color: white;
        }

        .lior-acc-display-wrapper {
          flex: 1;
          text-align: center;
          background: white;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .lior-acc-display {
          font-weight: 700;
          color: #0066cc;
          font-size: 18px;
        }

        .lior-acc-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lior-acc-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          background: #f5f7fa;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .lior-acc-option:hover {
          background: #e6f2ff;
          border-color: #b3d9ff;
        }

        .lior-acc-option input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 24px;
          height: 24px;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          position: relative;
          flex-shrink: 0;
          transition: all 0.2s;
          margin-top: 2px;
        }

        .lior-acc-option input:checked + .checkmark {
          background: #0066cc;
          border-color: #0066cc;
        }

        .lior-acc-option input:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .option-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .option-text strong {
          color: #1e293b;
          font-size: 14px;
        }

        .option-text small {
          color: #64748b;
          font-size: 12px;
        }

        .lior-acc-tts-controls {
          display: flex;
          gap: 12px;
        }

        .lior-acc-tts-btn {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .lior-acc-tts-btn.primary {
          background: #0066cc;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 102, 204, 0.2);
        }

        .lior-acc-tts-btn.primary:hover {
          background: #0052a3;
          box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3);
        }

        .lior-acc-tts-btn.secondary {
          background: #f1f5f9;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .lior-acc-tts-btn.secondary:hover {
          background: #e2e8f0;
        }

        .lior-acc-reset {
          width: 100%;
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 2px 4px rgba(220, 53, 69, 0.2);
        }

        .lior-acc-reset:hover {
          background: #c82333;
          box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
        }

        /* סגנונות נגישות */
        body.lior-acc-high-contrast {
          filter: contrast(1.5) brightness(1.1);
        }

        body.lior-acc-high-contrast * {
          border-color: #000 !important;
        }

        body.lior-acc-readable-font {
          font-family: Arial, Helvetica, sans-serif !important;
        }

        body.lior-acc-underline-links a {
          text-decoration: underline !important;
          text-decoration-thickness: 2px !important;
        }

        body.lior-acc-large-cursor * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="none" stroke="black" stroke-width="2"/><circle cx="16" cy="16" r="2" fill="black"/></svg>'), auto !important;
        }

        body.lior-acc-disable-animations *,
        body.lior-acc-disable-animations *::before,
        body.lior-acc-disable-animations *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        @media (max-width: 768px) {
          #lior-acc-root {
            bottom: 16px;
            left: 16px;
          }

          .lior-acc-panel {
            width: calc(100vw - 32px);
            max-width: 380px;
            bottom: 80px;
          }

          .lior-acc-presets {
            grid-template-columns: 1fr;
          }
        }

        /* Scrollbar styling */
        .lior-acc-panel-content::-webkit-scrollbar {
          width: 8px;
        }

        .lior-acc-panel-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .lior-acc-panel-content::-webkit-scrollbar-thumb {
          background: #0066cc;
          border-radius: 4px;
        }

        .lior-acc-panel-content::-webkit-scrollbar-thumb:hover {
          background: #0052a3;
        }
      `;
      document.head.appendChild(style);
    }

    attachEvents() {
      this.elements.button.addEventListener('click', () => this.toggle());
      this.elements.closeBtn.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      document.addEventListener('click', (e) => {
        if (this.isOpen && 
            !this.elements.panel.contains(e.target) && 
            !this.elements.button.contains(e.target)) {
          this.close();
        }
      });

      this.elements.decreaseFont.addEventListener('click', () => this.adjustFontSize(-10));
      this.elements.increaseFont.addEventListener('click', () => this.adjustFontSize(10));

      this.elements.highContrast.addEventListener('change', (e) => 
        this.toggleSetting('highContrast', e.target.checked));
      this.elements.readableFont.addEventListener('change', (e) => 
        this.toggleSetting('readableFont', e.target.checked));
      this.elements.underlineLinks.addEventListener('change', (e) => 
        this.toggleSetting('underlineLinks', e.target.checked));
      this.elements.largeCursor.addEventListener('change', (e) => 
        this.toggleSetting('largeCursor', e.target.checked));
      this.elements.disableAnimations.addEventListener('change', (e) => 
        this.toggleSetting('disableAnimations', e.target.checked));

      this.elements.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.dataset.preset;
          this.applyPreset(preset);
        });
      });

      this.elements.readPage.addEventListener('click', () => this.readPage());
      this.elements.stopReading.addEventListener('click', () => this.stopReading());
      this.elements.resetSettings.addEventListener('click', () => this.reset());
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.elements.panel.classList.add('active');
      this.elements.panel.setAttribute('aria-hidden', 'false');
      this.elements.button.setAttribute('aria-expanded', 'true');
      this.elements.closeBtn.focus();
    }

    close() {
      this.isOpen = false;
      this.elements.panel.classList.remove('active');
      this.elements.panel.setAttribute('aria-hidden', 'true');
      this.elements.button.setAttribute('aria-expanded', 'false');
      this.elements.button.focus();
    }

    adjustFontSize(delta) {
      const currentSize = this.settings.fontSize || 100;
      const newSize = Math.max(75, Math.min(200, currentSize + delta));
      this.settings.fontSize = newSize;
      this.applyFontSize(newSize);
      this.saveSettings();
    }

    applyFontSize(size) {
      document.documentElement.style.fontSize = size + '%';
      this.elements.fontSizeDisplay.textContent = size + '%';
    }

    toggleSetting(key, value) {
      this.settings[key] = value;
      const className = `lior-acc-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      if (value) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
      this.saveSettings();
    }

    applyPreset(presetName) {
      const preset = PRESETS[presetName];
      if (!preset) return;

      Object.assign(this.settings, preset.settings);
      this.applySettings(this.settings);
      this.updateUI();
      this.saveSettings();
      this.showNotification(`✅ הוחל מצב: ${preset.name}`);
    }

    applySettings(settings) {
      if (settings.fontSize) {
        this.applyFontSize(settings.fontSize);
      }

      if (settings.highContrast) {
        document.body.classList.add('lior-acc-high-contrast');
      }
      if (settings.readableFont) {
        document.body.classList.add('lior-acc-readable-font');
      }
      if (settings.underlineLinks) {
        document.body.classList.add('lior-acc-underline-links');
      }
      if (settings.largeCursor) {
        document.body.classList.add('lior-acc-large-cursor');
      }
      if (settings.disableAnimations) {
        document.body.classList.add('lior-acc-disable-animations');
      }
    }

    updateUI() {
      this.elements.highContrast.checked = this.settings.highContrast || false;
      this.elements.readableFont.checked = this.settings.readableFont || false;
      this.elements.underlineLinks.checked = this.settings.underlineLinks || false;
      this.elements.largeCursor.checked = this.settings.largeCursor || false;
      this.elements.disableAnimations.checked = this.settings.disableAnimations || false;
    }

    readPage() {
      if ('speechSynthesis' in window) {
        const text = document.body.innerText || document.body.textContent;
        this.stopReading();

        this.ttsUtterance = new SpeechSynthesisUtterance(text);
        this.ttsUtterance.lang = 'he-IL';
        this.ttsUtterance.rate = 1;
        this.ttsUtterance.pitch = 1;
        this.ttsUtterance.volume = 1;

        this.ttsUtterance.onend = () => {
          this.elements.readPage.style.display = 'flex';
          this.elements.stopReading.style.display = 'none';
        };

        speechSynthesis.speak(this.ttsUtterance);
        this.elements.readPage.style.display = 'none';
        this.elements.stopReading.style.display = 'flex';
      } else {
        alert('הדפדפן שלך לא תומך בקריאה בקול');
      }
    }

    stopReading() {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        this.elements.readPage.style.display = 'flex';
        this.elements.stopReading.style.display = 'none';
      }
    }

    reset() {
      this.settings = {
        fontSize: 100,
        highContrast: false,
        readableFont: false,
        underlineLinks: false,
        largeCursor: false,
        disableAnimations: false
      };

      document.body.className = document.body.className
        .split(' ')
        .filter(c => !c.startsWith('lior-acc-'))
        .join(' ');

      document.documentElement.style.fontSize = '';
      this.updateUI();
      this.applyFontSize(100);
      this.saveSettings();
      this.showNotification('🔄 הגדרות אופסו');
    }

    loadSettings() {
      try {
        const saved = localStorage.getItem('lior-acc-settings');
        return saved ? JSON.parse(saved) : {
          fontSize: 100,
          highContrast: false,
          readableFont: false,
          underlineLinks: false,
          largeCursor: false,
          disableAnimations: false
        };
      } catch (e) {
        return {
          fontSize: 100,
          highContrast: false,
          readableFont: false,
          underlineLinks: false,
          largeCursor: false,
          disableAnimations: false
        };
      }
    }

    saveSettings() {
      try {
        localStorage.setItem('lior-acc-settings', JSON.stringify(this.settings));
      } catch (e) {
        console.warn('לא ניתן לשמור הגדרות:', e);
      }
    }

    showNotification(message) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 24px;
        background: #0066cc;
        color: white;
        padding: 14px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
        z-index: 10001;
        animation: slideInLeft 0.3s ease;
        font-weight: 500;
        font-size: 14px;
      `;

      if (!document.getElementById('lior-acc-notif-animations')) {
        const style = document.createElement('style');
        style.id = 'lior-acc-notif-animations';
        style.textContent = `
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutLeft {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(-100%); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOutLeft 0.3s ease';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 2500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.liorAccessibilityWidget = new AccessibilityWidget();
    });
  } else {
    window.liorAccessibilityWidget = new AccessibilityWidget();
  }

})();

