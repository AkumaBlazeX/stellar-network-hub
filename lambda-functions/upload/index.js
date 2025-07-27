const uploadFile = require('./uploadFile');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path || event.rawPath || '';
    
    console.log('Upload API - HTTP Method:', httpMethod);
    console.log('Upload API - Path:', path);
    console.log('Upload API - Raw Path:', event.rawPath);
    console.log('Upload API - Resource:', event.resource);
    console.log('Upload API - Full Event:', JSON.stringify(event, null, 2));
    
    try {
        // Route based on HTTP method and path
        if (httpMethod === 'POST' && path.includes('upload')) {
            console.log('Routing to uploadFile handler');
            return await uploadFile.handler(event);
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
        console.error('Error in upload API:', error);
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