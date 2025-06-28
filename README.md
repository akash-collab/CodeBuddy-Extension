# CodeBuddy - Smart Coding Helper

A Chrome extension that provides AI-powered hints and guidance for LeetCode problems without revealing complete solutions.

## ✨ Features

### 🎯 **Smart Problem Extraction**
- Automatically extracts problem title and description from LeetCode pages
- Works with various LeetCode page layouts
- Robust fallback mechanisms for different page structures

### 🤖 **AI-Powered Hints**
- Uses Google's Gemini AI to generate contextual hints
- Provides key concepts, step-by-step hints, and encouragement
- No complete solutions - only guidance to help you learn

### 💾 **Persistent Storage**
- Saves your last generated hints automatically
- Restores previous hints when you reopen the extension
- Shows when hints were last generated
- Clear history option to start fresh

### 🎨 **Beautiful UI**
- Modern, gradient-based design
- Smooth animations and transitions
- Responsive layout that works on different screen sizes
- Loading states and error handling
- Custom scrollbars and hover effects

## 🚀 Installation

1. **Clone or download** this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the `chrome-extension` folder
5. **Start using** the extension on LeetCode!

## 📖 Usage

1. **Navigate** to any LeetCode problem page (e.g., https://leetcode.com/problems/two-sum/)
2. **Click** the CodeBuddy extension icon in your Chrome toolbar
3. **Click "Get Hints"** to extract the problem and generate AI hints
4. **Review** the generated concepts, hints, and encouragement
5. **Close and reopen** the extension anytime - your hints will be saved!

## 🔧 Setup Requirements

### Backend Server
The extension requires a running backend server with:
- Node.js server on `http://localhost:3000`
- Gemini API integration
- MongoDB for logging (optional)

### Environment Variables
Make sure your backend has:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `MONGODB_URI`: MongoDB connection string (optional)
- `PORT`: Server port (default: 3000)

## 🔍 Troubleshooting

### Common Errors and Solutions

#### ❌ "Cannot read properties of undefined (reading 'title')"
**Cause:** The extension couldn't extract problem data from the page.
**Solutions:**
- Make sure you're on a LeetCode problem page (URL contains `/problems/`)
- Refresh the page and try again
- Check that the extension is properly loaded in Chrome

#### ❌ "Failed to load resource: net::ERR_TIMED_OUT"
**Cause:** The backend server is not running or not accessible.
**Solutions:**
- Start the backend server: `cd backend && npm start`
- Check that port 3000 is not blocked by firewall
- Verify the backend URL in `chrome-extension/background.js`

#### ❌ "Attempting to use a disconnected port object"
**Cause:** Chrome extension messaging issue.
**Solutions:**
- Refresh the LeetCode page
- Reload the extension in Chrome
- Check browser console for additional errors

#### ❌ "API key not configured"
**Cause:** Gemini API key is missing from backend configuration.
**Solutions:**
- Run `cd backend && npm run setup` to create `.env` file
- Add your Gemini API key to the `.env` file
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Backend Setup Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run setup script:**
   ```bash
   npm run setup
   ```

4. **Configure environment:**
   - Edit the created `.env` file
   - Add your Gemini API key
   - Optionally configure MongoDB URI

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Test the API:**
   ```bash
   npm test
   ```

### Extension Setup Steps

1. **Load the extension:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome-extension` folder

2. **Verify installation:**
   - You should see the CodeBuddy icon in your Chrome toolbar
   - Click it to open the popup

3. **Test on LeetCode:**
   - Go to any LeetCode problem page
   - Click the extension icon
   - Click "Get Hints"

## 🛠️ Development

### Backend Development
- **Start development server:** `npm run dev`
- **Run tests:** `npm test`
- **Setup environment:** `npm run setup`

### Extension Development
- **Reload extension:** Go to `chrome://extensions/` and click the refresh icon
- **View console logs:** Right-click extension popup → Inspect

## 📝 Project Structure

```
CodeBuddy-Extension/
├── backend/                 # Node.js backend server
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── chrome-extension/       # Chrome extension files
│   ├── background.js      # Background script
│   ├── content.js         # Content script
│   ├── popup.html         # Extension popup
│   ├── popup.js           # Popup logic
│   ├── manifest.json      # Extension manifest
│   └── styles.css         # Extension styles
└── README.md              # This file
```

## 🎯 Use Cases

- **Learning**: Get guidance without spoiling the solution
- **Practice**: Use hints to improve problem-solving skills
- **Review**: Revisit previous problems and their hints
- **Study**: Understand key concepts and approaches

## 🔄 Updates & Maintenance

The extension automatically:
- Saves your last generated hints
- Restores data when reopened
- Handles errors gracefully
- Provides user feedback

## 📝 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🚀** 