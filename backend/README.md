# CodeBuddy Backend

This is the backend server for the CodeBuddy Chrome extension that provides AI-powered hints for LeetCode problems.

## 🚀 Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the setup script:**
   ```bash
   npm run setup
   ```

3. **Configure environment variables:**
   - Edit the `.env` file created by the setup script
   - Add your Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

4. **Start the server:**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/codebuddy

# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Required Services

1. **MongoDB**: 
   - Local installation: `mongodb://localhost:27017/codebuddy`
   - Or use MongoDB Atlas (cloud): Update `MONGODB_URI` in `.env`

2. **Gemini API Key**:
   - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add to `.env` file

## 📡 API Endpoints

### POST `/api/hints`

Generates AI-powered hints for LeetCode problems.

**Request Body:**
```json
{
  "title": "Two Sum",
  "description": "Given an array of integers nums and an integer target..."
}
```

**Response:**
```json
{
  "hints": "Concepts:\n- Hash Map\n- Two Pointers\n\nHints:\n1. Consider using a hash map to store visited numbers..."
}
```

## 🛠️ Development

- **Development mode:** `npm run dev` (uses nodemon for auto-restart)
- **Production:** `npm start`

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined (reading 'title')"**
   - Make sure you're on a LeetCode problem page
   - Check that the content script is properly injected

2. **"Failed to load resource: net::ERR_TIMED_OUT"**
   - Ensure the backend server is running on port 3000
   - Check firewall settings
   - Verify the backend URL in `chrome-extension/background.js`

3. **"Attempting to use a disconnected port object"**
   - This is usually a Chrome extension messaging issue
   - Try refreshing the LeetCode page
   - Check that the extension is properly loaded

4. **"API key not configured"**
   - Make sure `GEMINI_API_KEY` is set in your `.env` file
   - Verify the API key is valid

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## 📝 License

This project is open source and available under the MIT License. 