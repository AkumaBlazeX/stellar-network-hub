const createPost = require('./createPost');
const getPosts = require('./getPosts');
const likePost = require('./likePost');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path || event.rawPath || '';
    
    try {
        // Route based on HTTP method and path
        if (httpMethod === 'POST' && path === '/posts') {
            return await createPost.handler(event);
        } else if (httpMethod === 'GET' && path === '/posts') {
            return await getPosts.handler(event);
        } else if (httpMethod === 'POST' && path.includes('/posts/') && path.includes('/like')) {
            return await likePost.handler(event);
        } else {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Endpoint not found' })
            };
        }
    } catch (error) {
        console.error('Error in posts API:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 