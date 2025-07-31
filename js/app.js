// Main App for Ellerslie School AI
class EllerslieSchoolAI {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Ellerslie School AI...');

            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('Failed to initialize Ellerslie School AI:', error);
            this.showError('Failed to initialize application');
        }
    }

    async initializeApp() {
        try {
            // Wait for authentication to be ready
            await this.waitForAuth();

            // Initialize UI
            window.UIManager.initialize();

            // Initialize chat manager if authenticated
            if (window.AuthManager.isAuthenticated()) {
                await window.ChatManager.loadConversations();
            }

            // Set up service worker for PWA
            this.registerServiceWorker();

            // Add notification styles
            this.addNotificationStyles();

            // Mark as initialized
            this.initialized = true;

            console.log('✅ Ellerslie School AI initialized successfully!');
            
            // Show welcome message only if authenticated
            if (window.AuthManager.isAuthenticated()) {
                this.showWelcomeMessage();
            }

        } catch (error) {
            console.error('Error during app initialization:', error);
            this.showError('Failed to initialize application');
        }
    }

    // Wait for authentication to be ready
    async waitForAuth() {
        return new Promise((resolve) => {
            // Check if AuthManager is already initialized
            if (window.AuthManager) {
                resolve();
                return;
            }

            // Wait for AuthManager to be ready
            const checkAuth = () => {
                if (window.AuthManager) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }

    // Handle user sign in
    handleUserSignIn(user) {
        // This is now handled by AuthManager
        console.log('User signed in:', user.email);
    }

    // Handle user sign out
    handleUserSignOut() {
        // This is now handled by AuthManager
        console.log('User signed out');
    }

    // Register service worker for PWA
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // Add notification styles
    addNotificationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-card);
                border: 1px solid var(--border-light);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform var(--transition-normal);
                max-width: 300px;
            }

            .notification.show {
                transform: translateX(0);
            }

            .notification-success {
                border-left: 4px solid var(--success-color);
            }

            .notification-error {
                border-left: 4px solid var(--error-color);
            }

            .notification i {
                font-size: 1rem;
            }

            .notification-success i {
                color: var(--success-color);
            }

            .notification-error i {
                color: var(--error-color);
            }

            .error-text {
                color: var(--error-color) !important;
            }

            .error-text i {
                margin-right: var(--spacing-xs);
            }
        `;
        document.head.appendChild(style);
    }

    // Show welcome message
    showWelcomeMessage() {
        // Add a subtle welcome notification
        setTimeout(() => {
            window.UIManager.showNotification('Welcome to Ellerslie School AI! 🎓', 'success');
        }, 1000);
    }

    // Show error message
    showError(message) {
        if (window.UIManager) {
            window.UIManager.showError(message);
        } else {
            alert(message);
        }
    }

    // Get app version
    getVersion() {
        return '1.0.0';
    }

    // Get app info
    getAppInfo() {
        return {
            name: 'Ellerslie School AI',
            version: this.getVersion(),
            description: 'Intelligent learning assistant powered by multiple AI models',
            models: Object.keys(window.AIModels.models),
            features: [
                'Multiple AI Models',
                'Real-time Chat',
                'File Attachments',
                'Conversation History',
                'Export & Share',
                'Dark Mode',
                'Mobile Responsive',
                'Google Sites Compatible'
            ]
        };
    }

    // Export app data
    exportAppData() {
        const appInfo = this.getAppInfo();
        const conversations = Array.from(window.ChatManager.conversations.values());
        const settings = window.UIManager.loadSettings();

        const exportData = {
            appInfo,
            conversations,
            settings,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ellerslie-school-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import app data
    async importAppData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validate data structure
            if (!data.appInfo || !data.conversations) {
                throw new Error('Invalid backup file format');
            }

            // Import conversations
            data.conversations.forEach(chat => {
                window.ChatManager.conversations.set(chat.id, chat);
            });

            // Import settings
            if (data.settings) {
                localStorage.setItem('ellerslie_ai_settings', JSON.stringify(data.settings));
                window.UIManager.loadSettings();
            }

            // Update UI
            window.ChatManager.updateChatHistory();
            window.UIManager.showNotification('Data imported successfully!', 'success');

        } catch (error) {
            console.error('Import error:', error);
            window.UIManager.showError('Failed to import data');
        }
    }

    // Check for updates
    async checkForUpdates() {
        try {
            // In a real app, this would check against a version API
            const currentVersion = this.getVersion();
            const latestVersion = '1.0.0'; // This would come from an API

            if (currentVersion !== latestVersion) {
                window.UIManager.showNotification('Update available!', 'success');
            }
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    // Get usage statistics
    getUsageStats() {
        const conversations = window.ChatManager.conversations.size;
        const totalMessages = Array.from(window.ChatManager.conversations.values())
            .reduce((total, chat) => total + (chat.messageCount || 0), 0);

        return {
            conversations,
            totalMessages,
            currentModel: window.AIModels.currentModel,
            appVersion: this.getVersion()
        };
    }

    // Reset app data
    resetAppData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            // Clear conversations
            window.ChatManager.conversations.clear();
            window.ChatManager.currentConversation = [];
            window.ChatManager.currentChatId = null;

            // Clear settings
            localStorage.removeItem('ellerslie_ai_settings');
            localStorage.removeItem('ellerslie_current_model');

            // Clear API keys
            window.AIModels.apiKeys = {
                openai: '',
                anthropic: '',
                google: '',
                mistral: '',
                replicate: ''
            };

            // Update UI
            window.ChatManager.updateChatHistory();
            window.ChatManager.showWelcomeScreen();
            window.UIManager.initialize();

            window.UIManager.showNotification('App data reset successfully!', 'success');
        }
    }

    // Handle offline/online status
    handleOnlineStatus() {
        window.addEventListener('online', () => {
            window.UIManager.showNotification('Connection restored!', 'success');
        });

        window.addEventListener('offline', () => {
            window.UIManager.showNotification('You are offline. Some features may be limited.', 'error');
        });
    }

    // Initialize performance monitoring
    initializePerformanceMonitoring() {
        // Monitor app performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`App loaded in ${loadTime}ms`);
            });
        }
    }

    // Handle app visibility changes
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('App hidden');
            } else {
                console.log('App visible');
                // Refresh data when app becomes visible
                window.ChatManager.loadConversations();
            }
        });
    }

    // Initialize keyboard shortcuts help
    initializeKeyboardShortcuts() {
        // Add keyboard shortcuts help to settings
        const shortcutsHelp = `
            <div class="setting-group">
                <h3>Keyboard Shortcuts</h3>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Ctrl/Cmd + Enter</kbd>
                        <span>Send message</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/Cmd + N</kbd>
                        <span>New chat</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl/Cmd + ,</kbd>
                        <span>Settings</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Escape</kbd>
                        <span>Close modal</span>
                    </div>
                </div>
            </div>
        `;

        // Add to settings modal if it exists
        const settingsBody = document.querySelector('.modal-body');
        if (settingsBody) {
            settingsBody.insertAdjacentHTML('beforeend', shortcutsHelp);
        }
    }
}

// Initialize the app when the script loads
const app = new EllerslieSchoolAI();

// Make app globally available
window.EllerslieSchoolAI = app;

// Add some global utility functions
window.EllerslieUtils = {
    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Generate random ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    },

    // Download file
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

console.log('🎓 Ellerslie School AI loaded successfully!');