const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        // Get query parameters
        const queryParams = event.queryStringParameters || {};
        const limit = parseInt(queryParams.limit) || 20;
        const lastEvaluatedKey = queryParams.lastEvaluatedKey ? JSON.parse(decodeURIComponent(queryParams.lastEvaluatedKey)) : null;
        const authorId = queryParams.authorId;
        const tag = queryParams.tag;

        // Build query parameters
        let params = {
            TableName: 'professionalnet-posts',
            Limit: limit,
            ScanIndexForward: false, // Most recent first
            FilterExpression: 'isPublic = :isPublic',
            ExpressionAttributeValues: {
                ':isPublic': true
            }
        };

        // Add author filter if specified
        if (authorId) {
            params.FilterExpression += ' AND authorId = :authorId';
            params.ExpressionAttributeValues[':authorId'] = authorId;
        }

        // Add tag filter if specified
        if (tag) {
            params.FilterExpression += ' AND contains(tags, :tag)';
            params.ExpressionAttributeValues[':tag'] = tag;
        }

        // Add pagination key if provided
        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }

        // Query DynamoDB
        const result = await dynamodb.send(new ScanCommand(params));

        // Sort by creation date (most recent first)
        const posts = result.Items.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Prepare response
        const response = {
            posts: posts,
            count: posts.length,
            hasMore: !!result.LastEvaluatedKey,
            lastEvaluatedKey: result.LastEvaluatedKey ? 
                encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Error getting posts:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 