# 🚀 CodeBuddy Extension Deployment Guide

## 📋 **Pre-Publication Checklist**

### **1. Backend Deployment**
Before publishing the extension, you need to deploy your backend server:

#### **Option A: Deploy to Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd backend
vercel

# Get your production URL (e.g., https://codebuddy-backend.vercel.app)
```

#### **Option B: Deploy to Heroku**
```bash
# Create Heroku app
heroku create codebuddy-backend

# Add environment variables
heroku config:set GEMINI_API_KEY=your_gemini_api_key
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

#### **Option C: Deploy to Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **2. Update Extension Configuration**
After deploying your backend, update the extension:

1. **Update `chrome-extension/background.js`:**
   ```javascript
   const backendUrl = "https://your-actual-backend-url.com/api/hints";
   ```

2. **Update `chrome-extension/manifest.json`:**
   ```json
   "homepage_url": "https://github.com/your-actual-username/codebuddy-extension"
   ```

### **3. Create Extension Package**
```bash
# Create a ZIP file of your extension
cd chrome-extension
zip -r codebuddy-extension.zip . -x "*.DS_Store" "*.git*"
```

## 🏪 **Chrome Web Store Publishing**

### **Step 1: Create Developer Account**
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay the **$5 one-time registration fee**
3. Complete your developer profile

### **Step 2: Upload Extension**
1. Click **"Add new item"**
2. Upload your `codebuddy-extension.zip` file
3. Fill in the required information:

#### **Store Listing Information:**
- **Extension name**: `CodeBuddy - AI Coding Helper`
- **Short description**: `AI-powered hints for LeetCode problems`
- **Detailed description**: 
```
Get intelligent hints and guidance for LeetCode problems without spoiling solutions!

🎯 Features:
• Smart problem extraction from LeetCode pages
• AI-powered hints using Google's Gemini
• Key concepts and step-by-step guidance
• Persistent storage of your hints
• Beautiful, modern UI

Perfect for:
• Learning algorithms and data structures
• Improving problem-solving skills
• Getting guidance without complete solutions
• Reviewing previous problems and hints

🔒 Privacy-focused: All data stored locally in your browser.
```

#### **Graphics:**
- **Icon**: Upload your `icon128.png`
- **Screenshots**: Take screenshots of your extension in action
- **Promotional images**: Create promotional graphics

#### **Privacy Policy:**
Create a simple privacy policy (required for extensions with storage permission):

```html
<!-- privacy-policy.html -->
<h1>CodeBuddy Privacy Policy</h1>
<p>CodeBuddy respects your privacy:</p>
<ul>
<li>No personal data is collected or stored</li>
<li>Hints are stored locally in your browser</li>
<li>No tracking or analytics</li>
<li>Only communicates with your local backend server</li>
</ul>
```

### **Step 3: Submit for Review**
1. Complete all required fields
2. Set **visibility** to "Public" or "Unlisted"
3. Click **"Submit for review"**
4. Wait 1-3 business days for Google's review

## 🔧 **Production Backend Setup**

### **Environment Variables**
Make sure your production backend has:
```bash
GEMINI_API_KEY=your_production_gemini_key
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
```

### **CORS Configuration**
Update your backend CORS settings:
```javascript
app.use(cors({
  origin: ["https://chrome.google.com", "chrome-extension://*"],
  credentials: true
}));
```

### **Rate Limiting**
Add rate limiting to prevent abuse:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/hints', limiter);
```

## 📊 **Post-Publication**

### **Monitor Performance**
- Track extension usage
- Monitor backend performance
- Check for errors in Chrome Web Store reviews

### **Update Extension**
To update your published extension:
1. Increment version in `manifest.json`
2. Create new ZIP file
3. Upload to Chrome Web Store
4. Submit for review

### **Marketing**
- Share on social media
- Post on Reddit (r/chrome, r/leetcode)
- Write blog posts
- Create demo videos

## 🛡️ **Security Considerations**

### **API Key Security**
- Use environment variables
- Implement rate limiting
- Monitor for abuse
- Rotate keys regularly

### **Extension Security**
- Validate all inputs
- Sanitize HTML output
- Use HTTPS for all communications
- Regular security audits

## 💰 **Monetization Options**

### **Free Tier**
- Basic hints (3 per day)
- Limited concepts

### **Premium Features**
- Unlimited hints
- Advanced concepts
- Problem history
- Export functionality

## 📞 **Support**

### **User Support**
- Create a support email
- Set up FAQ page
- Monitor Chrome Web Store reviews
- Provide documentation

### **Technical Support**
- Monitor backend logs
- Set up error tracking (Sentry)
- Create status page
- Regular maintenance

---

## 🎯 **Quick Start Checklist**

- [ ] Deploy backend to production
- [ ] Update extension with production URL
- [ ] Create extension ZIP file
- [ ] Pay Chrome Web Store fee
- [ ] Upload and configure listing
- [ ] Submit for review
- [ ] Monitor and respond to feedback

**Good luck with your extension! 🚀** 