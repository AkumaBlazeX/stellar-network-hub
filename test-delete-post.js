import fetch from 'node-fetch';

const API_BASE_URL = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

async function testDeletePost() {
  try {
    console.log('🧪 Testing delete post functionality...');
    
    // First, create a test post
    console.log('📝 Creating a test post...');
    const createResponse = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorId: 'test-user-123',
        content: 'This is a test post that will be deleted',
        authorName: 'Test User',
        authorPicture: '',
      }),
    });
    
    const createResult = await createResponse.json();
    console.log('✅ Test post created:', createResult);
    
    if (!createResult.postId) {
      console.error('❌ Failed to create test post');
      return;
    }
    
    const postId = createResult.postId;
    
    // Wait a moment for the post to be fully created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Now delete the post
    console.log('🗑️ Deleting the test post...');
    const deleteResponse = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postId,
        userId: 'test-user-123',
      }),
    });
    
    const deleteResult = await deleteResponse.json();
    console.log('🗑️ Delete response:', deleteResult);
    
    if (deleteResponse.ok) {
      console.log('✅ Post deleted successfully!');
    } else {
      console.error('❌ Failed to delete post:', deleteResult);
    }
    
    // Verify the post is deleted by trying to get it
    console.log('🔍 Verifying post is deleted...');
    const getResponse = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const getResult = await getResponse.json();
    
    if (getResponse.status === 404) {
      console.log('✅ Post successfully deleted and not found');
    } else {
      console.log('⚠️ Post might still exist:', getResult);
    }
    
  } catch (error) {
    console.error('❌ Error testing delete functionality:', error);
  }
}

testDeletePost(); 