#!/bin/bash

# Simple Firebase Deployment Script
# Run this script to deploy your app to Firebase

echo "🚀 Starting Firebase Deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase..."
    firebase login
fi

# Deploy to Firebase
echo "📤 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment completed!"
echo "🌐 Your app is live at: https://ellerslie-school-ai.web.app/"
echo "📊 Firebase Console: https://console.firebase.google.com/project/ellerslie-school-ai"