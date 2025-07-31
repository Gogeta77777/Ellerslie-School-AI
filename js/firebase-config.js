// Firebase Configuration for Ellerslie School AI
const firebaseConfig = {
    apiKey: "AIzaSyAndeh1Tj_yzSgMQYd_tJI1tWEXjXnbEzg",
    authDomain: "ellerslie-school-ai.firebaseapp.com",
    databaseURL: "https://ellerslie-school-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ellerslie-school-ai",
    storageBucket: "ellerslie-school-ai.firebasestorage.app",
    messagingSenderId: "639403681683",
    appId: "1:639403681683:web:0302730440378d601faa66",
    measurementId: "G-C4DY6F4K7M"
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