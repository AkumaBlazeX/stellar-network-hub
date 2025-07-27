# ProfessionalNet Lambda Functions

This directory contains all the Lambda functions for the ProfessionalNet backend API.

## 📁 **Function Structure**

### **Users Functions**
- `users/getUser.js` - Get user profile by ID
- `users/updateUser.js` - Update user profile information

### **Posts Functions**
- `posts/createPost.js` - Create a new post
- `posts/getPosts.js` - Get posts with pagination and filtering
- `posts/likePost.js` - Like/unlike a post

### **Connections Functions**
- `connections/createConnection.js` - Follow/unfollow users

### **Upload Functions**
- `upload/uploadFile.js` - Upload files to S3

## 🚀 **Deployment Steps**

### **1. Install Dependencies**
```bash
cd lambda-functions
npm install
```

### **2. Create Deployment Package**
```bash
npm run zip
```

### **3. Upload to AWS Lambda**
- Go to AWS Lambda Console
- Create new function for each file
- Upload the zip file
- Configure environment variables
- Set up API Gateway triggers

## ⚙️ **Environment Variables**

Each function needs these environment variables:
```env
DYNAMODB_USERS_TABLE=professionalnet-users
DYNAMODB_POSTS_TABLE=professionalnet-posts
DYNAMODB_CONNECTIONS_TABLE=professionalnet-connections
S3_BUCKET=professionalnet-storage
AWS_REGION=us-east-1
```

## 🔧 **Function Configuration**

### **Memory & Timeout**
- **Memory**: 256 MB (sufficient for most operations)
- **Timeout**: 30 seconds (for file uploads), 10 seconds (for others)

### **IAM Permissions**
Each function needs permissions for:
- DynamoDB (read/write access to respective tables)
- S3 (for upload function)
- CloudWatch Logs (for logging)

## 📊 **API Endpoints**

### **Users**
- `GET /users/{userId}` - Get user profile
- `PUT /users/{userId}` - Update user profile

### **Posts**
- `POST /posts` - Create new post
- `GET /posts` - Get posts (with query parameters)
- `POST /posts/{postId}/like` - Like/unlike post

### **Connections**
- `POST /connections` - Follow/unfollow user

### **Upload**
- `POST /upload` - Upload file to S3

## 🛡️ **Security Features**

- ✅ **Input validation** for all parameters
- ✅ **CORS headers** for cross-origin requests
- ✅ **Error handling** with proper HTTP status codes
- ✅ **File type validation** for uploads
- ✅ **File size limits** (5MB max)
- ✅ **User authentication** via Cognito tokens

## 🔍 **Monitoring**

- **CloudWatch Logs**: All functions log to CloudWatch
- **Error tracking**: Detailed error messages for debugging
- **Performance metrics**: Execution time and memory usage

## 📝 **Notes**

- All functions return JSON responses
- CORS headers are included for frontend integration
- Functions are stateless and can be scaled independently
- Each function has a single responsibility for better maintainability 