const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        // Parse request body
        const { postId, userId, action } = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!postId || !userId || !action) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'postId, userId, and action are required' })
            };
        }

        if (!['like', 'unlike'].includes(action)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Action must be "like" or "unlike"' })
            };
        }

        // Check if user already liked the post
        const connectionParams = {
            TableName: 'professionalnet-connections',
            Key: {
                id: `${postId}-${userId}`,
                type: 'like'
            }
        };

        const existingLike = await dynamodb.send(new GetCommand(connectionParams));
        const alreadyLiked = !!existingLike.Item;

        // Handle like/unlike logic
        if (action === 'like' && alreadyLiked) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Post already liked' })
            };
        }

        if (action === 'unlike' && !alreadyLiked) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Post not liked' })
            };
        }

        // Update post likes count
        const updateExpression = action === 'like' ? 
            'SET likes = if_not_exists(likes, :zero) + :inc' : 
            'SET likes = if_not_exists(likes, :zero) - :dec';

        const expressionValues = action === 'like' ? 
            { ':inc': 1, ':zero': 0 } : 
            { ':dec': 1, ':zero': 0 };

        const postUpdateParams = {
            TableName: 'professionalnet-posts',
            Key: { id: postId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionValues,
            ReturnValues: 'ALL_NEW'
        };

        const updatedPost = await dynamodb.send(new UpdateCommand(postUpdateParams));

        // Create or delete like connection
        if (action === 'like') {
            const likeConnection = {
                id: `${postId}-${userId}`,
                type: 'like',
                postId: postId,
                userId: userId,
                createdAt: new Date().toISOString()
            };

            await dynamodb.send(new PutCommand({
                TableName: 'professionalnet-connections',
                Item: likeConnection
            }));
        } else {
            await dynamodb.send(new DeleteCommand({
                TableName: 'professionalnet-connections',
                Key: {
                    id: `${postId}-${userId}`,
                    type: 'like'
                }
            }));
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({
                message: `Post ${action}d successfully`,
                likes: updatedPost.Attributes.likes,
                liked: action === 'like'
            })
        };

    } catch (error) {
        console.error('Error liking/unliking post:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 