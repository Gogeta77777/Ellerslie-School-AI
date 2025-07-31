# 🚀 Deployment Guide - Ellerslie School AI

## 🔥 **Firebase Studio / Console Access**

### **Access Your App Dashboard:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ellerslie-school-ai`
3. Navigate to **Hosting** in the left sidebar
4. View your deployed site: `https://ellerslie-school-ai.web.app/`

### **Firebase Console Features:**
- **Hosting Dashboard** - View deployment history
- **Analytics** - Track user engagement
- **Authentication** - Manage user accounts
- **Firestore** - View database data
- **Storage** - Manage uploaded files

## 🚀 **Easy Update Methods**

### **Method 1: One-Command Update (Recommended)**
```bash
# Run this single command to update your app
npm run deploy:quick
```

### **Method 2: Using Package Scripts**
```bash
# Deploy everything
npm run deploy

# Deploy only hosting (HTML/CSS/JS)
npm run deploy:hosting

# Deploy only database rules
npm run deploy:rules

# Check deployment status
npm run status
```

### **Method 3: Direct Firebase Commands**
```bash
# Deploy all changes
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only rules
firebase deploy --only firestore:rules,storage
```

## 🔄 **Automatic Updates (GitHub Actions)**

### **Setup Automatic Deployment:**
1. **Get Firebase Token:**
   ```bash
   firebase login:ci
   ```
   Copy the token that appears.

2. **Add Token to GitHub:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add new secret: `FIREBASE_TOKEN`
   - Paste the token from step 1

3. **Push Changes:**
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```
   Your app will automatically deploy!

## 📱 **Update Your App - Step by Step**

### **Step 1: Make Changes**
Edit any files in your project:
- `index.html` - Main page
- `styles.css` - Styling
- `js/*.js` - JavaScript functionality

### **Step 2: Deploy Updates**
Choose one method:

**Option A: Quick Deploy**
```bash
npm run deploy:quick
```

**Option B: Full Deploy**
```bash
npm run deploy
```

**Option C: Manual Deploy**
```bash
firebase deploy
```

### **Step 3: Verify Update**
- Visit: `https://ellerslie-school-ai.web.app/`
- Hard refresh (Ctrl+F5) to clear cache
- Test your changes

## 🛠 **Troubleshooting**

### **If deployment fails:**
```bash
# Check Firebase login
firebase login

# Check project selection
firebase use

# List projects
firebase projects:list
```

### **If changes don't appear:**
1. **Clear browser cache** (Ctrl+F5)
2. **Check Firebase Console** for deployment status
3. **Wait 1-2 minutes** for propagation
4. **Check for errors** in terminal output

### **If you get permission errors:**
```bash
# Re-login to Firebase
firebase logout
firebase login
```

## 📊 **Monitoring Your App**

### **Firebase Console Dashboard:**
- **Hosting** → View deployment history
- **Analytics** → Track user engagement
- **Authentication** → Manage users
- **Firestore** → View database
- **Storage** → Manage files

### **Deployment Status:**
```bash
# Check recent deployments
npm run status

# View deployment history
firebase hosting:releases:list
```

## 🔧 **Common Update Scenarios**

### **Update HTML/CSS/JavaScript:**
```bash
# Edit files, then deploy
npm run deploy:hosting
```

### **Update Database Rules:**
```bash
# Edit firestore.rules, then deploy
npm run deploy:rules
```

### **Update Everything:**
```bash
# Deploy all changes
npm run deploy
```

## 🎯 **Quick Commands Reference**

| Command | What it does |
|---------|-------------|
| `npm run deploy:quick` | One-command deployment |
| `npm run deploy` | Deploy everything |
| `npm run deploy:hosting` | Deploy only web files |
| `npm run status` | Check deployment status |
| `firebase serve` | Test locally |
| `firebase login` | Login to Firebase |

## 🌐 **Your App URLs**

- **Live App:** https://ellerslie-school-ai.web.app/
- **Firebase Console:** https://console.firebase.google.com/project/ellerslie-school-ai
- **GitHub Repository:** (Your repo URL)

## 🚨 **Important Notes**

- **Deployments are immediate** - changes appear within 1-2 minutes
- **Cache clearing** might be needed (Ctrl+F5)
- **Firebase login** is required for deployment
- **GitHub Actions** provide automatic deployment on push

## 📞 **Need Help?**

1. **Check Firebase Console** for deployment status
2. **Run `npm run status`** to see recent deployments
3. **Clear browser cache** if changes don't appear
4. **Check terminal output** for error messages

---

**🎉 Your app is now ready for easy updates!**