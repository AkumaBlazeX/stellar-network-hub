const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        console.log('=== updatePost handler started ===');
        console.log('Event received:', JSON.stringify(event, null, 2));
        
        // Get post ID from path parameters
        const postId = event.pathParameters?.postId;
        
        if (!postId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                body: JSON.stringify({ error: 'Post ID is required' })
            };
        }

        // Parse request body
        const updateData = JSON.parse(event.body || '{}');
        console.log('Update data:', updateData);
        
        // Validate required fields
        if (!updateData.content) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                body: JSON.stringify({ error: 'Content is required' })
            };
        }

        // First, check if post exists and get current data
        const getParams = {
            TableName: 'professionalnet-posts',
            Key: { postId: postId }
        };

        const existingPost = await dynamodb.send(new GetCommand(getParams));
        
        if (!existingPost.Item) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                body: JSON.stringify({ error: 'Post not found' })
            };
        }

        // Build update expression
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        // Update content
        updateExpression.push('#content = :content');
        expressionAttributeNames['#content'] = 'content';
        expressionAttributeValues[':content'] = updateData.content;

        // Update image if provided
        if (updateData.imageUrl !== undefined) {
            updateExpression.push('#imageUrl = :imageUrl');
            expressionAttributeNames['#imageUrl'] = 'imageUrl';
            expressionAttributeValues[':imageUrl'] = updateData.imageUrl;
        }

        // Add updated timestamp
        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        const params = {
            TableName: 'professionalnet-posts',
            Key: { postId: postId },
            UpdateExpression: 'SET ' + updateExpression.join(', '),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        console.log('DynamoDB update params:', JSON.stringify(params, null, 2));

        const result = await dynamodb.send(new UpdateCommand(params));
        
        console.log('Post updated successfully:', result.Attributes);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            body: JSON.stringify(result.Attributes)
        };

    } catch (error) {
        console.error('=== ERROR in updatePost handler ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};