# ProfessionalNet - Security Permissions Guide

## 🔐 **Why We Don't Use Admin Access**

### **Security Best Practices:**
- ❌ **Never use admin access** for development
- ✅ **Use least privilege principle** - only give what's needed
- ✅ **Custom policies** for specific project requirements
- ✅ **Regular permission reviews** and updates

---

## 📋 **Specific Permissions Needed for ProfessionalNet**

### **1. VPC & Networking (EC2)**
```json
"ProfessionalNetVPCAccess": {
    "Actions": [
        "ec2:CreateVpc", "ec2:CreateSubnet", "ec2:CreateInternetGateway",
        "ec2:CreateNatGateway", "ec2:CreateRouteTable", "ec2:CreateRoute",
        "ec2:CreateSecurityGroup", "ec2:AttachInternetGateway",
        "ec2:AssociateRouteTable", "ec2:AllocateAddress",
        "ec2:Describe*", "ec2:Delete*", "ec2:ReleaseAddress"
    ]
}
```
**Why needed**: To create and manage the network infrastructure

### **2. Database (DynamoDB)**
```json
"ProfessionalNetDynamoDBAccess": {
    "Actions": [
        "dynamodb:CreateTable", "dynamodb:DeleteTable", "dynamodb:DescribeTable",
        "dynamodb:ListTables", "dynamodb:PutItem", "dynamodb:GetItem",
        "dynamodb:UpdateItem", "dynamodb:DeleteItem", "dynamodb:Query",
        "dynamodb:Scan", "dynamodb:BatchWriteItem", "dynamodb:BatchGetItem"
    ],
    "Resource": "arn:aws:dynamodb:us-east-1:*:table/professionalnet-*"
}
```
**Why needed**: To create and manage database tables for users, posts, and connections

### **3. File Storage (S3)**
```json
"ProfessionalNetS3Access": {
    "Actions": [
        "s3:CreateBucket", "s3:DeleteBucket", "s3:ListBucket",
        "s3:GetBucketLocation", "s3:GetBucketPolicy", "s3:PutBucketPolicy",
        "s3:PutBucketCors", "s3:PutObject", "s3:GetObject",
        "s3:DeleteObject", "s3:PutObjectAcl", "s3:GetObjectAcl"
    ],
    "Resource": [
        "arn:aws:s3:::professionalnet-*",
        "arn:aws:s3:::professionalnet-*/*"
    ]
}
```
**Why needed**: To store user uploads, profile pictures, and host the website

### **4. Authentication (Cognito)**
```json
"ProfessionalNetCognitoAccess": {
    "Actions": [
        "cognito-idp:CreateUserPool", "cognito-idp:DeleteUserPool",
        "cognito-idp:DescribeUserPool", "cognito-idp:ListUserPools",
        "cognito-idp:CreateUserPoolClient", "cognito-idp:DeleteUserPoolClient",
        "cognito-idp:DescribeUserPoolClient", "cognito-idp:ListUserPoolClients",
        "cognito-identity:CreateIdentityPool", "cognito-identity:DeleteIdentityPool",
        "cognito-identity:DescribeIdentityPool", "cognito-identity:ListIdentityPools",
        "cognito-identity:SetIdentityPoolRoles", "cognito-identity:GetIdentityPoolRoles"
    ]
}
```
**Why needed**: To manage user authentication and authorization

### **5. Backend Functions (Lambda)**
```json
"ProfessionalNetLambdaAccess": {
    "Actions": [
        "lambda:CreateFunction", "lambda:DeleteFunction", "lambda:GetFunction",
        "lambda:ListFunctions", "lambda:UpdateFunctionCode", "lambda:UpdateFunctionConfiguration",
        "lambda:InvokeFunction", "lambda:AddPermission", "lambda:RemovePermission",
        "lambda:GetPolicy", "lambda:PutFunctionConcurrency", "lambda:DeleteFunctionConcurrency"
    ],
    "Resource": "arn:aws:lambda:us-east-1:*:function:professionalnet-*"
}
```
**Why needed**: To create and manage serverless backend functions

### **6. API Management (API Gateway)**
```json
"ProfessionalNetAPIGatewayAccess": {
    "Actions": ["apigateway:*"],
    "Resource": [
        "arn:aws:apigateway:us-east-1::/restapis/*",
        "arn:aws:apigateway:us-east-1::/restapis/*/*",
        "arn:aws:apigateway:us-east-1::/restapis/*/*/*",
        "arn:aws:apigateway:us-east-1::/restapis/*/*/*/*"
    ]
}
```
**Why needed**: To create and manage REST API endpoints

### **7. Content Delivery (CloudFront)**
```json
"ProfessionalNetCloudFrontAccess": {
    "Actions": [
        "cloudfront:CreateDistribution", "cloudfront:DeleteDistribution",
        "cloudfront:GetDistribution", "cloudfront:ListDistributions",
        "cloudfront:UpdateDistribution", "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation", "cloudfront:ListInvalidations"
    ]
}
```
**Why needed**: To serve content globally with low latency

### **8. Monitoring (CloudWatch)**
```json
"ProfessionalNetCloudWatchAccess": {
    "Actions": [
        "cloudwatch:PutMetricData", "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics", "cloudwatch:ListMetrics",
        "cloudwatch:PutDashboard", "cloudwatch:GetDashboard",
        "cloudwatch:ListDashboards", "cloudwatch:DeleteDashboards",
        "cloudwatch:PutAlarm", "cloudwatch:DescribeAlarms",
        "cloudwatch:DeleteAlarms", "logs:*"
    ]
}
```
**Why needed**: To monitor application performance and set up alerts

### **9. Role Management (IAM)**
```json
"ProfessionalNetIAMRoleAccess": {
    "Actions": [
        "iam:CreateRole", "iam:DeleteRole", "iam:GetRole", "iam:ListRoles",
        "iam:AttachRolePolicy", "iam:DetachRolePolicy", "iam:PutRolePolicy",
        "iam:DeleteRolePolicy", "iam:GetRolePolicy", "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies", "iam:PassRole"
    ],
    "Resource": "arn:aws:iam::*:role/professionalnet-*"
}
```
**Why needed**: To create roles for Lambda functions and other services

### **10. Billing Access**
```json
"ProfessionalNetBillingAccess": {
    "Actions": [
        "aws-portal:ViewBilling",
        "aws-portal:ViewUsage"
    ]
}
```
**Why needed**: To monitor costs and set up billing alerts

---

## 🚫 **What We DON'T Have Access To**

### **Restricted Services:**
- ❌ **EC2 Instances** (we use serverless instead)
- ❌ **RDS Databases** (we use DynamoDB)
- ❌ **Elastic Beanstalk** (not needed)
- ❌ **ECS/EKS** (not needed)
- ❌ **Other AWS accounts** (security boundary)
- ❌ **IAM user management** (only for our specific roles)
- ❌ **Billing modification** (only viewing)

### **Restricted Actions:**
- ❌ **Delete AWS account**
- ❌ **Modify billing settings**
- ❌ **Access other users' resources**
- ❌ **Create admin users**
- ❌ **Modify root account**

---

## ✅ **Security Benefits**

### **1. Least Privilege Principle**
- Only the permissions needed for ProfessionalNet
- No access to unrelated AWS services
- Reduced attack surface

### **2. Resource Scoping**
- DynamoDB tables: Only `professionalnet-*` tables
- S3 buckets: Only `professionalnet-*` buckets
- Lambda functions: Only `professionalnet-*` functions
- IAM roles: Only `professionalnet-*` roles

### **3. Audit Trail**
- All actions are logged
- Easy to track what was done
- Clear accountability

### **4. Cost Control**
- Can't accidentally create expensive resources
- Limited to project-specific services
- Billing monitoring enabled

---

## 🔄 **Permission Updates**

### **When to Update Permissions:**
1. **Adding new features** that need new AWS services
2. **Changing architecture** (e.g., adding EC2 instances)
3. **Security reviews** (quarterly recommended)
4. **Compliance requirements**

### **How to Update:**
1. **Identify new requirements**
2. **Add specific permissions** to the policy
3. **Test in development** first
4. **Update production** policy
5. **Document changes** in CHANGE_TRACKING.md

---

## 📞 **Need More Permissions?**

If you encounter permission errors:

1. **Check the error message** - it tells you exactly what's missing
2. **Add the specific permission** to the policy
3. **Test the change** before proceeding
4. **Document the addition** in CHANGE_TRACKING.md

**Example Error:**
```
AccessDenied: User: arn:aws:iam::123456789012:user/professionalnet-user 
is not authorized to perform: ec2:DescribeInstances
```

**Solution:** Add `ec2:DescribeInstances` to the VPC access section.

---

## 🎯 **Summary**

### **What We Have:**
- ✅ **All permissions needed** for ProfessionalNet
- ✅ **Secure, scoped access** to AWS services
- ✅ **No admin privileges** or unnecessary access
- ✅ **Cost monitoring** and control
- ✅ **Audit trail** for all actions

### **What We Don't Have:**
- ❌ **Admin access** or root privileges
- ❌ **Access to other AWS accounts**
- ❌ **Unnecessary service permissions**
- ❌ **Billing modification rights**

**This is the secure way to build ProfessionalNet on AWS!** 🔐 