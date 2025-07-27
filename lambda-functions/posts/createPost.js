const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        console.log('=== createPost handler started ===');
        console.log('Event received:', JSON.stringify(event, null, 2));
        
        // Parse request body
        console.log('Raw event.body:', event.body);
        const postData = JSON.parse(event.body || '{}');
        console.log('Parsed postData:', postData);
        
        // Validate required fields
        console.log('Validating fields - content:', postData.content, 'authorId:', postData.authorId);
        if (!postData.content || !postData.authorId) {
            console.log('Validation failed - missing required fields');
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

        console.log('Validation passed, generating post ID');
        // Generate unique post ID
        const postId = uuidv4();
        const timestamp = new Date().toISOString();
        console.log('Generated postId:', postId, 'timestamp:', timestamp);

        // Create post object
        const post = {
            postId: postId,  // Changed from 'postid' to 'postId' (camelCase)
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

        console.log('Created post object:', JSON.stringify(post, null, 2));

        // Save to DynamoDB - POSTS TABLE
        const postParams = {
            TableName: 'professionalnet-posts',
            Item: post
        };

        console.log('DynamoDB POSTS params:', JSON.stringify(postParams, null, 2));
        console.log('Saving post to DynamoDB...');
        
        try {
            await dynamodb.send(new PutCommand(postParams));
            console.log('Successfully saved post to DynamoDB');
        } catch (postError) {
            console.error('Error saving post to DynamoDB:', postError);
            throw postError;
        }

        // Update user's post count - USERS TABLE
        console.log('Updating user post count for authorId:', postData.authorId);
        const userUpdateParams = {
            TableName: 'professionalnet-users',
            Key: { id: postData.authorId },
            UpdateExpression: 'SET posts = if_not_exists(posts, :zero) + :inc',
            ExpressionAttributeValues: {
                ':inc': 1,
                ':zero': 0
            }
        };

        console.log('User update params:', JSON.stringify(userUpdateParams, null, 2));
        try {
            await dynamodb.send(new UpdateCommand(userUpdateParams));
            console.log('Successfully updated user post count');
        } catch (userError) {
            console.error('Error updating user post count:', userError);
            // Don't throw here - post was created successfully
            console.log('Continuing despite user update error');
        }

        console.log('=== createPost handler completed successfully ===');
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
        console.error('=== ERROR in createPost handler ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('=== END ERROR ===');
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
}; 