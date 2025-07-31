#!/bin/bash

# Ellerslie School AI Deployment Script
# This script automates the deployment process to Firebase

set -e

echo "🚀 Starting Ellerslie School AI deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Firebase CLI is installed
check_firebase_cli() {
    if ! command -v firebase &> /dev/null; then
        print_error "Firebase CLI is not installed. Please install it first:"
        echo "npm install -g firebase-tools"
        exit 1
    fi
    print_success "Firebase CLI is installed"
}

# Check if user is logged in to Firebase
check_firebase_login() {
    if ! firebase projects:list &> /dev/null; then
        print_error "You are not logged in to Firebase. Please login first:"
        echo "firebase login"
        exit 1
    fi
    print_success "Logged in to Firebase"
}

# Check if Firebase project is initialized
check_firebase_init() {
    if [ ! -f "firebase.json" ]; then
        print_warning "Firebase project not initialized. Running firebase init..."
        firebase init --yes
    fi
    print_success "Firebase project is initialized"
}

# Build the project (if needed)
build_project() {
    print_status "Building project..."
    # This is a static project, so no build step is needed
    print_success "Project is ready for deployment"
}

# Deploy to Firebase
deploy_to_firebase() {
    print_status "Deploying to Firebase..."
    
    # Deploy hosting
    print_status "Deploying hosting..."
    firebase deploy --only hosting
    
    # Deploy Firestore rules
    print_status "Deploying Firestore rules..."
    firebase deploy --only firestore:rules
    
    # Deploy Storage rules
    print_status "Deploying Storage rules..."
    firebase deploy --only storage
    
    print_success "Deployment completed successfully!"
}

# Show deployment URL
show_deployment_url() {
    print_status "Getting deployment URL..."
    PROJECT_ID=$(firebase use --json | grep -o '"current":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$PROJECT_ID" ]; then
        print_success "Your app is deployed at: https://$PROJECT_ID.web.app"
        print_success "Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID"
    else
        print_warning "Could not determine project ID. Check Firebase Console for your deployment URL."
    fi
}

# Main deployment process
main() {
    echo "🎓 Ellerslie School AI Deployment Script"
    echo "========================================"
    
    # Check prerequisites
    check_firebase_cli
    check_firebase_login
    check_firebase_init
    
    # Build and deploy
    build_project
    deploy_to_firebase
    show_deployment_url
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Configure your API keys in the app settings"
    echo "2. Test all AI models"
    echo "3. Set up custom domain (optional)"
    echo "4. Configure monitoring and analytics"
    echo ""
    echo "For support, visit: https://github.com/your-username/ellerslie-school-ai"
}

# Run main function
main "$@"