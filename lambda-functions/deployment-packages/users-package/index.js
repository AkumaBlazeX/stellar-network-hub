const getUser = require('./getUser');
const updateUser = require('./updateUser');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path || event.rawPath || '';
    
    try {
        // Route based on HTTP method and path
        if (httpMethod === 'GET' && path.includes('/users/')) {
            return await getUser.handler(event);
        } else if (httpMethod === 'PUT' && path.includes('/users/')) {
            return await updateUser.handler(event);
        } else {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
                },
                body: JSON.stringify({ error: 'Endpoint not found' })
            };
        }
    } catch (error) {
        console.error('Error in users API:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 