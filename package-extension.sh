#!/bin/bash

# CodeBuddy Extension Packaging Script
echo "🚀 Packaging CodeBuddy Extension for Chrome Web Store..."

# Check if we're in the right directory
if [ ! -d "chrome-extension" ]; then
    echo "❌ Error: chrome-extension directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Navigate to chrome extension directory
cd chrome-extension

# Remove any existing package
if [ -f "codebuddy-extension.zip" ]; then
    echo "🗑️ Removing existing package..."
    rm codebuddy-extension.zip
fi

# Create the package
echo "📦 Creating extension package..."
zip -r codebuddy-extension.zip . \
    -x "*.DS_Store" \
    -x "*.git*" \
    -x "README.md" \
    -x "*.log" \
    -x "node_modules/*" \
    -x ".vscode/*" \
    -x "*.tmp"

# Check if package was created successfully
if [ -f "codebuddy-extension.zip" ]; then
    echo "✅ Package created successfully: codebuddy-extension.zip"
    echo "📊 Package size: $(du -h codebuddy-extension.zip | cut -f1)"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Deploy your backend to production"
    echo "2. Update background.js with your production URL"
    echo "3. Re-run this script to create final package"
    echo "4. Upload to Chrome Web Store"
else
    echo "❌ Failed to create package!"
    exit 1
fi

echo ""
echo "📋 Files included in package:"
unzip -l codebuddy-extension.zip | head -20

echo ""
echo "🎉 Ready for Chrome Web Store submission!" 