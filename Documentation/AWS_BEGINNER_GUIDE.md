# AWS Beginner's Guide - ProfessionalNet Setup

## 🚀 **Complete Step-by-Step AWS Setup for Beginners**

This guide will walk you through setting up the complete ProfessionalNet infrastructure on AWS. Every step is explained in detail with screenshots and exact instructions.

---

## 💰 **Cost Optimization - Make It As Free As Possible**

### **Free Tier Strategy (12 Months Free):**
- ✅ **Lambda**: 1M requests/month + 400,000 GB-seconds
- ✅ **DynamoDB**: 25GB storage + 25 WCU/25 RCU  
- ✅ **S3**: 5GB storage + 20,000 GET requests
- ✅ **CloudFront**: 1TB data transfer
- ✅ **API Gateway**: 1M API calls/month
- ✅ **Cognito**: 50,000 MAUs (Monthly Active Users)

### **Always Free Services:**
- ✅ **IAM**: Always free
- ✅ **VPC**: Always free (you already have this)
- ✅ **CloudWatch**: Basic monitoring free

### **Cost-Saving Tips:**
1. **Use On-Demand DynamoDB** (pay per request, not provisioned capacity)
2. **Optimize Lambda functions** (minimize execution time)
3. **Use S3 lifecycle policies** (delete old files automatically)
4. **Monitor usage** with CloudWatch alarms
5. **Set up billing alerts** at $5 and $10

### **Estimated Monthly Cost (After Free Tier):**
- **Development**: $0-5/month
- **Small Production**: $5-15/month  
- **Medium Production**: $15-50/month

---

## 📋 **Prerequisites**

### **Before You Start:**
1. **AWS Account**: You need an active AWS account
2. **Browser**: Chrome, Firefox, or Safari
3. **Time**: 3-4 hours for complete setup
4. **Budget**: $0-5/month for development (mostly free tier)

### **Important Notes:**
- **Follow each step exactly** - don't skip anything
- **Take screenshots** of important configurations
- **Save all IDs and URLs** - you'll need them later
- **Use US East (N. Virginia)** region throughout
- **Monitor costs** with billing alerts

---

## 🎯 **Step-by-Step Implementation Plan**

### **Phase 1: Foundation Setup (1-2 hours)**
1. **AWS Account & IAM Setup**
2. **VPC & Networking**
3. **Security Groups**

### **Phase 2: Core Services (1-2 hours)**
4. **DynamoDB Database**
5. **S3 Storage**
6. **Cognito Authentication**

### **Phase 3: Backend Services (1-2 hours)**
7. **Lambda Functions**
8. **API Gateway**
9. **CloudFront CDN**

### **Phase 4: Monitoring & Security (30 minutes)**
10. **CloudWatch Monitoring**
11. **IAM Roles & Policies**
12. **Testing & Validation**

---

## 🏗️ **Phase 1: Foundation Setup**

### **Step 1: AWS Account & IAM Setup**

#### **1.1 Login to AWS Console**
1. Go to: https://aws.amazon.com/console/
2. Click **"Sign In to the Console"**
3. Enter your AWS account credentials
4. **IMPORTANT**: Select **US East (N. Virginia)** region (top right corner)

#### **1.2 Create Custom IAM Policy**
1. **Search for "IAM"** in the services search bar
2. Click **"IAM"** service
3. In the left sidebar, click **"Policies"**
4. Click **"Create policy"**
5. Click **"JSON"** tab
6. Replace the content with this custom policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ProfessionalNetVPCAccess",
            "Effect": "Allow",
            "Action": [
                "ec2:CreateVpc",
                "ec2:CreateSubnet",
                "ec2:CreateInternetGateway",
                "ec2:CreateNatGateway",
                "ec2:CreateRouteTable",
                "ec2:CreateRoute",
                "ec2:CreateSecurityGroup",
                "ec2:AttachInternetGateway",
                "ec2:AssociateRouteTable",
                "ec2:AllocateAddress",
                "ec2:DescribeVpcs",
                "ec2:DescribeSubnets",
                "ec2:DescribeInternetGateways",
                "ec2:DescribeNatGateways",
                "ec2:DescribeRouteTables",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeAddresses",
                "ec2:DeleteVpc",
                "ec2:DeleteSubnet",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteNatGateway",
                "ec2:DeleteRouteTable",
                "ec2:DeleteSecurityGroup",
                "ec2:ReleaseAddress"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ProfessionalNetDynamoDBAccess",
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "dynamodb:ListTables",
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:BatchGetItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:us-east-1:*:table/professionalnet-*"
            ]
        },
        {
            "Sid": "ProfessionalNetS3Access",
            "Effect": "Allow",
            "Action": [
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:ListBucket",
                "s3:GetBucketLocation",
                "s3:GetBucketPolicy",
                "s3:PutBucketPolicy",
                "s3:PutBucketCors",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl",
                "s3:GetObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::professionalnet-*",
                "arn:aws:s3:::professionalnet-*/*"
            ]
        },
        {
            "Sid": "ProfessionalNetCognitoAccess",
            "Effect": "Allow",
            "Action": [
                "cognito-idp:CreateUserPool",
                "cognito-idp:DeleteUserPool",
                "cognito-idp:DescribeUserPool",
                "cognito-idp:ListUserPools",
                "cognito-idp:CreateUserPoolClient",
                "cognito-idp:DeleteUserPoolClient",
                "cognito-idp:DescribeUserPoolClient",
                "cognito-idp:ListUserPoolClients",
                "cognito-identity:CreateIdentityPool",
                "cognito-identity:DeleteIdentityPool",
                "cognito-identity:DescribeIdentityPool",
                "cognito-identity:ListIdentityPools",
                "cognito-identity:SetIdentityPoolRoles",
                "cognito-identity:GetIdentityPoolRoles"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ProfessionalNetLambdaAccess",
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "lambda:DeleteFunction",
                "lambda:GetFunction",
                "lambda:ListFunctions",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "lambda:InvokeFunction",
                "lambda:AddPermission",
                "lambda:RemovePermission",
                "lambda:GetPolicy",
                "lambda:PutFunctionConcurrency",
                "lambda:DeleteFunctionConcurrency"
            ],
            "Resource": [
                "arn:aws:lambda:us-east-1:*:function:professionalnet-*"
            ]
        },
        {
            "Sid": "ProfessionalNetAPIGatewayAccess",
            "Effect": "Allow",
            "Action": [
                "apigateway:*"
            ],
            "Resource": [
                "arn:aws:apigateway:us-east-1::/restapis/*",
                "arn:aws:apigateway:us-east-1::/restapis/*/*",
                "arn:aws:apigateway:us-east-1::/restapis/*/*/*",
                "arn:aws:apigateway:us-east-1::/restapis/*/*/*/*"
            ]
        },
        {
            "Sid": "ProfessionalNetCloudFrontAccess",
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateDistribution",
                "cloudfront:DeleteDistribution",
                "cloudfront:GetDistribution",
                "cloudfront:ListDistributions",
                "cloudfront:UpdateDistribution",
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ProfessionalNetCloudWatchAccess",
            "Effect": "Allow",
            "Action": [
                "cloudwatch:PutMetricData",
                "cloudwatch:GetMetricData",
                "cloudwatch:GetMetricStatistics",
                "cloudwatch:ListMetrics",
                "cloudwatch:PutDashboard",
                "cloudwatch:GetDashboard",
                "cloudwatch:ListDashboards",
                "cloudwatch:DeleteDashboards",
                "cloudwatch:PutAlarm",
                "cloudwatch:DescribeAlarms",
                "cloudwatch:DeleteAlarms",
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:DeleteLogGroup",
                "logs:DeleteLogStream"
            ],
            "Resource": "*"
        },
        {
            "Sid": "ProfessionalNetIAMRoleAccess",
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:GetRole",
                "iam:ListRoles",
                "iam:AttachRolePolicy",
                "iam:DetachRolePolicy",
                "iam:PutRolePolicy",
                "iam:DeleteRolePolicy",
                "iam:GetRolePolicy",
                "iam:ListRolePolicies",
                "iam:ListAttachedRolePolicies",
                "iam:PassRole"
            ],
            "Resource": [
                "arn:aws:iam::*:role/professionalnet-*"
            ]
        },
        {
            "Sid": "ProfessionalNetBillingAccess",
            "Effect": "Allow",
            "Action": [
                "aws-portal:ViewBilling",
                "aws-portal:ViewUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

7. Click **"Next: Tags"**
8. Click **"Next: Review"**
9. **Policy name**: `ProfessionalNetCustomPolicy`
10. **Description**: `Custom policy for ProfessionalNet project with minimal required permissions`
11. Click **"Create policy"**

#### **1.3 Create IAM User**
1. In IAM, click **"Users"** in the left sidebar
2. Click **"Create user"**
3. **User name**: `professionalnet-user`
4. **Access type**: Check both:
   - ✅ **"Programmatic access"**
   - ✅ **"AWS Management Console access"**
5. Click **"Next: Permissions"**
6. Click **"Attach existing policies directly"**
7. Search for `ProfessionalNetCustomPolicy`
8. Check the box next to **"ProfessionalNetCustomPolicy"**
9. Click **"Next: Tags"**
10. Click **"Next: Review"**
11. Click **"Create user"**
12. **CRITICAL**: Download the CSV file with credentials
13. **Save these credentials securely** - you'll need them later

#### **1.4 Set Up Billing Alerts**
1. **Search for "Billing"** in services
2. Click **"Billing"**
3. Click **"Billing preferences"**
4. Check **"Receive Billing Alerts"**
5. Click **"Save preferences"**
6. Go to **"CloudWatch"** service
7. Click **"Alarms"** → **"Create alarm"**
8. **Create multiple billing alarms**:
   - **Alarm 1**: $5 (warning level)
   - **Alarm 2**: $10 (critical level)
   - **Alarm 3**: $25 (emergency level)
9. This ensures you never get surprised by unexpected charges

### **Step 2: VPC & Networking**

#### **2.1 Create VPC**
1. **Search for "VPC"** in services
2. Click **"VPC"**
3. Click **"Create VPC"**
4. **VPC name**: `professionalnet-vpc`
5. **IPv4 CIDR block**: `10.0.0.0/16`
6. **IPv6 CIDR block**: Leave as default
7. **Tenancy**: Default
8. Click **"Create VPC"**

#### **2.2 Create Subnets**
1. In your VPC, click **"Subnets"** tab
2. Click **"Create subnet"**

**Public Subnet:**
- **VPC**: Select your VPC
- **Subnet name**: `professionalnet-public-subnet`
- **Availability Zone**: Select first available
- **IPv4 CIDR block**: `10.0.1.0/24`
- Click **"Create subnet"**

**Private Subnet:**
- Click **"Create subnet"** again
- **VPC**: Select your VPC
- **Subnet name**: `professionalnet-private-subnet`
- **Availability Zone**: Select first available
- **IPv4 CIDR block**: `10.0.3.0/24`
- Click **"Create subnet"**

#### **2.3 Create Internet Gateway**
1. In VPC, click **"Internet Gateways"**
2. Click **"Create internet gateway"**
3. **Name**: `professionalnet-igw`
4. Click **"Create internet gateway"**
5. Select the gateway and click **"Attach to VPC"**
6. Select your VPC and click **"Attach internet gateway"**

#### **2.4 Create NAT Gateway**
1. In VPC, click **"NAT Gateways"**
2. Click **"Create NAT gateway"**
3. **Subnet**: Select your public subnet
4. **Connectivity type**: Public
5. **Elastic IP allocation ID**: Click **"Allocate Elastic IP"**
6. Click **"Create NAT gateway"**

#### **2.5 Configure Route Tables**
1. In VPC, click **"Route Tables"**
2. Select the main route table
3. Click **"Edit routes"**
4. Click **"Add route"**
5. **Destination**: `0.0.0.0/0`
6. **Target**: Select your Internet Gateway
7. Click **"Save changes"**

### **Step 3: Security Groups**

#### **3.1 Create Security Groups**
1. In VPC, click **"Security Groups"**
2. Click **"Create security group"**

**ALB Security Group:**
- **Security group name**: `professionalnet-alb-sg`
- **Description**: `Security group for Application Load Balancer`
- **VPC**: Select your VPC
- **Inbound rules**:
  - **Type**: HTTP, **Port**: 80, **Source**: 0.0.0.0/0
  - **Type**: HTTPS, **Port**: 443, **Source**: 0.0.0.0/0
- Click **"Create security group"**

**Lambda Security Group:**
- Click **"Create security group"** again
- **Security group name**: `professionalnet-lambda-sg`
- **Description**: `Security group for Lambda functions`
- **VPC**: Select your VPC
- **Outbound rules**: Leave default (all traffic)
- Click **"Create security group"**

---

## 🗄️ **Phase 2: Core Services**

### **Step 4: DynamoDB Database**

#### **4.1 Create Users Table**
1. **Search for "DynamoDB"** in services
2. Click **"DynamoDB"**
3. Click **"Create table"**
4. **Table name**: `professionalnet-users`
5. **Partition key**: `userId` (String)
6. **Table settings**: Choose **"Customize settings"**
7. **Capacity mode**: Choose **"On-demand"** (most cost-effective for variable traffic)
8. **Point-in-time recovery**: **Disable** (saves money)
9. **Contributor insights**: **Disable** (saves money)
10. Click **"Create table"**

#### **4.2 Create Posts Table**
1. Click **"Create table"** again
2. **Table name**: `professionalnet-posts`
3. **Partition key**: `postId` (String)
4. **Table settings**: Choose **"Customize settings"**
5. **Capacity mode**: Choose **"On-demand"** (most cost-effective for variable traffic)
6. **Point-in-time recovery**: **Disable** (saves money)
7. **Contributor insights**: **Disable** (saves money)
8. Click **"Create table"**

#### **4.3 Create Connections Table**
1. Click **"Create table"** again
2. **Table name**: `professionalnet-connections`
3. **Partition key**: `userId` (String)
4. **Sort key**: `connectedUserId` (String)
5. **Table settings**: Choose **"Customize settings"**
6. **Capacity mode**: Choose **"On-demand"** (most cost-effective for variable traffic)
7. **Point-in-time recovery**: **Disable** (saves money)
8. **Contributor insights**: **Disable** (saves money)
9. Click **"Create table"**

### **Step 5: S3 Storage**

#### **5.1 Create Storage Bucket**
1. **Search for "S3"** in services
2. Click **"S3"**
3. Click **"Create bucket"**
4. **Bucket name**: `professionalnet-storage-[your-unique-id]` (replace with unique name)
5. **Region**: US East (N. Virginia)
6. **Block Public Access settings**: Keep all blocks enabled
7. Click **"Create bucket"**

#### **5.2 Create Website Bucket**
1. Click **"Create bucket"** again
2. **Bucket name**: `professionalnet-website-[your-unique-id]`
3. **Region**: US East (N. Virginia)
4. **Block Public Access settings**: Keep all blocks enabled
5. Click **"Create bucket"**

#### **5.3 Configure CORS**
1. Click on your storage bucket name
2. Click **"Permissions"** tab
3. Scroll down to **"Cross-origin resource sharing (CORS)"**
4. Click **"Edit"**
5. Replace with this CORS configuration:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```
6. Click **"Save changes"**

### **Step 6: Cognito Authentication**

#### **6.1 Create User Pool**
1. **Search for "Cognito"** in services
2. Click **"Amazon Cognito"**
3. Click **"Create user pool"**
4. **Step 1 - Configure sign-in experience**:
   - **Cognito user pool sign-in options**: Check **"Email"**
   - **User name requirements**: Check **"Allow email addresses"**
   - Click **"Next"**
5. **Step 2 - Configure security requirements**:
   - **Password policy**: Choose **"Cognito defaults"**
   - **Multi-factor authentication**: Choose **"No MFA"**
   - Click **"Next"**
6. **Step 3 - Configure sign-up experience**:
   - **Self-service account recovery**: Check **"Enable self-service account recovery"**
   - **Verification type**: Choose **"Email"**
   - Click **"Next"**
7. **Step 4 - Configure message delivery**:
   - **Email provider**: Choose **"Send email with Cognito"**
   - Click **"Next"**
8. **Step 5 - Integrate your app**:
   - **User pool name**: `professionalnet-users`
   - Click **"Next"**
9. **Step 6 - Review and create**:
   - Review settings
   - Click **"Create user pool"**

#### **6.2 Create User Pool Client**
1. In your user pool, click **"App integration"** tab
2. Scroll down to **"App clients and analytics"**
3. Click **"Create app client"**
4. **App client name**: `professionalnet-web-client`
5. **Confidential client**: Leave unchecked
6. Click **"Create app client"**
7. **Save the App client ID** - you'll need this later

#### **6.3 Create Identity Pool**
1. In Cognito, click **"Identity pools"** in the left sidebar
2. Click **"Create identity pool"**
3. **Identity pool name**: `professionalnet-identity-pool`
4. **Authentication providers**:
   - Check **"Cognito"**
   - **User Pool ID**: Select your user pool
   - **App client id**: Select your app client
5. Click **"Create pool"**
6. **IMPORTANT**: Save the **Identity Pool ID** - you'll need this later

---

## ⚡ **Phase 3: Backend Services**

### **Step 7: Lambda Functions**

#### **7.1 Create Lambda Function for Posts**
1. **Search for "Lambda"** in services
2. Click **"Lambda"**
3. Click **"Create function"**
4. **Function name**: `professionalnet-get-posts`
5. **Runtime**: **"Node.js 18.x"**
6. **Architecture**: **"x86_64"**
7. Click **"Create function"**

#### **7.2 Configure Function Code**
1. In the function, scroll to **"Code source"**
2. Replace the code with:
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        const params = {
            TableName: 'professionalnet-posts'
        };
        
        const result = await dynamodb.scan(params).promise();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.Items)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
```
3. Click **"Deploy"**

#### **7.3 Create More Lambda Functions**
Create these additional functions:
- `professionalnet-posts-api` (handles create, get, like posts)
- `professionalnet-connections-api` (handles follow/unfollow)
- `professionalnet-upload-api` (handles file uploads)

**Note**: Each function contains multiple endpoints handled by index.js files in their respective folders.

### **Step 8: API Gateway**

#### **8.1 Create REST API**
1. **Search for "API Gateway"** in services
2. Click **"API Gateway"**
3. Click **"Create API"**
4. Choose **"REST API"**
5. Click **"Build"**
6. **API name**: `professionalnet-api`
7. **Description**: `ProfessionalNet REST API`
8. **Endpoint Type**: **"Regional"**
9. Click **"Create API"**

#### **8.2 Create Resources and Methods**
1. In your API, click **"Actions"** → **"Create Resource"**
2. **Resource Name**: `posts`
3. **Resource Path**: `/posts`
4. Click **"Create Resource"**
5. Click **"Actions"** → **"Create Method"**
6. Select **"GET"** from dropdown
7. Click the checkmark
8. **Integration type**: **"Lambda Function"**
9. **Lambda Function**: Select your `professionalnet-get-posts` function
10. Click **"Save"**

#### **8.3 Create More Resources**
Repeat the process to create:
- `POST /posts`
- `PUT /posts/{id}`
- `DELETE /posts/{id}`
- `POST /posts/{id}/like`
- `GET /users/{id}`
- `PUT /users/{id}`
- `GET /search`

### **Step 9: CloudFront CDN**

#### **9.1 Create Distribution for Website**
1. **Search for "CloudFront"** in services
2. Click **"CloudFront"**
3. Click **"Create distribution"**
4. **Origin domain**: Select your website S3 bucket
5. **Origin path**: Leave empty
6. **Origin access**: Choose **"Origin access control settings (recommended)"**
7. Click **"Create origin access control"**
8. **Control settings name**: `professionalnet-website-control`
9. **Signing behavior**: Choose **"Yes, update the bucket policy"**
10. Click **"Create"**
11. **Default cache behavior**:
    - **Viewer protocol policy**: **"Redirect HTTP to HTTPS"**
    - **Cache policy**: **"CachingDisabled"**
    - **Origin request policy**: **"CORS-S3Origin"**
12. **Settings**:
    - **Price class**: **"Use only North America and Europe"**
    - **Alternate domain names (CNAMEs)**: Leave empty for now
    - **SSL certificate**: **"Default CloudFront certificate"**
13. Click **"Create distribution"**

#### **9.2 Create Distribution for Storage**
1. Click **"Create distribution"** again
2. **Origin domain**: Select your storage S3 bucket
3. **Origin path**: Leave empty
4. **Origin access**: Choose **"Origin access control settings (recommended)"**
5. Click **"Create origin access control"**
6. **Control settings name**: `professionalnet-storage-control`
7. **Signing behavior**: Choose **"Yes, update the bucket policy"**
8. Click **"Create"**
9. **Default cache behavior**:
    - **Viewer protocol policy**: **"Redirect HTTP to HTTPS"**
    - **Cache policy**: **"CachingOptimized"**
    - **Origin request policy**: **"CORS-S3Origin"**
10. **Settings**:
    - **Price class**: **"Use only North America and Europe"**
    - **Alternate domain names (CNAMEs)**: Leave empty for now
    - **SSL certificate**: **"Default CloudFront certificate"**
11. Click **"Create distribution"**

---

## 📊 **Phase 4: Monitoring & Security**

### **Step 10: CloudWatch Monitoring**

#### **10.1 Set Up CloudWatch Alarms**
1. **Search for "CloudWatch"** in services
2. Click **"CloudWatch"**
3. Click **"Alarms"** → **"Create alarm"**
4. **Select metric**: Choose **"Lambda"** → **"Errors"**
5. **Statistic**: Sum
6. **Period**: 5 minutes
7. **Threshold type**: Static
8. **Define alarm condition**: Greater than 0
9. Click **"Next"**
10. **Alarm name**: `professionalnet-lambda-errors`
11. Click **"Create alarm"**

### **Step 11: IAM Roles & Policies**

#### **11.1 Create Lambda Execution Role**
1. **Search for "IAM"** in services
2. Click **"IAM"**
3. Click **"Roles"** → **"Create role"**
4. **Trusted entity**: AWS service
5. **Service**: Lambda
6. Click **"Next"**
7. **Permissions**: Search and attach:
   - `AWSLambdaBasicExecutionRole`
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
8. Click **"Next"**
9. **Role name**: `professionalnet-lambda-role`
10. Click **"Create role"**

### **Step 12: Testing & Validation**

#### **12.1 Test API Endpoints**
1. Go to your API Gateway
2. Click on any endpoint
3. Click **"TEST"** tab
4. Click **"Test"** button
5. Verify you get a response

#### **12.2 Test Lambda Functions**
1. Go to your Lambda function
2. Click **"Test"** tab
3. Create a test event
4. Click **"Test"** button
5. Verify the function executes successfully

---

## 🔧 **Environment Configuration**

### **Step 13: Frontend Integration**

#### **13.1 Create Environment Variables**
Create a `.env.local` file in your React project:
```env
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
VITE_API_GATEWAY_URL=https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod
VITE_S3_BUCKET=professionalnet-storage-[your-unique-id]
VITE_CLOUDFRONT_URL=https://XXXXXXXXXX.cloudfront.net
```

#### **13.2 Update React App**
Replace the mock API calls in `src/services/mockAPI.ts` with real AWS SDK calls.

---

## ✅ **Completion Checklist**

### **Infrastructure Setup**
- [ ] AWS Account & IAM configured
- [ ] VPC & subnets created
- [ ] Security groups configured
- [ ] DynamoDB tables created
- [ ] S3 buckets created
- [ ] Cognito user pool created
- [ ] Lambda functions deployed
- [ ] API Gateway configured
- [ ] CloudFront distributions created
- [ ] CloudWatch monitoring set up
- [ ] IAM roles configured
- [ ] Environment variables set
- [ ] Frontend integration complete

### **Testing**
- [ ] API endpoints working
- [ ] Lambda functions executing
- [ ] Database operations successful
- [ ] File uploads working
- [ ] Authentication functional
- [ ] CDN serving content

---

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **CORS errors**: Check API Gateway CORS settings
2. **Permission errors**: Verify IAM roles and policies
3. **Network errors**: Check VPC and security group settings
4. **Authentication errors**: Verify Cognito configuration

### **Getting Help:**
1. **Take screenshots** of errors
2. **Check CloudWatch logs** for Lambda functions
3. **Verify all IDs** are correct
4. **Ask for help** with specific error messages

---

## 🎯 **Next Steps**

After completing this setup:
1. **Deploy your React app** to S3
2. **Configure custom domain** (optional)
3. **Set up CI/CD pipeline** (optional)
4. **Add monitoring dashboards** (optional)
5. **Implement advanced features** (optional)

---

**Congratulations! You now have a complete AWS infrastructure for ProfessionalNet!** 🚀 