const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        // Parse request body
        const postData = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!postData.content || !postData.authorId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Content and authorId are required' })
            };
        }

        // Generate unique post ID
        const postId = uuidv4();
        const timestamp = new Date().toISOString();

        // Create post object
        const post = {
            id: postId,
            content: postData.content,
            authorId: postData.authorId,
            authorName: postData.authorName || 'Anonymous',
            authorPicture: postData.authorPicture || '',
            imageUrl: postData.imageUrl || null,
            likes: 0,
            comments: 0,
            createdAt: timestamp,
            updatedAt: timestamp,
            tags: postData.tags || [],
            isPublic: postData.isPublic !== false // Default to true
        };

        // Save to DynamoDB
        const params = {
            TableName: 'professionalnet-posts',
            Item: post
        };

        await dynamodb.send(new PutCommand(params));

        // Update user's post count
        const userUpdateParams = {
            TableName: 'professionalnet-users',
            Key: { id: postData.authorId },
            UpdateExpression: 'SET posts = if_not_exists(posts, :zero) + :inc',
            ExpressionAttributeValues: {
                ':inc': 1,
                ':zero': 0
            }
        };

        await dynamodb.send(new UpdateCommand(userUpdateParams));

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify(post)
        };

    } catch (error) {
        console.error('Error creating post:', error);
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