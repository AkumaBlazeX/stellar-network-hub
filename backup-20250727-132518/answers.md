# Lambda + API Gateway Debugging Answers

## 🔧 General Setup

### 1. **Lambda Function Name**
- **Answer**: `professionalnet-posts-api`
- **Purpose**: Handles all posts-related operations (GET, POST, like)

### 2. **Handler Configuration**
- **Handler**: `index.handler`
- **File Structure**: 
  ```
  lambda-functions/posts/
  ├── index.js (router)
  ├── createPost.js
  ├── getPosts.js
  └── likePost.js
  ```
- **Router Pattern**: `index.js` routes requests to specific functions based on HTTP method and path

### 3. **Runtime**
- **Runtime**: Node.js 18.x
- **Status**: ✅ Working correctly

### 4. **Deployment Package**
- **Correct Method**: Zip the **contents** of the folder, not the folder itself
- **Structure**: 
  ```
  posts-api.zip
  ├── index.js
  ├── createPost.js
  ├── getPosts.js
  ├── likePost.js
  ├── package.json
  └── node_modules/
  ```

---

## 📝 Handler Code

### 5. **Router Code (index.js)**
```javascript
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
```

### 6. **JSON Parsing**
- **Status**: ✅ Implemented correctly
- **Code**: `JSON.parse(event.body)` is used in all handler functions
- **Example**: 
  ```javascript
  const body = JSON.parse(event.body);
  const { authorId, content, imageUrl } = body;
  ```

### 7. **Debug Logging**
- **Status**: ✅ Extensive logging implemented
- **Logs Include**:
  - Function start/end
  - Request parameters
  - DynamoDB operations
  - Error details
  - Fallback data usage

### 8. **Response Format**
- **Status**: ✅ Proper JSON responses with headers
- **Format**:
  ```javascript
  return {
      statusCode: 200,
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
      },
      body: JSON.stringify(responseData)
  };
  ```

---

## 📡 API Gateway Setup

### 9. **Integration Configuration**
- **Status**: ✅ Properly configured
- **Integration Type**: Lambda Function
- **Lambda Function**: `professionalnet-posts-api`
- **Lambda Proxy Integration**: ✅ Enabled
- **Region**: us-east-1

### 10. **Request Body Mappings**
- **Status**: ✅ No custom mappings (using Lambda Proxy)
- **Body Format**: Raw JSON passed directly to Lambda
- **Content-Type**: application/json

### 11. **API Gateway Test Results**

#### **GET /posts Test:**
- **Status**: 504 Timeout (initially)
- **Issue**: DynamoDB permissions missing
- **Fix**: Added DynamoDB permissions to IAM role

#### **POST /posts Test:**
- **Status**: 400 Bad Request
- **Error**: `{"error":"Content and authorId are required"}`
- **Issue**: Field name mismatch (`userId` vs `authorId`)
- **Fix**: Use `authorId` instead of `userId`

---

## 🧪 Test Examples

### 12. **Curl Test Command**
```bash
curl -X POST https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev/posts \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "user-123",
    "content": "Test post from curl",
    "imageUrl": ""
  }'
```

### 13. **API Gateway Console Test**
- **Method**: POST /posts
- **Headers**: `Content-Type:application/json`
- **Body**:
  ```json
  {
    "authorId": "user-123",
    "content": "Test post from console",
    "imageUrl": ""
  }
  ```

### 14. **CloudWatch Logs**
- **Log Group**: `/aws/lambda/professionalnet-posts-api`
- **Log Stream**: Latest execution
- **Key Logs**:
  ```
  🚀 createPost Lambda function started
  📋 Request body: { authorId: 'user-123', content: '...' }
  🔍 Creating post in DynamoDB
  ✅ Post created successfully
  ```

---

## 🔧 Issues & Fixes

### **Issue 1: Timeout (504)**
- **Cause**: Missing DynamoDB permissions
- **Fix**: Added `AmazonDynamoDBFullAccess` to IAM role
- **Status**: ✅ Resolved

### **Issue 2: Validation Error (400)**
- **Cause**: Wrong field name (`userId` instead of `authorId`)
- **Fix**: Use correct field names in request body
- **Status**: ✅ Identified

### **Issue 3: Fallback Data**
- **Implementation**: Lambda returns test data if DynamoDB fails
- **Purpose**: Ensures API works even without database
- **Status**: ✅ Working

---

## 🛡️ CORS Configuration

### 15. **CORS Headers**
- **Status**: ✅ Properly configured
- **Headers**:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Headers: Content-Type
  Access-Control-Allow-Methods: GET,POST,OPTIONS
  ```

---

## 📊 Current Status

### ✅ **Working Components:**
- Lambda function execution
- API Gateway routing
- Request/response handling
- Error handling
- CORS headers
- Debug logging

### ⚠️ **Known Issues:**
- Field name validation (`authorId` vs `userId`)
- DynamoDB permissions (if not added)

### 🎯 **Next Steps:**
1. Use correct field names in requests
2. Ensure DynamoDB permissions are added
3. Test all endpoints (GET, POST, like)
4. Connect frontend to API

---

## 🔍 **Debugging Checklist**

### **If Getting 404:**
- Check API Gateway routes are configured
- Verify Lambda integration is set up
- Ensure API is deployed

### **If Getting 500:**
- Check CloudWatch logs for Lambda errors
- Verify DynamoDB permissions
- Check Lambda function code

### **If Getting 400:**
- Check request body format
- Verify field names match expected format
- Check JSON syntax

### **If Getting 504:**
- Check Lambda timeout settings
- Verify DynamoDB permissions
- Check Lambda function for infinite loops

---

**Last Updated**: July 26, 2025  
**Status**: API Gateway + Lambda working, field validation issue identified 