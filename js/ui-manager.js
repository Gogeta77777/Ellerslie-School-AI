// UI Manager for Ellerslie School AI
class UIManager {
    constructor() {
        this.initializeEventListeners();
        this.setupAutoResize();
        this.loadSettings();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Model selection
        document.getElementById('modelSelect').addEventListener('change', (e) => {
            this.handleModelChange(e.target.value);
        });

        // Model cards
        document.querySelectorAll('.model-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleModelCardClick(e.currentTarget.dataset.model);
            });
        });

        // Quick prompts
        document.querySelectorAll('.prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickPrompt(e.currentTarget.dataset.prompt);
            });
        });

        // New chat button
        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.handleNewChat();
        });

        // Send button
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.handleSendMessage();
        });

        // Message input
        const messageInput = document.getElementById('messageInput');
        messageInput.addEventListener('input', (e) => {
            this.handleInputChange(e.target);
        });

        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('cancelSettingsBtn').addEventListener('click', () => {
            this.hideSettings();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        // Share and export
        document.getElementById('shareBtn').addEventListener('click', () => {
            window.ChatManager.shareConversation();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            window.ChatManager.exportConversation();
        });

        // Sidebar toggle (mobile)
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Attach file button
        document.getElementById('attachBtn').addEventListener('click', () => {
            this.handleFileAttachment();
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleDarkMode(e.target.checked);
            });
        }

        // Auto-save toggle
        const autoSaveToggle = document.getElementById('autoSave');
        if (autoSaveToggle) {
            autoSaveToggle.addEventListener('change', (e) => {
                this.toggleAutoSave(e.target.checked);
            });
        }

        // Close modal when clicking outside
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.hideSettings();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // Handle model change
    handleModelChange(modelId) {
        if (window.AIModels.setCurrentModel(modelId)) {
            window.ChatManager.updateCurrentModelDisplay(modelId);
            this.updateModelInfo();
            this.saveCurrentModel();
        }
    }

    // Handle model card click
    handleModelCardClick(modelId) {
        // Update dropdown
        document.getElementById('modelSelect').value = modelId;
        
        // Update selected card
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-model="${modelId}"]`).classList.add('selected');
        
        // Change model
        this.handleModelChange(modelId);
    }

    // Handle quick prompt
    handleQuickPrompt(prompt) {
        const messageInput = document.getElementById('messageInput');
        messageInput.value = prompt;
        messageInput.focus();
        this.updateSendButton();
    }

    // Handle new chat
    async handleNewChat() {
        await window.ChatManager.createNewChat();
        this.updateModelInfo();
    }

    // Handle send message
    async handleSendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message || window.ChatManager.isLoading) {
            return;
        }

        // Clear input
        messageInput.value = '';
        this.updateSendButton();
        this.updateCharCount();

        // Show messages container
        window.ChatManager.showMessages();

        // Generate AI response
        await window.ChatManager.generateAIResponse(message);
    }

    // Handle input change
    handleInputChange(input) {
        this.updateSendButton();
        this.updateCharCount();
        this.autoResizeTextarea(input);
    }

    // Update send button state
    updateSendButton() {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const hasText = messageInput.value.trim().length > 0;
        const isLoading = window.ChatManager.isLoading;

        sendBtn.disabled = !hasText || isLoading;
    }

    // Update character count
    updateCharCount() {
        const messageInput = document.getElementById('messageInput');
        const charCount = document.getElementById('charCount');
        const currentLength = messageInput.value.length;
        const maxLength = parseInt(messageInput.getAttribute('maxlength'));

        charCount.textContent = `${currentLength}/${maxLength}`;
        
        // Change color based on usage
        if (currentLength > maxLength * 0.9) {
            charCount.style.color = 'var(--error-color)';
        } else if (currentLength > maxLength * 0.7) {
            charCount.style.color = 'var(--warning-color)';
        } else {
            charCount.style.color = 'var(--text-muted)';
        }
    }

    // Update model info
    updateModelInfo() {
        const modelInfo = document.getElementById('modelInfo');
        const currentModel = window.AIModels.getCurrentModel();
        modelInfo.textContent = `Powered by ${currentModel.name}`;
    }

    // Show settings modal
    showSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.add('show');
        
        // Load current settings
        this.loadSettingsIntoModal();
    }

    // Hide settings modal
    hideSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('show');
    }

    // Load settings into modal
    loadSettingsIntoModal() {
        const settings = this.loadSettings();
        
        document.getElementById('openaiKey').value = settings.openaiKey || '';
        document.getElementById('anthropicKey').value = settings.anthropicKey || '';
        document.getElementById('googleKey').value = settings.googleKey || '';
        document.getElementById('mistralKey').value = settings.mistralKey || '';
        document.getElementById('autoSave').checked = settings.autoSave !== false;
        document.getElementById('darkMode').checked = settings.darkMode === true;
    }

    // Save settings
    saveSettings() {
        const settings = {
            openaiKey: document.getElementById('openaiKey').value,
            anthropicKey: document.getElementById('anthropicKey').value,
            googleKey: document.getElementById('googleKey').value,
            mistralKey: document.getElementById('mistralKey').value,
            autoSave: document.getElementById('autoSave').checked,
            darkMode: document.getElementById('darkMode').checked
        };

        // Save API keys to AI models
        window.AIModels.saveAPIKeys({
            openai: settings.openaiKey,
            anthropic: settings.anthropicKey,
            google: settings.googleKey,
            mistral: settings.mistralKey
        });

        // Save settings to localStorage
        localStorage.setItem('ellerslie_ai_settings', JSON.stringify(settings));

        // Apply dark mode
        this.toggleDarkMode(settings.darkMode);

        this.hideSettings();
        this.showNotification('Settings saved successfully!');
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('ellerslie_ai_settings');
        return saved ? JSON.parse(saved) : {
            autoSave: true,
            darkMode: false
        };
    }

    // Toggle dark mode
    toggleDarkMode(enabled) {
        document.documentElement.setAttribute('data-theme', enabled ? 'dark' : 'light');
    }

    // Toggle auto save
    toggleAutoSave(enabled) {
        // Implementation for auto-save functionality
        console.log('Auto-save:', enabled ? 'enabled' : 'disabled');
    }

    // Handle file attachment
    handleFileAttachment() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.doc,.docx,.txt';
        input.multiple = true;

        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.processAttachedFiles(files);
        });

        input.click();
    }

    // Process attached files
    async processAttachedFiles(files) {
        for (const file of files) {
            try {
                const message = `Attached file: ${file.name} (${this.formatFileSize(file.size)})`;
                await window.ChatManager.addMessage(message, 'user');
                window.ChatManager.displayMessage(message, 'user');
                
                // TODO: Implement file upload to Firebase Storage
                console.log('File attached:', file.name);
            } catch (error) {
                console.error('Error processing file:', error);
                this.showError('Failed to attach file');
            }
        }
    }

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to send message
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.handleSendMessage();
        }

        // Ctrl/Cmd + N for new chat
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.handleNewChat();
        }

        // Ctrl/Cmd + , for settings
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            this.showSettings();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            this.hideSettings();
        }
    }

    // Toggle sidebar (mobile)
    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show');
    }

    // Setup auto-resize for textarea
    setupAutoResize() {
        const messageInput = document.getElementById('messageInput');
        this.autoResizeTextarea(messageInput);
    }

    // Auto-resize textarea
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }

    // Save current model
    saveCurrentModel() {
        localStorage.setItem('ellerslie_current_model', window.AIModels.currentModel);
    }

    // Load current model
    loadCurrentModel() {
        const savedModel = localStorage.getItem('ellerslie_current_model');
        if (savedModel && window.AIModels.models[savedModel]) {
            this.handleModelChange(savedModel);
        }
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Show error
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Initialize UI
    initialize() {
        this.loadCurrentModel();
        this.updateModelInfo();
        this.updateSendButton();
        this.updateCharCount();
        
        // Apply saved settings
        const settings = this.loadSettings();
        this.toggleDarkMode(settings.darkMode);
    }
}

// Create global instance
window.UIManager = new UIManager();