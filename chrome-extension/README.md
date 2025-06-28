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
- `GEMINI_API_KEY` - Your Google Gemini API key
- `PORT=3000` - Server port (default: 3000)

## 🎨 UI Features

### **Header**
- Beautiful gradient background
- CodeBuddy logo and branding
- Clean, modern typography

### **Problem Section**
- Shows the extracted problem title
- Loading animation during extraction
- Hover effects for better UX

### **Hints Section**
- Scrollable content area
- Structured display of concepts, hints, and encouragement
- Color-coded sections for easy reading
- Custom scrollbar styling

### **Actions**
- Primary "Get Hints" button with loading states
- Secondary "Clear History" button (appears after first use)
- Hover animations and disabled states

### **Status Bar**
- Real-time status updates
- Page detection (LeetCode vs other sites)
- Timestamp information for saved hints

## 🔒 Privacy & Security

- **No data collection**: Hints are stored locally in your browser
- **No tracking**: Extension doesn't send any personal data
- **Secure**: Only communicates with your local backend server
- **Transparent**: All code is open source and inspectable

## 🛠️ Technical Details

### **Architecture**
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express, MongoDB
- **AI**: Google Gemini API
- **Storage**: Chrome Storage API

### **File Structure**
```
chrome-extension/
├── popup.html          # Main UI
├── popup.js           # UI logic and storage
├── background.js      # Message handling
├── content.js         # Page extraction
├── styles.css         # Modern styling
├── manifest.json      # Extension config
└── icons/            # Extension icons
```

### **Key Features**
- **Content Script**: Extracts problem data from LeetCode pages
- **Background Script**: Handles communication between popup and content
- **Storage API**: Saves and restores hint data
- **Message Passing**: Secure communication between extension parts

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