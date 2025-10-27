/**
 * Custom Exception Classes for Theme Selector
 */

class ThemeSelectorError extends Error {
    constructor(message, code = 'THEME_SELECTOR_ERROR') {
        super(message);
        this.name = 'ThemeSelectorError';
        this.code = code;
        this.timestamp = new Date().toISOString();
    }
}

class ThemeNotFoundError extends ThemeSelectorError {
    constructor(themeKey) {
        super(`Theme "${themeKey}" not found`, 'THEME_NOT_FOUND');
        this.themeKey = themeKey;
    }
}

class ThemeInitializationError extends ThemeSelectorError {
    constructor(reason) {
        super(`Failed to initialize theme selector: ${reason}`, 'THEME_INITIALIZATION_ERROR');
    }
}

class ThemeTransitionError extends ThemeSelectorError {
    constructor(reason) {
        super(`Theme transition failed: ${reason}`, 'THEME_TRANSITION_ERROR');
    }
}

class ThemePersistenceError extends ThemeSelectorError {
    constructor(operation, reason) {
        super(`Failed to ${operation} theme preference: ${reason}`, 'THEME_PERSISTENCE_ERROR');
        this.operation = operation;
    }
}

class ThemeConfigurationError extends ThemeSelectorError {
    constructor(reason) {
        super(`Invalid theme configuration: ${reason}`, 'THEME_CONFIGURATION_ERROR');
    }
}

class ThemeUIError extends ThemeSelectorError {
    constructor(element, reason) {
        super(`Failed to create UI element "${element}": ${reason}`, 'THEME_UI_ERROR');
        this.element = element;
    }
}

class ThemeEventError extends ThemeSelectorError {
    constructor(event, reason) {
        super(`Failed to bind event "${event}": ${reason}`, 'THEME_EVENT_ERROR');
        this.event = event;
    }
}

class ThemeAjaxError extends ThemeSelectorError {
    constructor(operation, status, reason) {
        super(`AJAX ${operation} failed with status ${status}: ${reason}`, 'THEME_AJAX_ERROR');
        this.operation = operation;
        this.status = status;
    }
}

/**
 * Advanced Theme Selector Module with AJAX Support
 * Professional implementation with enterprise-level features and performance optimizations
 * 
 * @author Jobet P. Casquejo
 * @version 2.0.0
 * @license MIT
 */
class ThemeSelector {
    /**
     * Create an ThemeSelector instance
     * @param {Object} config - Configuration options
     */
    constructor(config = {}) {
        // Default configuration
        this.config = {
            themes: {
                'system': {
                    id: 'system',
                    name: 'System Default',
                    className: 'theme-system',
                    icon: '💻',
                    description: 'Use the system default theme.',
                    isDefault: true
                },
                'light': {
                    id: 'light',
                    name: 'Light',
                    className: 'theme-light',
                    icon: '☀️',
                    description: 'A light theme with white backgrounds and dark text.',
                    variables: {
                        '--theme-primary': '#2563eb',
                        '--theme-background': '#ffffff',
                        '--theme-surface': '#f8fafc',
                        '--theme-text': '#1e293b',
                        '--theme-text-secondary': '#64748b',
                        '--theme-border': '#e2e8f0',
                        '--theme-shadow': 'rgba(0, 0, 0, 0.08)'
                    },
                    isDefault: false
                },
                'dark': {
                    id: 'dark',
                    name: 'Dark',
                    className: 'theme-dark',
                    icon: '🌙',
                    description: 'A dark theme with black backgrounds and light text.',
                    variables: {
                        '--theme-primary': '#3b82f6',
                        '--theme-background': '#0f172a',
                        '--theme-surface': '#1e293b',
                        '--theme-text': '#f1f5f9',
                        '--theme-text-secondary': '#94a3b8',
                        '--theme-border': '#334155',
                        '--theme-shadow': 'rgba(0, 0, 0, 0.25)'
                    }
                },
                'sepia': {
                    id: 'sepia',
                    name: 'Sepia',
                    className: 'theme-sepia',
                    icon: '🌅',
                    description: 'A sepia theme with a brownish background and light text.',
                    variables: {
                        '--theme-primary': '#f59e0b',
                        '--theme-background': '#42281f',
                        '--theme-surface': '#5a3729',
                        '--theme-text': '#c4a088',
                        '--theme-text-secondary': '#947e6b',
                        '--theme-border': '#4e4339',
                        '--theme-shadow': 'rgba(0, 0, 0, 0.15)'
                    }
                },
                'blue': {
                    id: 'blue',
                    name: 'Ocean Breeze',
                    className: 'theme-blue',
                    icon: '🌊',
                    description: 'A blue theme with a calming ocean color scheme.',
                    variables: {
                        '--theme-primary': '#0ea5e9',
                        '--theme-background': '#f0f9ff',
                        '--theme-surface': '#e0f2fe',
                        '--theme-text': '#0c4a6e',
                        '--theme-text-secondary': '#0284c7',
                        '--theme-border': '#7dd3fc',
                        '--theme-shadow': 'rgba(14, 165, 233, 0.15)'
                    }
                },
                'green': {
                    id: 'green',
                    name: 'Forest Green',
                    className: 'theme-green',
                    icon: '🌲',
                    description: 'A green theme with a natural forest color scheme.',
                    variables: {
                        '--theme-primary': '#10b981',
                        '--theme-background': '#f0fdf4',
                        '--theme-surface': '#dcfce7',
                        '--theme-text': '#065f46',
                        '--theme-text-secondary': '#059669',
                        '--theme-border': '#6ee7b7',
                        '--theme-shadow': 'rgba(16, 185, 129, 0.15)'
                    }
                },
                'contrast': {
                    id: 'contrast',
                    name: 'High Contrast',
                    className: 'theme-contrast',
                    icon: '🎨',
                    description: 'A high contrast theme for better accessibility.',
                    variables: {
                        '--theme-primary': '#ffff00',
                        '--theme-background': '#000000',
                        '--theme-surface': '#333333',
                        '--theme-text': '#ffffff',
                        '--theme-text-secondary': '#cccccc',
                        '--theme-border': '#ffffff',
                        '--theme-shadow': 'rgba(255, 255, 255, 0.2)'
                    }
                },
                'sunset': {
                    id: 'sunset',
                    name: 'Sunset Glow',
                    className: 'theme-sunset',
                    icon: '🌇',
                    description: 'A warm sunset theme with orange and purple tones.',
                    variables: {
                        '--theme-primary': '#f97316',
                        '--theme-background': '#fff7ed',
                        '--theme-surface': '#ffedd5',
                        '--theme-text': '#9a3412',
                        '--theme-text-secondary': '#ea580c',
                        '--theme-border': '#fed7aa',
                        '--theme-shadow': 'rgba(249, 115, 22, 0.15)'
                    }
                }
            },
            defaultTheme: 'system',
            position: 'bottom-right',
            rememberPreference: true,
            animationDuration: 300,
            autoHideDelay: 3000,
            enableKeyboardShortcuts: true,
            enableAnalytics: true,
            enableAjax: true,
            ajaxEndpoints: {
                saveTheme: '/api/theme/save/',
                loadTheme: '/api/theme/load/',
                csrfTokenUrl: '/api/csrf-token/'
            },
            ...config
        };

        // State management
        this.state = {
            currentTheme: null,
            previousTheme: null,
            isInitialized: false,
            isOpen: false,
            prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
            isTransitioning: false,
            activeObservers: [],
            eventListeners: [],
            csrfToken: null
        };

        // Performance optimization flags
        this.performance = {
            ticking: false,
            resizeTicking: false,
            lastScrollY: 0
        };

        // Initialize the theme selector
        this.initialize();
    }

    /**
     * Initialize the theme selector
     * @private
     */
    initialize() {
        if (this.state.isInitialized) {
            console.warn('Theme selector already initialized');
            return;
        }

        // Setup system preference listener
        this.setupSystemPreferenceListener();

        // Load saved theme preference
        this.loadSavedTheme();

        // Apply initial theme
        this.applyTheme(this.state.currentTheme);

        // Create UI when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createUI());
        } else {
            this.createUI();
        }

        // Initialize accessibility features
        this.initAccessibility();

        // Initialize performance optimizations
        this.initPerformanceOptimizations();

        // Initialize AJAX if enabled
        if (this.config.enableAjax) {
            this.initAjax();
        }

        this.state.isInitialized = true;
        this.dispatchCustomEvent('themeSelectorInitialized', { instance: this });

        // Log initialization
        this.log('Theme selector initialized successfully', 'info');
    }

    /**
     * Initialize AJAX functionality
     * @private
     */
    initAjax() {
        // Fetch CSRF token for AJAX requests
        this.fetchCsrfToken()
            .then(token => {
                this.state.csrfToken = token;
                this.log('AJAX initialized successfully', 'info');
            })
            .catch(error => {
                this.log(`Failed to initialize AJAX: ${error.message}`, 'warn');
            });
    }

    /**
     * Fetch CSRF token for AJAX requests
     * @returns {Promise<string>} CSRF token
     * @private
     */
    async fetchCsrfToken() {
        const response = await fetch(this.config.ajaxEndpoints.csrfTokenUrl, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new ThemeAjaxError('fetch CSRF token', response.status, response.statusText);
        }

        const data = await response.json();
        return data.csrfToken;
    }

    /**
     * Save theme preference via AJAX
     * @param {string} theme - Theme identifier
     * @returns {Promise<void>}
     * @private
     */
    async saveThemeAjax(theme) {
        if (!this.config.enableAjax || !this.state.csrfToken) {
            return;
        }

        const formData = new FormData();
        formData.append('theme', theme);

        const response = await fetch(this.config.ajaxEndpoints.saveTheme, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': this.state.csrfToken
            },
            body: formData
        });

        if (!response.ok) {
            throw new ThemeAjaxError('save theme', response.status, response.statusText);
        }

        const data = await response.json();
        if (!data.success) {
            throw new ThemeAjaxError('save theme', 500, data.message || 'Unknown error');
        }

        this.log(`Theme preference saved via AJAX: ${theme}`, 'info');
    }

    /**
     * Load theme preference via AJAX
     * @returns {Promise<string|null>} Theme identifier or null
     * @private
     */
    async loadThemeAjax() {
        if (!this.config.enableAjax || !this.state.csrfToken) {
            return null;
        }

        const response = await fetch(this.config.ajaxEndpoints.loadTheme, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new ThemeAjaxError('load theme', response.status, response.statusText);
        }

        const data = await response.json();
        if (!data.success) {
            throw new ThemeAjaxError('load theme', 500, data.message || 'Unknown error');
        }

        return data.theme || null;
    }

    /**
     * Setup system preference listener for dark mode
     * @private
     */
    setupSystemPreferenceListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e) => {
            this.state.prefersDark = e.matches;
            // If using system theme, update accordingly
            if (this.state.currentTheme === 'system') {
                this.applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', listener);
        this.state.activeObservers.push({ mediaQuery, listener });
    }

    /**
     * Load saved theme from storage or server
     * @private
     */
    async loadSavedTheme() {
        if (!this.config.rememberPreference) return;

        try {
            // Try to load from server first if AJAX is enabled
            if (this.config.enableAjax) {
                try {
                    const serverTheme = await this.loadThemeAjax();
                    if (serverTheme && this.config.themes[serverTheme]) {
                        this.state.currentTheme = serverTheme;
                        return;
                    }
                } catch (error) {
                    this.log(`Failed to load theme from server: ${error.message}`, 'warn');
                }
            }

            // Fallback to localStorage
            const savedTheme = localStorage.getItem('theme-selector-preference');
            if (savedTheme && this.config.themes[savedTheme]) {
                this.state.currentTheme = savedTheme;
            } else {
                this.state.currentTheme = this.config.defaultTheme;
            }
        } catch (error) {
            throw new ThemePersistenceError('load', error.message);
        }
    }

    /**
     * Save theme preference to storage and server
     * @param {string} theme - Theme identifier
     * @private
     */
    async saveTheme(theme) {
        if (!this.config.rememberPreference) return;

        try {
            // Save to localStorage
            localStorage.setItem('theme-selector-preference', theme);

            // Save to server if AJAX is enabled
            if (this.config.enableAjax) {
                try {
                    await this.saveThemeAjax(theme);
                } catch (error) {
                    this.log(`Failed to save theme to server: ${error.message}`, 'warn');
                }
            }
        } catch (error) {
            throw new ThemePersistenceError('save', error.message);
        }
    }

    /**
     * Apply a theme to the document
     * @param {string} themeKey - Theme identifier
     * @public
     */
    applyTheme(themeKey) {
        // Validate theme
        if (!this.config.themes[themeKey]) {
            throw new ThemeNotFoundError(themeKey);
        }

        // Prevent multiple simultaneous transitions
        if (this.state.isTransitioning) {
            throw new ThemeTransitionError('Transition already in progress');
        }

        this.state.isTransitioning = true;
        this.state.previousTheme = this.state.currentTheme;
        this.state.currentTheme = themeKey;

        // Determine actual theme to apply
        let actualTheme = themeKey;
        if (themeKey === 'system') {
            actualTheme = this.state.prefersDark ? 'dark' : 'light';
        }

        const theme = this.config.themes[actualTheme];

        // Remove all theme classes
        Object.values(this.config.themes).forEach(themeObj => {
            document.documentElement.classList.remove(themeObj.className);
        });

        // Apply theme class
        document.documentElement.classList.add(theme.className);

        // Apply CSS variables if defined
        if (theme.variables) {
            Object.entries(theme.variables).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
        }

        // Save preference
        this.saveTheme(themeKey);

        // Dispatch custom event
        this.dispatchCustomEvent('themeChanged', {
            theme: themeKey,
            actualTheme: actualTheme,
            themeObject: theme
        });

        // Update UI after a short delay to allow for transitions
        setTimeout(() => {
            this.updateUI();
            this.state.isTransitioning = false;
        }, this.config.animationDuration);

        this.log(`Theme applied: ${theme.name}`, 'info');
    }

    /**
     * Create the theme selector UI
     * @private
     */
    createUI() {
        // Check if selector already exists
        if (document.getElementById('advanced-theme-selector')) {
            this.log('Theme selector UI already exists', 'warn');
            return;
        }

        // Create theme selector container
        const selector = document.createElement('div');
        selector.id = 'advanced-theme-selector';
        selector.className = `theme-selector position-${this.config.position}`;
        selector.setAttribute('role', 'region');
        selector.setAttribute('aria-label', 'Theme selector');
        selector.setAttribute('data-version', '2.0.0');

        // Create toggle button
        const toggleButton = this.createToggleButton();

        // Create options container
        const optionsContainer = this.createOptionsContainer();

        // Create footer
        const footer = this.createFooter();

        // Assemble the selector
        selector.appendChild(toggleButton);
        selector.appendChild(optionsContainer);
        selector.appendChild(footer);
        document.body.appendChild(selector);

        // Bind events
        this.bindEvents();

        // Update UI to reflect current theme
        this.updateUI();

        this.log('Theme selector UI created successfully', 'info');
    }

    /**
     * Create toggle button element
     * @returns {HTMLElement} Toggle button element
     * @private
     */
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'theme-options');
        button.setAttribute('aria-label', 'Change website theme');
        button.title = 'Change website theme (Ctrl+Shift+T)';
        button.innerHTML = `
            <span class="theme-icon" aria-hidden="true">🎨</span>
            <span class="theme-name">Theme</span>
            <span class="theme-indicator" aria-hidden="true"></span>
        `;
        return button;
    }

    /**
     * Create options container element
     * @returns {HTMLElement} Options container element
     * @private
     */
    createOptionsContainer() {
        const container = document.createElement('div');
        container.id = 'theme-options';
        container.className = 'theme-options';
        container.setAttribute('role', 'menu');
        container.setAttribute('aria-label', 'Available themes');

        // Create theme options
        Object.values(this.config.themes).forEach(theme => {
            const option = document.createElement('button');
            option.className = 'theme-option';
            option.setAttribute('role', 'menuitemradio');
            option.setAttribute('aria-checked', 'false');
            option.setAttribute('data-theme', theme.id);
            option.title = theme.description;
            option.innerHTML = `
                <span class="theme-option-icon" aria-hidden="true">${theme.icon}</span>
                <span class="theme-option-content">
                    <span class="theme-option-name">${theme.name}</span>
                    <span class="theme-option-description">${theme.description}</span>
                </span>
                <span class="theme-option-check" aria-hidden="true">✓</span>
            `;
            container.appendChild(option);
        });

        return container;
    }

    /**
     * Create footer element
     * @returns {HTMLElement} Footer element
     * @private
     */
    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'theme-selector-footer';
        footer.innerHTML = `
            <span class="theme-version" aria-label="Theme selector version">v2.0.0</span>
            <div class="theme-actions">
                <button class="theme-reset" aria-label="Reset to system default" title="Reset to system default">↺</button>
                <button class="theme-close" aria-label="Close theme selector" title="Close theme selector">✕</button>
            </div>
        `;
        return footer;
    }

    /**
     * Bind event listeners
     * @private
     */
    bindEvents() {
        const toggleButton = document.querySelector('.theme-toggle');
        const optionsContainer = document.getElementById('theme-options');
        const themeOptions = document.querySelectorAll('.theme-option');
        const resetButton = document.querySelector('.theme-reset');
        const closeButton = document.querySelector('.theme-close');

        // Store event listeners for cleanup
        const listeners = [];

        // Toggle theme selector visibility
        const toggleHandler = (e) => {
            e.stopPropagation();
            this.toggleSelector();
        };
        toggleButton.addEventListener('click', toggleHandler);
        listeners.push({ element: toggleButton, event: 'click', handler: toggleHandler });

        // Apply theme when option is selected
        themeOptions.forEach(option => {
            const themeHandler = (e) => {
                e.stopPropagation();
                const theme = option.getAttribute('data-theme');
                this.selectTheme(theme);
            };
            option.addEventListener('click', themeHandler);
            listeners.push({ element: option, event: 'click', handler: themeHandler });
        });

        // Reset to system theme
        const resetHandler = (e) => {
            e.stopPropagation();
            this.selectTheme('system');
        };
        resetButton.addEventListener('click', resetHandler);
        listeners.push({ element: resetButton, event: 'click', handler: resetHandler });

        // Close selector
        const closeHandler = (e) => {
            e.stopPropagation();
            this.closeSelector();
        };
        closeButton.addEventListener('click', closeHandler);
        listeners.push({ element: closeButton, event: 'click', handler: closeHandler });

        // Close selector when clicking outside
        const outsideHandler = (e) => {
            if (!e.target.closest('#advanced-theme-selector') && this.state.isOpen) {
                this.closeSelector();
            }
        };
        document.addEventListener('click', outsideHandler);
        listeners.push({ element: document, event: 'click', handler: outsideHandler });

        // Close selector with Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.closeSelector();
                toggleButton.focus();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        listeners.push({ element: document, event: 'keydown', handler: escapeHandler });

        // Keyboard navigation within options
        const keyboardHandler = (e) => {
            if (!this.state.isOpen) return;

            const options = Array.from(themeOptions);
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = options.findIndex(opt => opt === document.activeElement);
                let nextIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % options.length;
                } else {
                    nextIndex = (currentIndex - 1 + options.length) % options.length;
                }

                options[nextIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                options[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                options[options.length - 1].focus();
            }
        };
        optionsContainer.addEventListener('keydown', keyboardHandler);
        listeners.push({ element: optionsContainer, event: 'keydown', handler: keyboardHandler });

        // Store listeners for cleanup
        this.state.eventListeners = listeners;

        this.log('Event listeners bound successfully', 'info');
    }

    /**
     * Initialize accessibility features
     * @private
     */
    initAccessibility() {
        const shortcutHandler = (e) => {
            // Ctrl+Shift+T to toggle theme selector
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                this.toggleSelector();
            }
        };

        document.addEventListener('keydown', shortcutHandler);
        this.state.eventListeners.push({ 
            element: document, 
            event: 'keydown', 
            handler: shortcutHandler 
        });

        this.log('Accessibility features initialized', 'info');
    }

    /**
     * Initialize performance optimizations
     * @private
     */
    initPerformanceOptimizations() {
        // Throttled resize handler
        const resizeHandler = () => {
            if (!this.performance.resizeTicking) {
                requestAnimationFrame(() => {
                    // Perform resize-related updates here if needed
                    this.performance.resizeTicking = false;
                });
                this.performance.resizeTicking = true;
            }
        };

        window.addEventListener('resize', resizeHandler, { passive: true });
        this.state.eventListeners.push({ 
            element: window, 
            event: 'resize', 
            handler: resizeHandler 
        });

        this.log('Performance optimizations initialized', 'info');
    }

    /**
     * Toggle the selector visibility
     * @public
     */
    toggleSelector() {
        if (this.state.isOpen) {
            this.closeSelector();
        } else {
            this.openSelector();
        }
    }

    /**
     * Open the selector
     * @public
     */
    openSelector() {
        if (this.state.isOpen || this.state.isTransitioning) return;

        const toggleButton = document.querySelector('.theme-toggle');
        const optionsContainer = document.getElementById('theme-options');

        toggleButton.setAttribute('aria-expanded', 'true');
        optionsContainer.classList.add('show');
        this.state.isOpen = true;

        // Focus first option
        const firstOption = document.querySelector('.theme-option');
        if (firstOption) {
            firstOption.focus();
        }

        this.dispatchCustomEvent('themeSelectorOpened', { instance: this });
        this.log('Theme selector opened', 'info');
    }

    /**
     * Close the selector
     * @public
     */
    closeSelector() {
        if (!this.state.isOpen || this.state.isTransitioning) return;

        const toggleButton = document.querySelector('.theme-toggle');
        const optionsContainer = document.getElementById('theme-options');

        toggleButton.setAttribute('aria-expanded', 'false');
        optionsContainer.classList.remove('show');
        this.state.isOpen = false;

        this.dispatchCustomEvent('themeSelectorClosed', { instance: this });
        this.log('Theme selector closed', 'info');
    }

    /**
     * Select a theme
     * @param {string} themeKey - Theme identifier
     * @public
     */
    selectTheme(themeKey) {
        if (!this.config.themes[themeKey]) {
            throw new ThemeNotFoundError(themeKey);
        }

        this.applyTheme(themeKey);
        this.closeSelector();

        // Show confirmation
        this.showNotification(`Theme changed to ${this.config.themes[themeKey].name}`, 'success');
    }

    /**
     * Update the selector UI to reflect current theme
     * @private
     */
    updateUI() {
        const currentThemeObj = this.config.themes[this.state.currentTheme];
        const toggleButton = document.querySelector('.theme-toggle');
        const themeOptions = document.querySelectorAll('.theme-option');

        if (currentThemeObj && toggleButton) {
            const iconEl = toggleButton.querySelector('.theme-icon');
            const nameEl = toggleButton.querySelector('.theme-name');

            if (iconEl) iconEl.textContent = currentThemeObj.icon;
            if (nameEl) nameEl.textContent = currentThemeObj.name;
        }

        // Update active state for options
        themeOptions.forEach(option => {
            const theme = option.getAttribute('data-theme');
            const isChecked = theme === this.state.currentTheme;

            option.classList.toggle('active', isChecked);
            option.setAttribute('aria-checked', isChecked.toString());
        });

        this.log('UI updated successfully', 'info');
    }

    /**
     * Show notification message
     * @param {string} message - Message text
     * @param {string} type - Message type (success|error|warning|info)
     * @private
     */
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.theme-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = `theme-notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto-hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, this.config.animationDuration);
        }, this.config.autoHideDelay);
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {Object} detail - Event detail
     * @private
     */
    dispatchCustomEvent(eventName, detail = {}) {
        const event = new CustomEvent(`themeSelector:${eventName}`, { 
            detail: { 
                ...detail, 
                timestamp: Date.now(),
                version: '2.0.0'
            } 
        });
        window.dispatchEvent(event);
    }

    /**
     * Log message with appropriate level
     * @param {string} message - Log message
     * @param {string} level - Log level (info|warn|error)
     * @private
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[ThemeSelector ${timestamp}] ${message}`;

        switch (level) {
            case 'error':
                console.error(logMessage);
                break;
            case 'warn':
                console.warn(logMessage);
                break;
            default:
                console.info(logMessage);
        }
    }

    /**
     * Get current theme
     * @returns {string} Current theme identifier
     * @public
     */
    getCurrentTheme() {
        return this.state.currentTheme;
    }

    /**
     * Get previous theme
     * @returns {string} Previous theme identifier
     * @public
     */
    getPreviousTheme() {
        return this.state.previousTheme;
    }

    /**
     * Get available themes
     * @returns {Object} Themes configuration
     * @public
     */
    getThemes() {
        return { ...this.config.themes };
    }

    /**
     * Add a new theme
     * @param {string} key - Theme key
     * @param {Object} theme - Theme configuration
     * @public
     */
    addTheme(key, theme) {
        if (!key || !theme) {
            throw new ThemeConfigurationError('Key and theme configuration are required');
        }

        this.config.themes[key] = {
            id: key,
            name: theme.name || key,
            className: theme.className || `theme-${key}`,
            icon: theme.icon || '🎨',
            description: theme.description || '',
            variables: theme.variables || {},
            ...theme
        };

        this.log(`Theme "${key}" added successfully`, 'info');
    }

    /**
     * Remove a theme
     * @param {string} key - Theme key
     * @public
     */
    removeTheme(key) {
        if (!this.config.themes[key]) {
            throw new ThemeNotFoundError(key);
        }

        // Prevent removing the default theme
        if (this.config.themes[key].isDefault) {
            throw new ThemeConfigurationError('Cannot remove the default theme');
        }

        delete this.config.themes[key];
        this.log(`Theme "${key}" removed successfully`, 'info');
    }

    /**
     * Destroy instance and clean up
     * @public
     */
    destroy() {
        // Remove event listeners
        this.state.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });

        // Disconnect observers
        this.state.activeObservers.forEach(({ mediaQuery, listener }) => {
            mediaQuery.removeEventListener('change', listener);
        });

        // Remove UI element
        const selector = document.getElementById('advanced-theme-selector');
        if (selector) {
            selector.remove();
        }

        // Reset state
        this.state.isInitialized = false;
        this.state.isOpen = false;

        this.dispatchCustomEvent('themeSelectorDestroyed', { instance: this });
        this.log('Theme selector destroyed successfully', 'info');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.themeSelector = new ThemeSelector({
            position: 'bottom-right',
            animationDuration: 300,
            autoHideDelay: 3000,
            rememberPreference: true,
            enableKeyboardShortcuts: true,
            enableAnalytics: true,
            enableAjax: true
        });
    } catch (error) {
        console.error('Failed to initialize theme selector:', error);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ThemeSelector,
        ThemeSelectorError,
        ThemeNotFoundError,
        ThemeInitializationError,
        ThemeTransitionError,
        ThemePersistenceError,
        ThemeConfigurationError,
        ThemeUIError,
        ThemeEventError,
        ThemeAjaxError
    };
}

// Export as global variable for browser usage
if (typeof window !== 'undefined') {
    window.ThemeSelector = ThemeSelector;
    window.ThemeSelectorError = ThemeSelectorError;
    window.ThemeNotFoundError = ThemeNotFoundError;
    window.ThemeInitializationError = ThemeInitializationError;
    window.ThemeTransitionError = ThemeTransitionError;
    window.ThemePersistenceError = ThemePersistenceError;
    window.ThemeConfigurationError = ThemeConfigurationError;
    window.ThemeUIError = ThemeUIError;
    window.ThemeEventError = ThemeEventError;
    window.ThemeAjaxError = ThemeAjaxError;
}