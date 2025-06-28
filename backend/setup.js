const fs = require('fs');
const path = require('path');

console.log('🚀 CodeBuddy Backend Setup');
console.log('==========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/codebuddy

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
  console.log('⚠️  Please edit .env file and add your Gemini API key');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Get a Gemini API key from: https://makersuite.google.com/app/apikey');
console.log('2. Edit the .env file and replace "your_gemini_api_key_here" with your actual API key');
console.log('3. Make sure MongoDB is running locally (or update MONGODB_URI for cloud database)');
console.log('4. Run: npm install');
console.log('5. Run: npm start');
console.log('\n�� Setup complete!'); 