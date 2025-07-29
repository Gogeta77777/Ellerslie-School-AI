// Firebase Configuration for Ellerslie School AI
const firebaseConfig = {
    apiKey: "AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx", // Replace with your Firebase API key
    authDomain: "ellerslie-school-ai.firebaseapp.com",
    projectId: "ellerslie-school-ai",
    storageBucket: "ellerslie-school-ai.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdefghijklmnop",
    measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Firebase configuration object for easy access
const FirebaseConfig = {
    db,
    auth,
    storage,
    config: firebaseConfig
};

// Export for use in other modules
window.FirebaseConfig = FirebaseConfig;

console.log('Firebase initialized for Ellerslie School AI');