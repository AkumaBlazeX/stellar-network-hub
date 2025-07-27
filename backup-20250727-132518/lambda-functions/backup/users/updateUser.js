const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    try {
        console.log('updateUser handler - Event:', JSON.stringify(event, null, 2));
        
        // Get user ID from path parameters
        const userId = event.pathParameters?.userId;
        
        console.log('updateUser handler - User ID:', userId);
        
        if (!userId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // Parse request body
        const updateData = JSON.parse(event.body || '{}');
        console.log('updateUser handler - Update Data:', updateData);
        
        // Handle field name mapping (name -> fullName)
        if (updateData.name && !updateData.fullName) {
            updateData.fullName = updateData.name;
            delete updateData.name;
        }
        
        // Validate required fields
        if (!updateData.fullName && !updateData.bio && !updateData.location && !updateData.website) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'PUT,OPTIONS'
                },
                body: JSON.stringify({ error: 'At least one field to update is required' })
            };
        }

        // Build update expression
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                updateExpression.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = updateData[key];
            }
        });

        // Add updated timestamp
        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        const params = {
            TableName: 'professionalnet-users',
            Key: { userId: userId },
            UpdateExpression: 'SET ' + updateExpression.join(', '),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        console.log('updateUser handler - DynamoDB params:', JSON.stringify(params, null, 2));

        const result = await dynamodb.send(new UpdateCommand(params));
        
        // Remove sensitive data before returning
        const updatedUser = result.Attributes;
        delete updatedUser.password; // If stored
        delete updatedUser.refreshToken; // If stored

        console.log('updateUser handler - Success, returning:', updatedUser);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            body: JSON.stringify(updatedUser)
        };

    } catch (error) {
        console.error('Error updating user:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'PUT,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 