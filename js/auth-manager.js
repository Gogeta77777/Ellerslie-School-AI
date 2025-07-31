// Authentication Manager for Ellerslie School AI
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.auth = window.FirebaseConfig.auth;
        this.db = window.FirebaseConfig.db;
        this.initializeAuth();
        this.setupEventListeners();
    }

    // Initialize authentication
    initializeAuth() {
        // Listen for auth state changes
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.handleUserSignIn(user);
            } else {
                this.handleUserSignOut();
            }
        });

        // Check if user is already signed in
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            this.handleUserSignIn(currentUser);
        } else {
            this.showAuthOverlay();
        }
    }

    // Setup event listeners for authentication forms
    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Forgot password form
        document.getElementById('forgotForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Form navigation
        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignupForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPasswordForm();
        });

        document.getElementById('backToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Change password
        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            this.showChangePasswordModal();
        });

        document.getElementById('savePasswordBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleChangePassword();
        });

        // Close modals
        document.getElementById('closePasswordBtn').addEventListener('click', () => {
            this.hideChangePasswordModal();
        });

        document.getElementById('cancelPasswordBtn').addEventListener('click', () => {
            this.hideChangePasswordModal();
        });
    }

    // Handle login
    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        try {
            this.showLoading(true);

            // First, get the user document by username
            const userSnapshot = await this.db
                .collection('users')
                .where('username', '==', username)
                .limit(1)
                .get();

            if (userSnapshot.empty) {
                this.showError('Invalid username or password');
                return;
            }

            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data();

            // Sign in with email and password
            const userCredential = await this.auth.signInWithEmailAndPassword(
                userData.email,
                password
            );

            this.showSuccess('Successfully signed in!');
            this.hideAuthOverlay();

        } catch (error) {
            console.error('Login error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.showLoading(false);
        }
    }

    // Handle signup
    async handleSignup() {
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            this.showError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        if (username.length < 3) {
            this.showError('Username must be at least 3 characters long');
            return;
        }

        // Check if username already exists
        const usernameCheck = await this.db
            .collection('users')
            .where('username', '==', username)
            .limit(1)
            .get();

        if (!usernameCheck.empty) {
            this.showError('Username already exists');
            return;
        }

        // Check if email already exists
        const emailCheck = await this.db
            .collection('users')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!emailCheck.empty) {
            this.showError('Email already exists');
            return;
        }

        try {
            this.showLoading(true);

            // Create user with email and password
            const userCredential = await this.auth.createUserWithEmailAndPassword(
                email,
                password
            );

            const user = userCredential.user;

            // Create user document
            await this.db.collection('users').doc(user.uid).set({
                username: username,
                email: email,
                createdAt: new Date(),
                lastLogin: new Date(),
                preferences: {
                    autoSave: true,
                    darkMode: false,
                    notifications: true
                }
            });

            this.showSuccess('Account created successfully!');
            this.hideAuthOverlay();

        } catch (error) {
            console.error('Signup error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.showLoading(false);
        }
    }

    // Handle forgot password
    async handleForgotPassword() {
        const email = document.getElementById('forgotEmail').value.trim();

        if (!email) {
            this.showError('Please enter your email address');
            return;
        }

        try {
            this.showLoading(true);

            // Check if email exists
            const emailCheck = await this.db
                .collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();

            if (emailCheck.empty) {
                this.showError('No account found with this email address');
                return;
            }

            // Send password reset email
            await this.auth.sendPasswordResetEmail(email);

            this.showSuccess('Password reset email sent! Check your inbox.');
            this.showLoginForm();

        } catch (error) {
            console.error('Forgot password error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.showLoading(false);
        }
    }

    // Handle change password
    async handleChangePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            this.showError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            this.showError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        try {
            this.showLoading(true);

            const user = this.auth.currentUser;
            const email = user.email;

            // Re-authenticate user
            const credential = this.auth.EmailAuthProvider.credential(
                email,
                currentPassword
            );

            await user.reauthenticateWithCredential(credential);

            // Update password
            await user.updatePassword(newPassword);

            this.showSuccess('Password updated successfully!');
            this.hideChangePasswordModal();

        } catch (error) {
            console.error('Change password error:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.showLoading(false);
        }
    }

    // Handle logout
    async handleLogout() {
        try {
            await this.auth.signOut();
            this.showSuccess('Successfully signed out!');
        } catch (error) {
            console.error('Logout error:', error);
            this.showError('Failed to sign out');
        }
    }

    // Handle user sign in
    async handleUserSignIn(user) {
        try {
            // Get user data from Firestore
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    username: userData.username,
                    ...userData
                };

                // Update last login
                await this.db.collection('users').doc(user.uid).update({
                    lastLogin: new Date()
                });

                // Update UI
                this.updateUserDisplay();
                this.hideAuthOverlay();
                this.showApp();

                // Initialize other managers
                if (window.ChatManager) {
                    window.ChatManager.loadConversations();
                }
                if (window.UIManager) {
                    window.UIManager.initialize();
                }

            } else {
                // User document doesn't exist, sign out
                await this.auth.signOut();
                this.showError('User data not found');
            }
        } catch (error) {
            console.error('Error handling user sign in:', error);
            this.showError('Failed to load user data');
        }
    }

    // Handle user sign out
    handleUserSignOut() {
        this.currentUser = null;
        this.showAuthOverlay();
        this.hideApp();
        
        // Clear chat data
        if (window.ChatManager) {
            window.ChatManager.conversations.clear();
            window.ChatManager.currentConversation = [];
            window.ChatManager.currentChatId = null;
        }
    }

    // Update user display
    updateUserDisplay() {
        const userDisplayName = document.getElementById('userDisplayName');
        const settingsUsername = document.getElementById('settingsUsername');
        const settingsEmail = document.getElementById('settingsEmail');

        if (this.currentUser) {
            const displayName = this.currentUser.username || this.currentUser.email;
            
            if (userDisplayName) userDisplayName.textContent = displayName;
            if (settingsUsername) settingsUsername.textContent = this.currentUser.username || 'N/A';
            if (settingsEmail) settingsEmail.textContent = this.currentUser.email || 'N/A';
        }
    }

    // Show auth overlay
    showAuthOverlay() {
        document.getElementById('authOverlay').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
    }

    // Hide auth overlay
    hideAuthOverlay() {
        document.getElementById('authOverlay').style.display = 'none';
    }

    // Show app
    showApp() {
        document.getElementById('appContainer').style.display = 'flex';
    }

    // Hide app
    hideApp() {
        document.getElementById('appContainer').style.display = 'none';
    }

    // Show login form
    showLoginForm() {
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('forgotForm').style.display = 'none';
    }

    // Show signup form
    showSignupForm() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'flex';
        document.getElementById('forgotForm').style.display = 'none';
    }

    // Show forgot password form
    showForgotPasswordForm() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'none';
        document.getElementById('forgotForm').style.display = 'flex';
    }

    // Show change password modal
    showChangePasswordModal() {
        document.getElementById('changePasswordModal').classList.add('show');
        document.getElementById('settingsModal').classList.remove('show');
    }

    // Hide change password modal
    hideChangePasswordModal() {
        document.getElementById('changePasswordModal').classList.remove('show');
        // Clear form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    }

    // Show loading
    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (show) {
            loadingOverlay.classList.add('show');
        } else {
            loadingOverlay.classList.remove('show');
        }
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Get error message from Firebase error
    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No account found with this email address';
            case 'auth/wrong-password':
                return 'Invalid password';
            case 'auth/email-already-in-use':
                return 'Email already in use';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            default:
                return error.message || 'An error occurred. Please try again';
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Get user preferences
    getUserPreferences() {
        return this.currentUser?.preferences || {
            autoSave: true,
            darkMode: false,
            notifications: true
        };
    }

    // Update user preferences
    async updateUserPreferences(preferences) {
        if (!this.currentUser) return;

        try {
            await this.db.collection('users').doc(this.currentUser.uid).update({
                preferences: preferences
            });

            this.currentUser.preferences = preferences;
        } catch (error) {
            console.error('Error updating preferences:', error);
            throw error;
        }
    }
}

// Create global instance
window.AuthManager = new AuthManager();