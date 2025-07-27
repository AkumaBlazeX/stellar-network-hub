import fetch from 'node-fetch';

const API_BASE_URL = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

async function testDeleteWithRealPost() {
  try {
    console.log('🧪 Testing delete functionality with real post...');
    
    // Step 1: Get existing posts
    console.log('📝 Getting existing posts...');
    const getResponse = await fetch(`${API_BASE_URL}/posts`);
    const getResult = await getResponse.json();
    
    console.log('📋 Available posts:', getResult);
    
    if (!getResult.posts || getResult.posts.length === 0) {
      console.log('❌ No posts found. Creating a test post first...');
      
      // Create a test post
      const createResponse = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId: 'test-user-123',
          content: 'This is a test post for deletion',
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
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Now get posts again
      const getResponse2 = await fetch(`${API_BASE_URL}/posts`);
      const getResult2 = await getResponse2.json();
      
      if (!getResult2.posts || getResult2.posts.length === 0) {
        console.error('❌ Still no posts found after creation');
        return;
      }
      
      getResult.posts = getResult2.posts;
    }
    
    // Step 2: Select the first post for deletion
    const postToDelete = getResult.posts[0];
    console.log('🗑️ Selected post for deletion:', postToDelete);
    
    // Step 3: Delete the post
    console.log('🗑️ Deleting post...');
    const deleteResponse = await fetch(`${API_BASE_URL}/posts/${postToDelete.postId || postToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        postId: postToDelete.postId || postToDelete.id,
        userId: postToDelete.authorId,
      }),
    });
    
    const deleteResult = await deleteResponse.json();
    console.log('🗑️ Delete response:', deleteResult);
    
    if (deleteResponse.ok) {
      console.log('✅ Post deleted successfully!');
      
      // Step 4: Verify deletion
      console.log('🔍 Verifying post is deleted...');
      const verifyResponse = await fetch(`${API_BASE_URL}/posts`);
      const verifyResult = await verifyResponse.json();
      
      const postStillExists = verifyResult.posts.some(post => 
        (post.postId || post.id) === (postToDelete.postId || postToDelete.id)
      );
      
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

testDeleteWithRealPost(); 