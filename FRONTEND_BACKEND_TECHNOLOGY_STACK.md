# 🛠️ ProfessionalNet - Technology Stack Breakdown

## 📱 **FRONTEND TECHNOLOGIES**

### **🎯 Core Framework**
- **React 18** - Main JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server

### **🎨 UI & Styling**
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icon toolkit

### **🔄 State Management & Data Fetching**
- **React Context API** - Built-in state management for auth and theme
- **React Query (TanStack Query)** - Server state management and caching
- **React Router DOM** - Client-side routing and navigation

### **🔧 Development Tools**
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - CSS vendor prefixing

### **📦 Key Frontend Libraries**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@tanstack/react-query": "^4.29.0",
  "tailwindcss": "^3.3.0",
  "@radix-ui/react-dialog": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.5",
  "@radix-ui/react-toast": "^1.1.4",
  "lucide-react": "^0.263.1",
  "class-variance-authority": "^0.7.0",
  "clsx": "^1.2.1",
  "tailwind-merge": "^1.13.2"
}
```

### **🏗️ Frontend Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Header, Layout)
│   ├── posts/          # Post-related components
│   └── ui/             # Shadcn/ui components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### **🎨 UI Components Used**
- **Authentication**: Login, Register, ProtectedRoute
- **Layout**: Header, Layout, Navigation
- **Posts**: PostCard, CreatePostModal, PostList
- **Profile**: Profile page, EditProfileModal
- **Social**: PeopleYouMayKnow, Connection management
- **UI Elements**: Buttons, Cards, Modals, Forms, Toasts

---

## ⚡ **BACKEND TECHNOLOGIES (AWS Serverless)**

### **🌐 API Layer**
- **AWS API Gateway** - RESTful API endpoints
  - **Base URL**: `https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev`
  - **Endpoints**: `/posts`, `/users`, `/connections`, `/upload`

### **⚡ Serverless Compute**
- **AWS Lambda** - Serverless functions (Node.js 18.x)
  - **Posts API Lambda** - CRUD operations for posts
  - **Users API Lambda** - User management operations
  - **Connections API Lambda** - Follow/unfollow functionality
  - **Upload API Lambda** - File upload handling

### **🗄️ Database**
- **AWS DynamoDB** - NoSQL database
  - **professionalnet-users** table - User profiles and data
  - **professionalnet-posts** table - Posts and content
  - **professionalnet-connections** table - User connections/follows

### **📁 File Storage**
- **AWS S3** - Object storage for files
  - **Bucket**: `professionalnet-storage-26-07-2025`
  - **Purpose**: Profile pictures, post images, file uploads

### **🌐 Content Delivery**
- **AWS CloudFront** - CDN for static content
  - **Distribution**: `d84l1y8p4kdic.cloudfront.net`
  - **Purpose**: Serve images and static assets globally

### **🔧 Backend Architecture**
```
lambda-functions/
├── posts/              # Posts API functions
│   ├── index.js        # Main router
│   ├── createPost.js   # Create new posts
│   ├── getPosts.js     # Retrieve posts
│   ├── likePost.js     # Like/unlike posts
│   ├── updatePost.js   # Update posts
│   └── deletePost.js   # Delete posts
├── users/              # Users API functions
│   ├── index.js        # Main router
│   ├── getUser.js      # Get user data
│   └── updateUser.js   # Update user profile
├── connections/        # Connections API functions
│   ├── index.js        # Main router
│   └── createConnection.js # Follow/unfollow users
└── upload/             # Upload API functions
    ├── index.js        # Main router
    └── uploadFile.js   # Handle file uploads
```

### **🔐 Authentication (Frontend-based)**
- **localStorage** - Client-side user session storage
- **Custom Auth Context** - React context for user state
- **Password Hashing** - Client-side SHA-256 hashing
- **Session Management** - Browser-based session handling

### **📊 Monitoring & Logging**
- **AWS CloudWatch** - Built-in Lambda logging
- **Console Logging** - Development debugging
- **Error Tracking** - Custom error handling

---

## 🔄 **FRONTEND-BACKEND INTEGRATION**

### **📡 API Communication**
```typescript
// Frontend API calls (mockAPI.ts)
const API_BASE_URL = 'https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev';

// Example API call
const response = await fetch(`${API_BASE_URL}/posts`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(postData)
});
```

### **🔄 Data Flow**
1. **Frontend** makes HTTP requests to **API Gateway**
2. **API Gateway** routes requests to appropriate **Lambda functions**
3. **Lambda functions** interact with **DynamoDB** and **S3**
4. **Responses** flow back through **API Gateway** to **Frontend**
5. **Frontend** updates UI based on responses

### **📁 File Upload Flow**
1. **Frontend** selects file and calls upload API
2. **Upload Lambda** receives base64 file data
3. **Lambda** uploads file to **S3 bucket**
4. **S3** returns file URL
5. **CloudFront** serves file globally via CDN

---

## 🚀 **DEPLOYMENT & HOSTING**

### **Frontend Deployment Options**
- **AWS S3 + CloudFront** - Static website hosting
- **Vercel** - React app hosting
- **Netlify** - Static site hosting
- **Any static hosting service**

### **Backend Deployment**
- **AWS Lambda** - Auto-deployed via AWS Console
- **API Gateway** - Automatically configured
- **DynamoDB** - Tables created in AWS Console
- **S3** - Bucket configured with proper permissions

---

## 💰 **COST BREAKDOWN**

### **Frontend Costs**
- **Development**: Free (local development)
- **Hosting**: $0-20/month (depending on platform)

### **Backend Costs (AWS)**
- **Free Tier (12 months)**: $0.00
- **After Free Tier**: ~$1.55/month
  - Lambda: $0.20/month
  - API Gateway: $1.00/month
  - DynamoDB: $0.25/month
  - S3: $0.02/month
  - CloudFront: $0.08/month

---

## 🎯 **KEY FEATURES IMPLEMENTED**

### **Frontend Features**
- ✅ User authentication (localStorage-based)
- ✅ User registration and login
- ✅ Post creation with image uploads
- ✅ Post feed and interaction
- ✅ User profiles and editing
- ✅ Follow/unfollow functionality
- ✅ Responsive design
- ✅ Real-time UI updates

### **Backend Features**
- ✅ RESTful API endpoints
- ✅ User CRUD operations
- ✅ Post CRUD operations
- ✅ File upload to S3
- ✅ User connections/follows
- ✅ Database operations
- ✅ Error handling
- ✅ CORS support

---

**🏗️ This technology stack provides a modern, scalable, and cost-effective solution for ProfessionalNet!** 