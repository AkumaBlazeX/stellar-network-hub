import fetch from 'node-fetch';

const API_BASE_URL = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

async function testDeleteSpecificPost() {
  try {
    console.log('🧪 Testing delete with specific post ID...');
    
    // Using a different real post ID that still exists
    const postId = '0d4d2bc7-3f04-4813-8319-c0b2e24be714'; // "Test post with image"
    const authorId = 'test-user'; // The author ID from the same post
    
    console.log('🗑️ Attempting to delete post:', postId);
    console.log('👤 Author ID:', authorId);
    
    const deleteResponse = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
        userId: authorId,
      }),
    });
    
    const deleteResult = await deleteResponse.json();
    console.log('🗑️ Delete response status:', deleteResponse.status);
    console.log('🗑️ Delete response:', deleteResult);
    
    if (deleteResponse.ok) {
      console.log('✅ Post deleted successfully!');
      
      // Verify deletion
      console.log('🔍 Verifying post is deleted...');
      const verifyResponse = await fetch(`${API_BASE_URL}/posts`);
      const verifyResult = await verifyResponse.json();
      
      const postStillExists = verifyResult.posts.some(post => post.postId === postId);
      
      if (!postStillExists) {
        console.log('✅ Post successfully deleted and not found in list');
      } else {
        console.log('⚠️ Post might still exist in the list');
      }
      
    } else {
      console.error('❌ Failed to delete post:', deleteResult);
    }
    
  } catch (error) {
    console.error('❌ Error testing delete functionality:', error);
  }
}

testDeleteSpecificPost(); 