const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('🗑️ Delete post event:', JSON.stringify(event, null, 2));
  
  try {
    // Parse the request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      body = event.body;
    }
    
    const { postId, userId } = body;
    
    if (!postId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
        },
        body: JSON.stringify({ error: 'Post ID is required' })
      };
    }
    
    // First, get the post to check if the user is the author
    const getParams = {
      TableName: 'professionalnet-posts',
      Key: {
        postId: postId
      }
    };
    
    console.log('🔍 Getting post for verification:', getParams);
    const getResult = await docClient.send(new GetCommand(getParams));
    
    if (!getResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
        },
        body: JSON.stringify({ error: 'Post not found' })
      };
    }
    
    // Check if the user is the author of the post
    if (getResult.Item.authorId !== userId) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
        },
        body: JSON.stringify({ error: 'You can only delete your own posts' })
      };
    }
    
    // Delete the post
    const deleteParams = {
      TableName: 'professionalnet-posts',
      Key: {
        postId: postId
      }
    };
    
    console.log('🗑️ Deleting post:', deleteParams);
    await docClient.send(new DeleteCommand(deleteParams));
    
    console.log('✅ Post deleted successfully');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({
        message: 'Post deleted successfully',
        deleted: true,
        postId: postId
      })
    };
    
  } catch (error) {
    console.error('❌ Error deleting post:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
}; 