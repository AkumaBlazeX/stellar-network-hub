const getUser = require('./getUser');
const updateUser = require('./updateUser');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path || event.rawPath || '';
    
    console.log('Users API - HTTP Method:', httpMethod);
    console.log('Users API - Path:', path);
    console.log('Users API - Path Parameters:', event.pathParameters);
    console.log('Users API - Body:', event.body);
    
    try {
        // Route based on HTTP method and path
        if (httpMethod === 'GET' && (path.includes('/users/') || path.includes('/users'))) {
            console.log('Routing to getUser handler');
            return await getUser.handler(event);
        } else if (httpMethod === 'PUT' && (path.includes('/users/') || path.includes('/users'))) {
            console.log('Routing to updateUser handler');
            return await updateUser.handler(event);
        } else {
            console.log('No matching route found');
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS'
                },
                body: JSON.stringify({ 
                    error: 'Endpoint not found',
                    debug: {
                        httpMethod,
                        path,
                        pathParameters: event.pathParameters
                    }
                })
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