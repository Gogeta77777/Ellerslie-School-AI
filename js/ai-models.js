// AI Models Configuration for Ellerslie School AI
class AIModels {
    constructor() {
        this.models = {
            'gpt-4': {
                name: 'GPT-4',
                provider: 'OpenAI',
                endpoint: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-4',
                maxTokens: 4096,
                temperature: 0.7,
                icon: 'fas fa-brain',
                description: 'Advanced reasoning and analysis',
                color: '#10a37f'
            },
            'claude-3': {
                name: 'Claude 3',
                provider: 'Anthropic',
                endpoint: 'https://api.anthropic.com/v1/messages',
                model: 'claude-3-sonnet-20240229',
                maxTokens: 4096,
                temperature: 0.7,
                icon: 'fas fa-lightbulb',
                description: 'Creative writing and coding',
                color: '#ff6b35'
            },
            'gemini-pro': {
                name: 'Gemini Pro',
                provider: 'Google',
                endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
                model: 'gemini-pro',
                maxTokens: 2048,
                temperature: 0.7,
                icon: 'fas fa-search',
                description: 'Multimodal understanding',
                color: '#4285f4'
            },
            'llama-2': {
                name: 'Llama 2',
                provider: 'Meta',
                endpoint: 'https://api.replicate.com/v1/predictions',
                model: 'meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3',
                maxTokens: 4096,
                temperature: 0.7,
                icon: 'fas fa-code',
                description: 'Open-source intelligence',
                color: '#1877f2'
            },
            'mistral': {
                name: 'Mistral',
                provider: 'Mistral AI',
                endpoint: 'https://api.mistral.ai/v1/chat/completions',
                model: 'mistral-large-latest',
                maxTokens: 4096,
                temperature: 0.7,
                icon: 'fas fa-rocket',
                description: 'Fast and efficient responses',
                color: '#7c3aed'
            }
        };

        this.currentModel = 'gpt-4';
        this.apiKeys = this.loadAPIKeys();
    }

    // Load API keys from localStorage
    loadAPIKeys() {
        return {
            openai: localStorage.getItem('openai_api_key') || '',
            anthropic: localStorage.getItem('anthropic_api_key') || '',
            google: localStorage.getItem('google_api_key') || '',
            mistral: localStorage.getItem('mistral_api_key') || '',
            replicate: localStorage.getItem('replicate_api_key') || ''
        };
    }

    // Save API keys to localStorage
    saveAPIKeys(keys) {
        Object.keys(keys).forEach(key => {
            if (keys[key]) {
                localStorage.setItem(`${key}_api_key`, keys[key]);
            }
        });
        this.apiKeys = { ...this.apiKeys, ...keys };
    }

    // Get current model configuration
    getCurrentModel() {
        return this.models[this.currentModel];
    }

    // Set current model
    setCurrentModel(modelId) {
        if (this.models[modelId]) {
            this.currentModel = modelId;
            return true;
        }
        return false;
    }

    // Get all models
    getAllModels() {
        return this.models;
    }

    // Check if API key is available for a model
    hasAPIKey(modelId) {
        const model = this.models[modelId];
        if (!model) return false;

        switch (model.provider) {
            case 'OpenAI':
                return !!this.apiKeys.openai;
            case 'Anthropic':
                return !!this.apiKeys.anthropic;
            case 'Google':
                return !!this.apiKeys.google;
            case 'Meta':
                return !!this.apiKeys.replicate;
            case 'Mistral AI':
                return !!this.apiKeys.mistral;
            default:
                return false;
        }
    }

    // Generate response using the selected AI model
    async generateResponse(message, conversationHistory = []) {
        const model = this.getCurrentModel();
        
        if (!this.hasAPIKey(this.currentModel)) {
            throw new Error(`API key not configured for ${model.name}`);
        }

        try {
            switch (model.provider) {
                case 'OpenAI':
                    return await this.callOpenAI(message, conversationHistory);
                case 'Anthropic':
                    return await this.callAnthropic(message, conversationHistory);
                case 'Google':
                    return await this.callGoogle(message, conversationHistory);
                case 'Meta':
                    return await this.callReplicate(message, conversationHistory);
                case 'Mistral AI':
                    return await this.callMistral(message, conversationHistory);
                default:
                    throw new Error(`Unsupported provider: ${model.provider}`);
            }
        } catch (error) {
            console.error(`Error calling ${model.provider} API:`, error);
            throw error;
        }
    }

    // OpenAI API call
    async callOpenAI(message, conversationHistory) {
        const model = this.getCurrentModel();
        const messages = this.formatMessagesForOpenAI(message, conversationHistory);

        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys.openai}`
            },
            body: JSON.stringify({
                model: model.model,
                messages: messages,
                max_tokens: model.maxTokens,
                temperature: model.temperature,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Anthropic API call
    async callAnthropic(message, conversationHistory) {
        const model = this.getCurrentModel();
        const messages = this.formatMessagesForAnthropic(message, conversationHistory);

        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKeys.anthropic,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model.model,
                messages: messages,
                max_tokens: model.maxTokens,
                temperature: model.temperature
            })
        });

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // Google Gemini API call
    async callGoogle(message, conversationHistory) {
        const model = this.getCurrentModel();
        const prompt = this.formatMessagesForGoogle(message, conversationHistory);

        const response = await fetch(`${model.endpoint}?key=${this.apiKeys.google}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: model.maxTokens,
                    temperature: model.temperature
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Google API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // Replicate (Meta Llama) API call
    async callReplicate(message, conversationHistory) {
        const model = this.getCurrentModel();
        const prompt = this.formatMessagesForLlama(message, conversationHistory);

        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${this.apiKeys.replicate}`
            },
            body: JSON.stringify({
                version: model.model.split(':')[1],
                input: {
                    prompt: prompt,
                    max_tokens: model.maxTokens,
                    temperature: model.temperature,
                    top_p: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Replicate API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Poll for completion
        const predictionId = data.id;
        let result = null;
        
        while (!result) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
                headers: {
                    'Authorization': `Token ${this.apiKeys.replicate}`
                }
            });
            
            const statusData = await statusResponse.json();
            if (statusData.status === 'succeeded') {
                result = statusData.output.join('');
                break;
            } else if (statusData.status === 'failed') {
                throw new Error('Replicate prediction failed');
            }
        }

        return result;
    }

    // Mistral API call
    async callMistral(message, conversationHistory) {
        const model = this.getCurrentModel();
        const messages = this.formatMessagesForMistral(message, conversationHistory);

        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys.mistral}`
            },
            body: JSON.stringify({
                model: model.model,
                messages: messages,
                max_tokens: model.maxTokens,
                temperature: model.temperature
            })
        });

        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Format messages for OpenAI
    formatMessagesForOpenAI(message, conversationHistory) {
        const messages = [
            {
                role: 'system',
                content: 'You are Ellerslie School AI, an intelligent learning assistant designed to help students with their studies. Provide helpful, accurate, and educational responses.'
            }
        ];

        // Add conversation history
        conversationHistory.forEach(msg => {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        });

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        return messages;
    }

    // Format messages for Anthropic
    formatMessagesForAnthropic(message, conversationHistory) {
        const messages = [];

        // Add conversation history
        conversationHistory.forEach(msg => {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        });

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        return messages;
    }

    // Format messages for Google
    formatMessagesForGoogle(message, conversationHistory) {
        let prompt = 'You are Ellerslie School AI, an intelligent learning assistant designed to help students with their studies. Provide helpful, accurate, and educational responses.\n\n';

        // Add conversation history
        conversationHistory.forEach(msg => {
            prompt += `${msg.role === 'user' ? 'Student' : 'AI'}: ${msg.content}\n`;
        });

        // Add current message
        prompt += `Student: ${message}\nAI:`;

        return prompt;
    }

    // Format messages for Llama
    formatMessagesForLlama(message, conversationHistory) {
        let prompt = '<s>[INST] You are Ellerslie School AI, an intelligent learning assistant designed to help students with their studies. Provide helpful, accurate, and educational responses. [/INST]';

        // Add conversation history
        conversationHistory.forEach(msg => {
            prompt += `\n<s>[INST] ${msg.content} [/INST] ${msg.role === 'assistant' ? msg.content : ''}`;
        });

        // Add current message
        prompt += `\n<s>[INST] ${message} [/INST]`;

        return prompt;
    }

    // Format messages for Mistral
    formatMessagesForMistral(message, conversationHistory) {
        const messages = [
            {
                role: 'system',
                content: 'You are Ellerslie School AI, an intelligent learning assistant designed to help students with their studies. Provide helpful, accurate, and educational responses.'
            }
        ];

        // Add conversation history
        conversationHistory.forEach(msg => {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        });

        // Add current message
        messages.push({
            role: 'user',
            content: message
        });

        return messages;
    }

    // Get model display name
    getModelDisplayName(modelId) {
        const model = this.models[modelId];
        return model ? model.name : 'Unknown Model';
    }

    // Get model description
    getModelDescription(modelId) {
        const model = this.models[modelId];
        return model ? model.description : '';
    }

    // Get model icon
    getModelIcon(modelId) {
        const model = this.models[modelId];
        return model ? model.icon : 'fas fa-question';
    }

    // Get model color
    getModelColor(modelId) {
        const model = this.models[modelId];
        return model ? model.color : '#6b7280';
    }
}

// Create global instance
window.AIModels = new AIModels();