const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        // Parse request body
        const { followerId, followingId, action } = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!followerId || !followingId || !action) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'followerId, followingId, and action are required' })
            };
        }

        if (!['follow', 'unfollow'].includes(action)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Action must be "follow" or "unfollow"' })
            };
        }

        // Prevent self-following
        if (followerId === followingId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Cannot follow yourself' })
            };
        }

        // Check if connection already exists
        const connectionParams = {
            TableName: 'professionalnet-connections',
            Key: {
                id: `${followerId}-${followingId}`,
                type: 'follow'
            }
        };

        const existingConnection = await dynamodb.send(new GetCommand(connectionParams));
        const alreadyFollowing = !!existingConnection.Item;

        // Handle follow/unfollow logic
        if (action === 'follow' && alreadyFollowing) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Already following this user' })
            };
        }

        if (action === 'unfollow' && !alreadyFollowing) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Not following this user' })
            };
        }

        // Update follower's following count
        const followerUpdateExpression = action === 'follow' ? 
            'SET connections = if_not_exists(connections, :zero) + :inc' : 
            'SET connections = if_not_exists(connections, :zero) - :dec';

        const followerExpressionValues = action === 'follow' ? 
            { ':inc': 1, ':zero': 0 } : 
            { ':dec': 1, ':zero': 0 };

        const followerUpdateParams = {
            TableName: 'professionalnet-users',
            Key: { userId: followerId },
            UpdateExpression: followerUpdateExpression,
            ExpressionAttributeValues: followerExpressionValues
        };

        await dynamodb.send(new UpdateCommand(followerUpdateParams));

        // Create or delete connection
        if (action === 'follow') {
            const connection = {
                id: `${followerId}-${followingId}`,
                type: 'follow',
                followerId: followerId,
                followingId: followingId,
                createdAt: new Date().toISOString()
            };

            await dynamodb.send(new PutCommand({
                TableName: 'professionalnet-connections',
                Item: connection
            }));
        } else {
            await dynamodb.send(new DeleteCommand({
                TableName: 'professionalnet-connections',
                Key: {
                    id: `${followerId}-${followingId}`,
                    type: 'follow'
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
                message: `Successfully ${action}ed user`,
                following: action === 'follow'
            })
        };

    } catch (error) {
        console.error('Error creating connection:', error);
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