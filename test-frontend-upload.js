import fetch from 'node-fetch';

const API_BASE_URL = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

// Simulate frontend upload process
async function testFrontendUpload() {
  console.log('🧪 Testing frontend upload simulation...\n');
  
  try {
    // Simulate file data (like frontend would send)
    const testFileData = {
      fileName: 'test-frontend-image.jpg',
      fileType: 'image/jpeg',
      fileContent: Buffer.from('frontend-test-image-content').toString('base64'),
      userId: 'frontend-test-user-456'
    };
    
    console.log('📤 Sending frontend-style upload request...');
    console.log('📦 File data:', {
      fileName: testFileData.fileName,
      fileType: testFileData.fileType,
      userId: testFileData.userId,
      fileContentLength: testFileData.fileContent.length
    });
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFileData),
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('📄 Response:', result);
      
      // Test if the file URL is accessible
      console.log('\n🔍 Testing file accessibility...');
      try {
        const fileResponse = await fetch(result.fileUrl);
        console.log('📄 File response status:', fileResponse.status);
        console.log('📄 File accessible:', fileResponse.ok);
      } catch (fileError) {
        console.log('❌ File access error:', fileError.message);
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Upload failed:');
      console.log('📄 Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendUpload(); 