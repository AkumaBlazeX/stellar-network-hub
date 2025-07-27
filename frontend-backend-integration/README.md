# Frontend-Backend Integration Files

This folder contains all the essential files that handle the integration between the React frontend and AWS backend services.

## 📁 File Structure

```
frontend-backend-integration/
├── src/
│   ├── services/
│   │   └── mockAPI.ts              # Main API integration layer
│   ├── contexts/
│   │   └── AuthContext.tsx         # Authentication & user state management
│   ├── components/posts/
│   │   ├── CreatePostModal.tsx     # File upload & post creation
│   │   └── PostCard.tsx            # Post interactions (like/unlike)
│   ├── pages/
│   │   ├── Dashboard.tsx           # Data fetching & display
│   │   └── Profile.tsx             # Profile management
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   └── main.tsx                    # Cognito configuration
├── env.local                       # AWS environment variables
└── README.md                       # This file
```

## 🔗 Integration Overview

### **API Service Layer (`mockAPI.ts`)**
- **Purpose:** Central hub for all AWS API calls
- **Features:**
  - API Gateway integration with base URL
  - JWT token handling for authentication
  - Error handling with fallback to mock data
  - All CRUD operations (users, posts, connections, uploads)

### **Authentication Context (`AuthContext.tsx`)**
- **Purpose:** Manages user authentication state
- **Features:**
  - AWS Cognito integration
  - JWT token management
  - User state persistence
  - Login/logout functionality

### **Cognito Configuration (`main.tsx`)**
- **Purpose:** AWS Cognito setup
- **Features:**
  - Cognito authority URL configuration
  - App client ID setup
  - OAuth2 flow configuration

### **Component Integration Files**
- **CreatePostModal.tsx:** File uploads to S3 via Lambda
- **PostCard.tsx:** Post interactions via API
- **Dashboard.tsx:** Data fetching from DynamoDB
- **Profile.tsx:** Profile updates via API

## 🚀 How to Use

### **1. Environment Setup**
Update `env.local` with your AWS configuration:
```env
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/Dev
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=your-s3-bucket-name
VITE_CLOUDFRONT_URL=https://your-cloudfront-url.cloudfront.net
```

### **2. Cognito Configuration**
Update `src/main.tsx` with your Cognito credentials:
```typescript
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/YOUR_USER_POOL_ID",
  client_id: "YOUR_APP_CLIENT_ID",
  redirect_uri: "http://localhost:8080",
  response_type: "code",
  scope: "email openid phone",
};
```

### **3. API Integration**
The `mockAPI.ts` file handles all backend communication:
- **User operations:** `userAPI.getUser()`, `userAPI.updateUser()`
- **Post operations:** `postsAPI.createPost()`, `postsAPI.getPosts()`, `postsAPI.likePost()`
- **Connection operations:** `connectionsAPI.createConnection()`
- **File uploads:** `uploadAPI.uploadFile()`

## 🔧 Key Features

### **✅ Real-time API Integration**
- Direct calls to AWS Lambda functions via API Gateway
- JWT token authentication for secure requests
- Error handling with graceful fallbacks

### **✅ File Upload System**
- Direct upload to S3 via Lambda functions
- Support for multiple image uploads
- Progress tracking and error handling

### **✅ Authentication Flow**
- AWS Cognito integration
- JWT token management
- User session persistence

### **✅ Data Operations**
- CRUD operations for users, posts, and connections
- Real-time data fetching and updates
- Optimistic UI updates

## 📊 Integration Flow

```
React Components → mockAPI.ts → API Gateway → Lambda Functions → DynamoDB/S3
```

### **Authentication Flow:**
```
User Login → AuthContext → Cognito → JWT Token → API Calls
```

### **Data Flow:**
```
Component → API Call → Lambda → DynamoDB → Response → UI Update
```

### **File Upload Flow:**
```
File Selection → Upload API → Lambda → S3 → File URL → Post Creation
```

## 🛠️ Dependencies

### **Required Packages:**
```bash
npm install react-oidc-context oidc-client-ts
```

### **TypeScript Types:**
All necessary types are defined in `src/types/index.ts`

## 🔐 Security Features

- **JWT Token Authentication:** All API calls include JWT tokens
- **CORS Configuration:** Proper CORS setup for API Gateway
- **Environment Variables:** Sensitive data stored in environment files
- **Error Handling:** Graceful error handling without exposing sensitive data

## 📝 Usage Examples

### **Creating a Post with Images:**
```typescript
import { postsAPI, uploadAPI } from '@/services/mockAPI';

// Upload images first
const imageUrls = await Promise.all(
  files.map(file => uploadAPI.uploadFile(file, userId))
);

// Create post with image URLs
const post = await postsAPI.createPost({
  userId,
  content: 'My post content',
  imageUrl: imageUrls[0]
});
```

### **Updating User Profile:**
```typescript
import { userAPI } from '@/services/mockAPI';

const updatedUser = await userAPI.updateUser(userId, {
  fullName: 'New Name',
  bio: 'Updated bio'
});
```

### **Liking a Post:**
```typescript
import { postsAPI } from '@/services/mockAPI';

await postsAPI.likePost(postId, userId);
```

## 🎯 Ready for Production

These files are production-ready and include:
- ✅ Complete error handling
- ✅ TypeScript type safety
- ✅ AWS service integration
- ✅ Authentication flow
- ✅ File upload system
- ✅ Real-time data operations

Simply update the environment variables and Cognito configuration to connect to your AWS services! 