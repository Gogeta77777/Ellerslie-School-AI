# 🎓 Ellerslie School AI

An intelligent learning assistant powered by multiple AI models, designed specifically for students and educators. Built with modern web technologies and inspired by ChatGPT, Copilot, and other leading AI platforms.

## ✨ Features

### 🤖 Multiple AI Models
- **GPT-4 (OpenAI)** - Advanced reasoning and analysis
- **Claude 3 (Anthropic)** - Creative writing and coding
- **Gemini Pro (Google)** - Multimodal understanding
- **Llama 2 (Meta)** - Open-source intelligence
- **Mistral (Mistral AI)** - Fast and efficient responses

### 💬 Real-time Chat Interface
- Modern, responsive design inspired by ChatGPT
- Real-time message streaming
- Conversation history with Firebase integration
- Markdown support for rich text formatting
- Code syntax highlighting

### 📱 Modern UI/UX
- Clean, intuitive interface
- Dark/Light mode support
- Mobile-responsive design
- Google Sites embed compatible
- PWA (Progressive Web App) support

### 🔧 Advanced Features
- File attachments support
- Export conversations to JSON
- Share conversations via native sharing
- Keyboard shortcuts
- Auto-save functionality
- Offline support with service worker

### 🔐 Security & Privacy
- **Username/Password Authentication** - Secure login system
- **Account Management** - User profiles with preferences
- **Password Reset** - Email-based password recovery
- **Session Persistence** - Stay logged in across browser sessions
- **Secure API Key Management** - Encrypted storage of API keys
- **User Data Isolation** - Each user's data is completely separate
- **GDPR Compliant** - Privacy-focused design

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Firebase CLI
- API keys for the AI models you want to use

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ellerslie-school-ai.git
   cd ellerslie-school-ai
   ```

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

3. **Login to Firebase**
   ```bash
   firebase login
   ```

4. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage

5. **Configure Firebase**
   - Open `js/firebase-config.js`
   - Replace the placeholder config with your actual Firebase project details
   - Update the config with your project's API key, auth domain, etc.

6. **Deploy to Firebase**
   ```bash
   ./deploy.sh
   ```
   Or manually:
   ```bash
   firebase deploy
   ```

7. **Configure API Keys**
   - Open your deployed app
   - Sign up for a new account
   - Go to Settings and add your API keys for the AI models you want to use

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Anonymous sign-in)
3. Enable Firestore Database
4. Enable Storage
5. Update the Firebase config in `js/firebase-config.js`

### API Keys Setup

You'll need API keys for the AI models you want to use:

- **OpenAI**: Get from [OpenAI Platform](https://platform.openai.com/)
- **Anthropic**: Get from [Anthropic Console](https://console.anthropic.com/)
- **Google**: Get from [Google AI Studio](https://makersuite.google.com/)
- **Mistral**: Get from [Mistral AI](https://console.mistral.ai/)
- **Replicate**: Get from [Replicate](https://replicate.com/) (for Llama 2)

### Environment Variables

For production, consider using environment variables for API keys:

```bash
# Create a .env file
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
MISTRAL_API_KEY=your_mistral_key
REPLICATE_API_KEY=your_replicate_key
```

## 📁 Project Structure

```
ellerslie-school-ai/
├── index.html              # Main HTML file
├── styles.css              # Main CSS styles
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
├── firestore.indexes.json  # Firestore indexes
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── ai-models.js        # AI models configuration
│   ├── chat-manager.js     # Chat functionality
│   ├── ui-manager.js       # UI interactions
│   └── app.js              # Main application
└── assets/                 # Images and icons
    ├── icon-*.png          # PWA icons
    ├── screenshot-*.png    # App screenshots
    └── favicon.ico         # Favicon
```

## 🎨 Customization

### Styling
The app uses CSS custom properties for easy theming. Main variables are defined in `styles.css`:

```css
:root {
  --primary-color: #10a37f;
  --bg-primary: #ffffff;
  --text-primary: #111827;
  /* ... more variables */
}
```

### Adding New AI Models
To add a new AI model, update the `models` object in `js/ai-models.js`:

```javascript
'new-model': {
    name: 'New Model',
    provider: 'Provider Name',
    endpoint: 'https://api.provider.com/v1/chat',
    model: 'model-name',
    maxTokens: 4096,
    temperature: 0.7,
    icon: 'fas fa-icon',
    description: 'Model description',
    color: '#color-code'
}
```

### Google Sites Integration
The app is designed to be embeddable in Google Sites. Add this iframe:

```html
<iframe 
  src="https://your-firebase-app.web.app" 
  width="100%" 
  height="600px" 
  frameborder="0"
  class="google-sites-embed">
</iframe>
```

## 🔧 Development

### Local Development
1. Install Firebase CLI tools
2. Run `firebase serve` for local development
3. Access the app at `http://localhost:5000`

### Building for Production
The app is ready for production deployment. Simply run:
```bash
firebase deploy
```

### Testing
- Test all AI models with different prompts
- Verify Firebase integration
- Test mobile responsiveness
- Check PWA functionality

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Works without internet connection
- **Push Notifications**: Real-time updates
- **Background Sync**: Sync data when online
- **App-like Experience**: Full-screen mode

## 🔒 Security

- All API keys are stored locally in the browser
- Firebase security rules protect user data
- HTTPS enforced in production
- No sensitive data logged

## 📊 Performance

- Optimized bundle size
- Lazy loading of components
- Efficient caching strategy
- Fast loading times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by ChatGPT, Copilot, and other modern AI platforms
- Built with Firebase for reliable backend services
- Uses Font Awesome for icons
- Inter font family for typography

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Email: support@ellerslie-school-ai.com
- Documentation: [docs.ellerslie-school-ai.com](https://docs.ellerslie-school-ai.com)

## 🚀 Deployment Checklist

- [ ] Firebase project configured
- [ ] API keys added to settings
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled
- [ ] Performance monitoring set up
- [ ] Error tracking configured

---

**Made with ❤️ for students and educators everywhere**