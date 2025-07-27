const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        console.log('🚀 getPosts Lambda function started');
        
        // Get query parameters
        const queryParams = event.queryStringParameters || {};
        const limit = parseInt(queryParams.limit) || 20;
        const lastEvaluatedKey = queryParams.lastEvaluatedKey ? JSON.parse(decodeURIComponent(queryParams.lastEvaluatedKey)) : null;
        const authorId = queryParams.authorId;
        const tag = queryParams.tag;

        console.log('📋 Query parameters:', { limit, authorId, tag });

        // Try to query DynamoDB
        try {
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

            console.log('🔍 Scanning DynamoDB with params:', params);

            // Query DynamoDB
            const result = await dynamodb.send(new ScanCommand(params));

            console.log('✅ DynamoDB scan successful, found items:', result.Items?.length || 0);

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

        } catch (dynamoError) {
            console.error('❌ DynamoDB error:', dynamoError);
            
            // Return fallback data if DynamoDB fails
            console.log('🔄 Returning fallback data');
            const fallbackPosts = [
                {
                    postId: 'test-1',  // Changed from 'postid' to 'postId'
                    authorId: 'user-123',
                    content: 'This is a test post from Lambda function!',
                    createdAt: new Date().toISOString(),
                    isPublic: true,
                    likes: 5,
                    comments: 2
                },
                {
                    postId: 'test-2',  // Changed from 'postid' to 'postId'
                    authorId: 'user-456',
                    content: 'Another test post to verify Lambda is working!',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    isPublic: true,
                    likes: 3,
                    comments: 1
                }
            ];

            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET,OPTIONS'
                },
                body: JSON.stringify({
                    posts: fallbackPosts,
                    count: fallbackPosts.length,
                    hasMore: false,
                    lastEvaluatedKey: null,
                    message: 'Using fallback data - DynamoDB not accessible'
                })
            };
        }

    } catch (error) {
        console.error('❌ Error in getPosts:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
}; 