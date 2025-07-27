import fetch from 'node-fetch';

// Test different API Gateway stages
async function testStages() {
  const stages = ['Dev', 'Prod', 'Stage', 'Test'];
  const baseUrl = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com';
  
  console.log('🧪 Testing different API Gateway stages...\n');
  
  for (const stage of stages) {
    const url = `${baseUrl}/${stage}/upload`;
    console.log(`📡 Testing stage: ${stage}`);
    console.log(`🌐 URL: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`🎉 Stage ${stage} is working!`);
        
        // Test actual upload
        const testData = {
          fileName: 'test-image.jpg',
          fileType: 'image/jpeg',
          fileContent: Buffer.from('file-content-test').toString('base64'),
          userId: 'test-user-123',
        };
        
        const uploadResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        });
        
        console.log(`📤 Upload test status: ${uploadResponse.status}`);
        
        if (uploadResponse.ok) {
          const result = await uploadResponse.json();
          console.log(`✅ Upload successful:`, result);
          console.log(`🔗 Use this URL in your env.local: ${baseUrl}/${stage}`);
          break;
        } else {
          const errorText = await uploadResponse.text();
          console.log(`❌ Upload failed: ${errorText}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
}

testStages(); 