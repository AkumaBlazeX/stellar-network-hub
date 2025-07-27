const createPost = require('./createPost');
const getPosts = require('./getPosts');
const likePost = require('./likePost');
const updatePost = require('./updatePost');
const deletePost = require('./deletePost');

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path || event.rawPath || '';
    
    console.log('Posts API - HTTP Method:', httpMethod);
    console.log('Posts API - Path:', path);
    console.log('Posts API - Raw Path:', event.rawPath);
    console.log('Posts API - Resource:', event.resource);
    console.log('Posts API - Full Event:', JSON.stringify(event, null, 2));
    
    try {
        // Route based on HTTP method and path
        if (httpMethod === 'POST' && (path === '/posts' || path === '/Dev/posts' || path.includes('/posts')) && !path.includes('/like')) {
            console.log('Routing to createPost handler');
            return await createPost.handler(event);
        } else if (httpMethod === 'GET' && (path === '/posts' || path === '/Dev/posts' || path.includes('/posts'))) {
            console.log('Routing to getPosts handler');
            return await getPosts.handler(event);
        } else if (httpMethod === 'PUT' && (path.includes('/posts/') || path.includes('/Dev/posts/')) && !path.includes('/like')) {
            console.log('Routing to updatePost handler');
            return await updatePost.handler(event);
        } else if (httpMethod === 'POST' && (path.includes('/posts/') || path.includes('/Dev/posts/')) && path.includes('/like')) {
            console.log('Routing to likePost handler');
            return await likePost.handler(event);
        } else if (httpMethod === 'DELETE' && (path.includes('/posts/') || path.includes('/Dev/posts/'))) {
            console.log('Routing to deletePost handler');
            return await deletePost.handler(event);
        } else {
            console.log('No matching route found');
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                body: JSON.stringify({ 
                    error: 'Endpoint not found',
                    debug: {
                        httpMethod,
                        path,
                        rawPath: event.rawPath,
                        resource: event.resource
                    }
                })
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
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 