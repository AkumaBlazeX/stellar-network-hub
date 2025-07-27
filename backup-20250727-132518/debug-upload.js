import fetch from 'node-fetch';

// Test the upload API directly
async function testUpload() {
  const API_BASE_URL = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';
  
  console.log('🧪 Testing upload API...');
  console.log('🌐 API Base URL:', API_BASE_URL);
  
  try {
    // Test 1: Check if API endpoint is reachable
    console.log('\n📡 Test 1: Checking API endpoint...');
    const optionsResponse = await fetch(`${API_BASE_URL}/upload`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ OPTIONS response:', optionsResponse.status, optionsResponse.statusText);
    
    // Test 2: Try actual upload
    console.log('\n📤 Test 2: Testing actual upload...');
    const testData = {
      fileName: 'test-image.jpg',
      fileType: 'image/jpeg',
      fileContent: Buffer.from('file-content-test').toString('base64'),
      userId: 'test-user-123',
    };
    
    console.log('📦 Test data:', {
      fileName: testData.fileName,
      fileType: testData.fileType,
      userId: testData.userId,
      fileContentLength: testData.fileContent.length
    });
    
    const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📊 Upload response status:', uploadResponse.status);
    console.log('📊 Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()));
    
    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      console.log('✅ Upload successful!');
      console.log('📄 Response:', JSON.stringify(result, null, 2));
      
      if (result.fileUrl) {
        console.log('🔗 File URL:', result.fileUrl);
        
        // Test 3: Check if file is accessible
        console.log('\n🔍 Test 3: Checking if file is accessible...');
        try {
          const fileResponse = await fetch(result.fileUrl);
          console.log('📄 File response status:', fileResponse.status);
          console.log('📄 File accessible:', fileResponse.ok);
        } catch (fileError) {
          console.log('❌ File not accessible:', fileError.message);
        }
      }
    } else {
      const errorText = await uploadResponse.text();
      console.log('❌ Upload failed!');
      console.log('📄 Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('🔍 Error details:', error);
  }
}

// Run the test
testUpload(); 