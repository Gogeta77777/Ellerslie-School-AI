// Chat Manager for Ellerslie School AI
class ChatManager {
    constructor() {
        this.currentChatId = null;
        this.conversations = new Map();
        this.currentConversation = [];
        this.isLoading = false;
        
        // Initialize Firebase
        this.db = window.FirebaseConfig.db;
        this.auth = window.FirebaseConfig.auth;
        this.storage = window.FirebaseConfig.storage;
        
        this.loadConversations();
    }

    // Generate a unique chat ID
    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Create a new chat
    async createNewChat() {
        const chatId = this.generateChatId();
        const chatData = {
            id: chatId,
            title: 'New Chat',
            model: window.AIModels.currentModel,
            createdAt: new Date(),
            updatedAt: new Date(),
            messageCount: 0
        };

        this.currentChatId = chatId;
        this.currentConversation = [];
        this.conversations.set(chatId, chatData);

        // Save to Firebase
        await this.saveChatToFirebase(chatData);

        // Update UI
        this.updateChatHistory();
        this.showWelcomeScreen();

        return chatId;
    }

    // Load chat by ID
    async loadChat(chatId) {
        if (!this.conversations.has(chatId)) {
            console.error('Chat not found:', chatId);
            return false;
        }

        this.currentChatId = chatId;
        const chatData = this.conversations.get(chatId);
        
        // Load messages from Firebase
        await this.loadMessagesFromFirebase(chatId);
        
        // Update UI
        this.updateChatHistory();
        this.showMessages();
        this.updateCurrentModelDisplay(chatData.model);

        return true;
    }

    // Add message to current conversation
    async addMessage(content, role = 'user') {
        if (!this.currentChatId) {
            await this.createNewChat();
        }

        const message = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            content: content,
            role: role,
            timestamp: new Date(),
            model: window.AIModels.currentModel
        };

        this.currentConversation.push(message);

        // Update chat data
        const chatData = this.conversations.get(this.currentChatId);
        if (chatData) {
            chatData.updatedAt = new Date();
            chatData.messageCount = this.currentConversation.length;
            if (role === 'user' && this.currentConversation.length === 1) {
                chatData.title = this.generateTitleFromMessage(content);
            }
        }

        // Save to Firebase
        await this.saveMessageToFirebase(message);
        await this.updateChatInFirebase(chatData);

        return message;
    }

    // Generate AI response
    async generateAIResponse(userMessage) {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading(true);

        try {
            // Add user message
            await this.addMessage(userMessage, 'user');

            // Get conversation history for context
            const conversationHistory = this.currentConversation
                .filter(msg => msg.role === 'user' || msg.role === 'assistant')
                .map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));

            // Generate AI response
            const aiResponse = await window.AIModels.generateResponse(userMessage, conversationHistory);

            // Add AI response
            await this.addMessage(aiResponse, 'assistant');

            // Update UI
            this.displayMessage(userMessage, 'user');
            this.displayMessage(aiResponse, 'assistant');

        } catch (error) {
            console.error('Error generating AI response:', error);
            this.showError('Failed to generate response. Please check your API keys in settings.');
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }

    // Display message in UI
    displayMessage(content, role) {
        const messagesContainer = document.getElementById('messagesContainer');
        const messageElement = this.createMessageElement(content, role);
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Create message element
    createMessageElement(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.setAttribute('data-role', role);

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = role === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = this.formatMessageContent(content);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString();

        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(timeDiv);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    }

    // Format message content (support for markdown, code, etc.)
    formatMessageContent(content) {
        // Basic markdown formatting
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');

        // Code blocks
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'text'}">${this.escapeHtml(code)}</code></pre>`;
        });

        return formatted;
    }

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Generate title from first message
    generateTitleFromMessage(message) {
        const words = message.split(' ').slice(0, 6);
        return words.join(' ') + (message.split(' ').length > 6 ? '...' : '');
    }

    // Show welcome screen
    showWelcomeScreen() {
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('messagesContainer').style.display = 'none';
    }

    // Show messages
    showMessages() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('messagesContainer').style.display = 'block';
        
        // Clear existing messages
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = '';
        
        // Display conversation history
        this.currentConversation.forEach(msg => {
            this.displayMessage(msg.content, msg.role);
        });
    }

    // Show loading state
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (show) {
            loadingOverlay.classList.add('show');
        } else {
            loadingOverlay.classList.remove('show');
        }
    }

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message assistant error';
        errorDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="message-content">
                <div class="message-text error-text">
                    <i class="fas fa-exclamation-circle"></i>
                    ${message}
                </div>
            </div>
        `;
        
        document.getElementById('messagesContainer').appendChild(errorDiv);
    }

    // Update chat history in sidebar
    updateChatHistory() {
        const chatHistory = document.getElementById('chatHistory');
        chatHistory.innerHTML = '';

        this.conversations.forEach((chat, chatId) => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.setAttribute('data-chat-id', chatId);
            chatItem.innerHTML = `
                <i class="fas fa-comment"></i>
                <span>${chat.title}</span>
            `;

            if (chatId === this.currentChatId) {
                chatItem.classList.add('active');
            }

            chatItem.addEventListener('click', () => this.loadChat(chatId));
            chatHistory.appendChild(chatItem);
        });
    }

    // Update current model display
    updateCurrentModelDisplay(modelId) {
        const currentModelElement = document.getElementById('currentModel');
        const modelInfoElement = document.getElementById('modelInfo');
        
        if (currentModelElement) {
            currentModelElement.textContent = window.AIModels.getModelDisplayName(modelId);
        }
        
        if (modelInfoElement) {
            modelInfoElement.textContent = `Powered by ${window.AIModels.getModelDisplayName(modelId)}`;
        }
    }

    // Load conversations from Firebase
    async loadConversations() {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            const snapshot = await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .orderBy('updatedAt', 'desc')
                .get();

            snapshot.forEach(doc => {
                const chatData = doc.data();
                chatData.id = doc.id;
                this.conversations.set(doc.id, chatData);
            });

            this.updateChatHistory();
        } catch (error) {
            console.error('Error loading conversations:', error);
        }
    }

    // Save chat to Firebase
    async saveChatToFirebase(chatData) {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .doc(chatData.id)
                .set(chatData);
        } catch (error) {
            console.error('Error saving chat to Firebase:', error);
        }
    }

    // Update chat in Firebase
    async updateChatInFirebase(chatData) {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .doc(chatData.id)
                .update(chatData);
        } catch (error) {
            console.error('Error updating chat in Firebase:', error);
        }
    }

    // Save message to Firebase
    async saveMessageToFirebase(message) {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .doc(this.currentChatId)
                .collection('messages')
                .doc(message.id)
                .set(message);
        } catch (error) {
            console.error('Error saving message to Firebase:', error);
        }
    }

    // Load messages from Firebase
    async loadMessagesFromFirebase(chatId) {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            const snapshot = await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .orderBy('timestamp', 'asc')
                .get();

            this.currentConversation = [];
            snapshot.forEach(doc => {
                this.currentConversation.push(doc.data());
            });
        } catch (error) {
            console.error('Error loading messages from Firebase:', error);
        }
    }

    // Export conversation
    exportConversation() {
        if (!this.currentChatId || this.currentConversation.length === 0) {
            return;
        }

        const chatData = this.conversations.get(this.currentChatId);
        const exportData = {
            title: chatData.title,
            model: chatData.model,
            createdAt: chatData.createdAt,
            messages: this.currentConversation
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ellerslie-school-ai-${this.currentChatId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Share conversation
    async shareConversation() {
        if (!this.currentChatId || this.currentConversation.length === 0) {
            return;
        }

        const chatData = this.conversations.get(this.currentChatId);
        const shareText = `Ellerslie School AI Conversation: ${chatData.title}\n\n` +
            this.currentConversation.map(msg => 
                `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}`
            ).join('\n\n');

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Ellerslie School AI Conversation',
                    text: shareText
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Conversation copied to clipboard!');
            });
        }
    }

    // Delete conversation
    async deleteConversation(chatId) {
        try {
            const user = this.auth.currentUser;
            if (!user) return;

            // Delete from Firebase
            await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .doc(chatId)
                .delete();

            // Delete messages
            const messagesSnapshot = await this.db
                .collection('users')
                .doc(user.uid)
                .collection('chats')
                .doc(chatId)
                .collection('messages')
                .get();

            const deletePromises = messagesSnapshot.docs.map(doc => doc.ref.delete());
            await Promise.all(deletePromises);

            // Remove from local storage
            this.conversations.delete(chatId);

            // If this was the current chat, create a new one
            if (chatId === this.currentChatId) {
                await this.createNewChat();
            } else {
                this.updateChatHistory();
            }
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    }

    // Get current conversation
    getCurrentConversation() {
        return this.currentConversation;
    }

    // Get current chat ID
    getCurrentChatId() {
        return this.currentChatId;
    }

    // Check if currently loading
    isLoading() {
        return this.isLoading;
    }
}

// Create global instance
window.ChatManager = new ChatManager();