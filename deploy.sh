#!/bin/bash

echo "🚀 CodeBuddy Extension Deployment Script"
echo "========================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy backend
echo "🌐 Deploying backend to Vercel..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please create one with your GEMINI_API_KEY"
    echo "Example:"
    echo "GEMINI_API_KEY=your_api_key_here"
    echo "MONGODB_URI=mongodb://localhost:27017/codebuddy"
    exit 1
fi

# Deploy to Vercel
vercel --prod

# Get the deployment URL
BACKEND_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
echo "✅ Backend deployed to: $BACKEND_URL"

cd ..

# Update extension with production URL
echo "🔧 Updating extension with production backend URL..."
sed -i '' "s|http://localhost:3000|$BACKEND_URL|g" chrome-extension/background.js

# Create extension package
echo "📦 Creating extension package..."
cd chrome-extension
zip -r ../codebuddy-extension.zip . -x "*.DS_Store" "*.git*"
cd ..

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Upload codebuddy-extension.zip to Chrome Web Store"
echo "2. Update your GitHub repository with the new backend URL"
echo "3. Share your extension with the world!" 