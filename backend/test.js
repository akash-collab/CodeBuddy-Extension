async function testBackend() {
  console.log('🧪 Testing CodeBuddy Backend API...\n');

  const testData = {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order."
  };

  try {
    console.log('📡 Making request to backend...');
    const response = await fetch('http://localhost:3000/api/hints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Success! Received hints:');
    console.log('📝 Hints preview:', data.hints.substring(0, 200) + '...');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running (npm start)');
    console.log('2. Check that port 3000 is available');
    console.log('3. Verify your .env file has GEMINI_API_KEY configured');
  }
}

// Run the test
testBackend(); 