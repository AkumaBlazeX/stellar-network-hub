# ��️ ProfessionalNet - Complete AWS Architecture Flowchart

## 📊 **Dynamic AWS Services Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PROFESSIONALNET - COMPLETE AWS ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │   👤 USER       │
                    │   (Browser)     │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   📱 REACT      │
                    │   FRONTEND      │
                    │   (ProfessionalNet App) │
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   🌐 CLOUDFRONT │
                    │   (CDN)         │
                    │   d84l1y8p4kdic.cloudfront.net │
                    │  ┌─────────────┐│
                    │  │   Cache     ││
                    │  │   Control   ││
                    │  │   (TTL)     ││
                    │  └─────────────┘│
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   🔗 API GATEWAY│
                    │   (REST API)    │
                    │   d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev │
                    │  ┌─────────────┐│
                    │  │   /posts    ││
                    │  │   /users    ││
                    │  │ /connections││
                    │  │   /upload   ││
                    │  └─────────────┘│
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   🔐 COGNITO    │
                    │   (Auth)        │
                    │   us-east-1_vWjIhz1gR │
                    │  ┌─────────────┐│
                    │  │   User      ││
                    │  │   Pool      ││
                    │  │   (50K MAU) ││
                    │  └─────────────┘│
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   🌐 VPC        │
                    │   (Network)     │
                    │  ┌─────────────┐│
                    │  │   Public    ││
                    │  │   Subnets   ││
                    │  │   (us-east-1)││
                    │  └─────────────┘│
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   ⚡ LAMBDA     │
                    │   FUNCTIONS     │
                    │   (Serverless)  │
                    └─────────┬───────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   📝 POSTS  │ │   👥 USERS  │ │   🔗 CONN   │
            │   API       │ │   API       │ │   API       │
            │   Lambda    │ │   Lambda    │ │   Lambda    │
            │  ┌─────────┐│ │  ┌─────────┐│ │  ┌─────────┐│
            │  │createPost││ │  │ getUser ││ │  │createConn││
            │  │ getPosts ││ │  │updateUser││ │  │ getUsers ││
            │  │ likePost ││ │  │createUser││ │  │follow/unf││
            │  │updatePost││ │  │deleteUser││ │  │ollow    ││
            │  │deletePost││ │  └─────────┘│ │  └─────────┘│
            │  └─────────┘│ │             │ │             │
            └─────────────┘ └─────────────┘ └─────────────┘
                    │         │         │
                    └─────────┼─────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   📁 S3 STORAGE │
                    │   (File Upload) │
                    │   professionalnet-storage-26-07-2025 │
                    │  ┌─────────────┐│
                    │  │   Profile   ││
                    │  │   Pictures  ││
                    │  │   Post      ││
                    │  │   Images    ││
                    │  │   Upload    ││
                    │  │   Files     ││
                    │  └─────────────┘│
                    └─────────┬───────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   🗄️ DYNAMODB   │
                    │   (Database)    │
                    │   (NoSQL)       │
                    └─────────┬───────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ professional│ │ professional│ │ professional│
            │ net-posts   │ │ net-users   │ │ net-connections│
            │ table       │ │ table       │ │ table       │
            │  ┌─────────┐│ │  ┌─────────┐│ │  ┌─────────┐│
            │  │ postId  ││ │  │ userId  ││ │  │ userId  ││
            │  │ authorId││ │  │ email   ││ │  │connected││
            │  │ content ││ │  │ username││ │  │UserId   ││
            │  │ imageUrl││ │  │ fullName││ │  │ createdAt││
            │  │ createdAt││ │  │ bio     ││ │  │ status  ││
            │  │ likes   ││ │  │ location││ │  └─────────┘│
            │  │ comments││ │  │ website ││ │             │
            │  └─────────┘│ │  │ connections││ │             │
            └─────────────┘ │  │ posts   ││ │             │
                           │  └─────────┘│ │             │
                           └─────────────┘ └─────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   📊 CLOUDWATCH │
                    │   (Monitoring)  │
                    │  ┌─────────────┐│
                    │  │   Lambda    ││
                    │  │   Logs      ││
                    │  │   Metrics   ││
                    │  │   Alarms    ││
                    │  │   Dashboard ││
                    │  └─────────────┘│
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   🔒 IAM        │
                    │   (Security)    │
                    │  ┌─────────────┐│
                    │  │   Roles     ││
                    │  │   Policies  ││
                    │  │   Permissions││
                    │  │   Access    ││
                    │  │   Control   ││
                    │  └─────────────┘│
                    └─────────────────┘
```

## 🔄 **Complete Data Flow Processes**

### **1. User Authentication Flow**
```
👤 User → 📱 React → 🔐 Cognito (User Pool) → 🗄️ DynamoDB → 📱 UI Response
```

### **2. Post Creation Flow**
```
👤 User → 📱 React → 🌐 CloudFront → 🔗 API Gateway → ⚡ Posts Lambda → 📁 S3 (Images) → 🗄️ DynamoDB → 📱 UI Update
```

### **3. File Upload Flow**
```
👤 User → 📱 React → 🌐 CloudFront → 🔗 API Gateway → ⚡ Upload Lambda → 📁 S3 → 🌐 CloudFront → 📱 Display
```

### **4. User Connection Flow**
```
👤 User → 📱 React → 🌐 CloudFront → 🔗 API Gateway → ⚡ Connections Lambda → 🗄️ DynamoDB → 📱 UI Update
```

### **5. Data Retrieval Flow**
```
👤 User → 📱 React → 🌐 CloudFront → 🔗 API Gateway → ⚡ Lambda → 🗄️ DynamoDB → 📱 UI Display
```

## 🎯 **Complete AWS Services Used**

| Service | Purpose | Configuration | Features Used |
|---------|---------|---------------|---------------|
| **🌐 CloudFront** | CDN & Content Delivery | d84l1y8p4kdic.cloudfront.net | Cache Control, TTL, HTTPS |
| **🔗 API Gateway** | REST API Endpoints | d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev | /posts, /users, /connections, /upload |
| **🔐 Cognito** | User Authentication | us-east-1_vWjIhz1gR | User Pool, 50K MAU |
| **🌐 VPC** | Network Infrastructure | us-east-1 | Public Subnets, Internet Gateway |
| **⚡ Lambda** | Serverless Functions | Node.js 18.x | 4 functions with specific handlers |
| **🗄️ DynamoDB** | NoSQL Database | On-Demand | 3 tables with specific schemas |
| **📁 S3** | File Storage | professionalnet-storage-26-07-2025 | Profile pics, post images, uploads |
| **📊 CloudWatch** | Monitoring & Logs | Built-in | Lambda logs, metrics, alarms |
| **🔒 IAM** | Security & Access | Custom roles | Lambda execution, S3 access, DynamoDB access |

## 🔧 **Lambda Function Details**

### **Posts API Lambda**
- **Functions**: createPost, getPosts, likePost, updatePost, deletePost
- **Dependencies**: DynamoDB, UUID generation
- **Endpoints**: POST/GET/PUT/DELETE /posts

### **Users API Lambda**
- **Functions**: getUser, updateUser, createUser, deleteUser
- **Dependencies**: DynamoDB
- **Endpoints**: GET/PUT /users/{userId}

### **Connections API Lambda**
- **Functions**: createConnection, getUsers
- **Dependencies**: DynamoDB
- **Endpoints**: POST /connections

### **Upload API Lambda**
- **Functions**: uploadFile
- **Dependencies**: S3, DynamoDB
- **Endpoints**: POST /upload

## 🗄️ **DynamoDB Table Schemas**

### **professionalnet-users**
- **Partition Key**: userId (String)
- **Attributes**: email, username, fullName, profilePicture, bio, location, website, connections, posts, createdAt

### **professionalnet-posts**
- **Partition Key**: postId (String)
- **Attributes**: authorId, content, imageUrl, imageUrls, createdAt, updatedAt, likes, comments

### **professionalnet-connections**
- **Partition Key**: userId (String)
- **Sort Key**: connectedUserId (String)
- **Attributes**: createdAt, status

## 💰 **Complete Cost Breakdown**

| Service | Free Tier | After Free Tier | Monthly Cost |
|---------|-----------|-----------------|--------------|
| **Lambda** | 1M requests | $0.20 | Backend logic |
| **API Gateway** | 1M calls | $1.00 | API endpoints |
| **DynamoDB** | 25GB storage | $0.25 | Database |
| **S3** | 5GB storage | $0.02 | File storage |
| **CloudFront** | 1TB transfer | $0.08 | CDN |
| **Cognito** | 50K MAU | $0.00 | Authentication |
| **VPC** | Always free | $0.00 | Networking |
| **CloudWatch** | Basic free | $0.00 | Monitoring |
| **IAM** | Always free | $0.00 | Security |
| **Total** | **$0.00** | **~$1.55/month** | **Complete app** |

---

**🏗️ Complete, dynamic, and production-ready AWS serverless architecture!** 