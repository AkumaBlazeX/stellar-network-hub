# AWS Services List - ProfessionalNet Backend

## 🔗 AWS Console Links & Backend Integration

### **1. Identity & Access Management (IAM)**
- **Console Link:** https://console.aws.amazon.com/iam/
- **Services Created:**
  - `professionalnet-users-api-role-h7z35un2` - Lambda execution role
  - `professionalnet-posts-api-role-h7z35un2` - Lambda execution role  
  - `professionalnet-connections-api-role-h7z35un2` - Lambda execution role
  - `professionalnet-upload-api-role-h7z35un2` - Lambda execution role
- **Backend Connection:** Provides permissions for Lambda functions to access DynamoDB, S3, and CloudWatch

### **2. Amazon Cognito**
- **Console Link:** https://console.aws.amazon.com/cognito/
- **User Pool:** `us-east-1_vWjIhz1gR`
- **App Client:** `6q3onhllplcsej1nftvei118re`
- **Identity Pool:** `us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Domain:** `us-east-1vwjihz1gr.auth.us-east-1.amazoncognito.com`
- **Backend Connection:** Handles user authentication and provides tokens for API access

### **3. Amazon DynamoDB**
- **Console Link:** https://console.aws.amazon.com/dynamodb/
- **Tables Created:**
  - `professionalnet-users` - Stores user profiles
  - `professionalnet-posts` - Stores posts and content
  - `professionalnet-connections` - Stores follow/unfollow relationships
- **Backend Connection:** Primary database for all application data

### **4. AWS Lambda**
- **Console Link:** https://console.aws.amazon.com/lambda/
- **Functions Created:**
  - `professionalnet-users-api` - Handles user CRUD operations
  - `professionalnet-posts-api` - Handles post CRUD operations
  - `professionalnet-connections-api` - Handles follow/unfollow operations
  - `professionalnet-upload-api` - Handles file uploads to S3
- **Lambda Layer:** `aws-sdk-layer` - Shared AWS SDK dependencies
- **Backend Connection:** Serverless compute for all API operations

### **5. Amazon API Gateway**
- **Console Link:** https://console.aws.amazon.com/apigateway/
- **API:** `professionalnet-api`
- **Base URL:** `https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev`
- **Endpoints:**
  - `GET /users/{userId}` - Get user profile
  - `PUT /users/{userId}` - Update user profile
  - `GET /posts` - Get all posts
  - `POST /posts` - Create new post
  - `PUT /posts/{postId}/like` - Like/unlike post
  - `POST /connections` - Follow/unfollow user
  - `POST /upload` - Upload file to S3
- **Backend Connection:** REST API gateway that routes requests to Lambda functions

### **6. Amazon S3**
- **Console Link:** https://console.aws.amazon.com/s3/
- **Bucket:** `professionalnet-storage-26-07-2025`
- **Purpose:** File storage for images and uploads
- **Backend Connection:** Stores user-uploaded files (profile pictures, post images)

### **7. Amazon CloudFront**
- **Console Link:** https://console.aws.amazon.com/cloudfront/
- **Distribution:** `d84l1y8p4kdic.cloudfront.net`
- **Origin:** S3 bucket for static file delivery
- **Backend Connection:** CDN for fast delivery of uploaded files and static assets

### **8. Amazon CloudWatch**
- **Console Link:** https://console.aws.amazon.com/cloudwatch/
- **Log Groups:** Auto-created for each Lambda function
- **Alarms:** `professionalnet-api-errors` - Monitors API errors
- **Backend Connection:** Monitoring and logging for all Lambda functions

### **9. Amazon VPC**
- **Console Link:** https://console.aws.amazon.com/vpc/
- **VPC:** Custom VPC for Lambda functions
- **Subnets:** Private subnets for Lambda execution
- **Security Groups:** Lambda security groups
- **Backend Connection:** Network isolation for Lambda functions

---

## 🔄 Backend Integration Flow

### **Frontend → Backend Flow:**
1. **User Authentication:** React app → Cognito → JWT tokens
2. **API Requests:** React app → API Gateway → Lambda functions
3. **Data Operations:** Lambda functions → DynamoDB
4. **File Uploads:** React app → API Gateway → Lambda → S3
5. **File Delivery:** CloudFront → S3 → Users

### **API Endpoints & Lambda Functions:**

| Endpoint | Method | Lambda Function | Purpose |
|----------|--------|-----------------|---------|
| `/users/{userId}` | GET | `professionalnet-users-api` | Get user profile |
| `/users/{userId}` | PUT | `professionalnet-users-api` | Update user profile |
| `/posts` | GET | `professionalnet-posts-api` | Get all posts |
| `/posts` | POST | `professionalnet-posts-api` | Create new post |
| `/posts/{postId}/like` | PUT | `professionalnet-posts-api` | Like/unlike post |
| `/connections` | POST | `professionalnet-connections-api` | Follow/unfollow |
| `/upload` | POST | `professionalnet-upload-api` | Upload file |

### **Database Schema:**

#### **professionalnet-users Table:**
- **Primary Key:** `userId` (String)
- **Attributes:** `fullName`, `email`, `bio`, `profilePicture`, `createdAt`, `updatedAt`

#### **professionalnet-posts Table:**
- **Primary Key:** `postId` (String)
- **Attributes:** `authorId`, `content`, `imageUrl`, `likes`, `createdAt`, `updatedAt`

#### **professionalnet-connections Table:**
- **Primary Key:** `userId` (String) + `connectedUserId` (String)
- **Attributes:** `createdAt`

---

## 🛠️ Environment Variables

### **Frontend (.env.local):**
```env
VITE_API_BASE_URL=https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=professionalnet-storage-26-07-2025
VITE_CLOUDFRONT_URL=https://d84l1y8p4kdic.cloudfront.net
```

### **Lambda Functions:**
- **DynamoDB Table Names:** `professionalnet-users`, `professionalnet-posts`, `professionalnet-connections`
- **S3 Bucket:** `professionalnet-storage-26-07-2025`
- **AWS Region:** `us-east-1`

---

## 📊 Monitoring & Logs

### **CloudWatch Log Groups:**
- `/aws/lambda/professionalnet-users-api`
- `/aws/lambda/professionalnet-posts-api`
- `/aws/lambda/professionalnet-connections-api`
- `/aws/lambda/professionalnet-upload-api`

### **API Gateway Logs:**
- Access logs for all API requests
- Error logs for failed requests
- Performance metrics

---

## 🔐 Security & Permissions

### **IAM Policies Attached:**
- `AmazonDynamoDBFullAccess` - For Lambda functions to access DynamoDB
- `AmazonS3FullAccess` - For upload Lambda to access S3
- `CloudWatchLogsFullAccess` - For Lambda functions to write logs

### **Cognito Permissions:**
- User pool for authentication
- Identity pool for AWS service access
- App client for frontend integration

---

## 💰 Cost Centers

### **Monthly Estimated Costs:**
- **Lambda:** $0.20 per 1M requests
- **API Gateway:** $3.50 per 1M requests
- **DynamoDB:** $1.25 per 1M reads + $6.25 per 1M writes
- **S3:** $0.023 per GB stored
- **CloudFront:** $0.085 per GB transferred
- **Cognito:** $0.0055 per MAU
- **VPC:** $0 (no NAT Gateway)

**Total for 1000 users: ~$5-15/month** 🎯 