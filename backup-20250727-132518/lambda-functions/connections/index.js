const createConnection = require('./createConnection');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path || event.rawPath || '';
    
    console.log('Connections API - HTTP Method:', httpMethod);
    console.log('Connections API - Path:', path);
    console.log('Connections API - Raw Path:', event.rawPath);
    console.log('Connections API - Resource:', event.resource);
    console.log('Connections API - Full Event:', JSON.stringify(event, null, 2));
    
    try {
        // Route based on HTTP method and path
        if (httpMethod === 'POST' && (path === '/connections' || path.includes('/connections'))) {
            console.log('Routing to createConnection handler');
            return await createConnection.handler(event);
        } else {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Endpoint not found' })
            };
        }
    } catch (error) {
        console.error('Error in connections API:', error);
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