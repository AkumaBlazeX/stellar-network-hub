# 🧪 Testing Guide for Upload & Persistence Issues

## **🔧 Step 1: Fix Syntax Errors**

The app should now work without syntax errors. If you still see errors:

1. **Stop the dev server** (Ctrl+C)
2. **Clear browser cache** and localStorage
3. **Restart the dev server**: `npm run dev`

## **🔍 Step 2: Test Upload API Directly**

### **A. Update the test script with your API URL:**

Edit `debug-upload.js` and replace:
```javascript
const API_BASE_URL = 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod';
```

With your actual API Gateway URL (check your `env.local` file or AWS console).

### **B. Run the test script:**
```bash
node debug-upload.js
```

**Expected Output:**
```
🧪 Testing upload API...
🌐 API Base URL: https://your-api-url...

📡 Test 1: Checking API endpoint...
✅ OPTIONS response: 200 OK

📤 Test 2: Testing actual upload...
📦 Test data: { fileName: 'test-image.jpg', fileType: 'image/jpeg', userId: 'test-user-123', fileContentLength: 16 }
📊 Upload response status: 200
✅ Upload successful!
📄 Response: {
  "message": "File uploaded successfully",
  "fileUrl": "https://d84l1y8p4kdic.cloudfront.net/test-user-123/1234567890-abc123.jpg",
  "fileName": "test-user-123/1234567890-abc123.jpg",
  "fileSize": 16
}
🔗 File URL: https://d84l1y8p4kdic.cloudfront.net/test-user-123/1234567890-abc123.jpg

🔍 Test 3: Checking if file is accessible...
📄 File response status: 200
📄 File accessible: true
```

## **🔍 Step 3: Test Frontend Upload**

### **A. Open Browser Console:**
1. Go to http://localhost:8080
2. Open Developer Tools (F12)
3. Go to Console tab
4. Clear console (Ctrl+L)

### **B. Test Upload Flow:**
1. **Login** to the app
2. **Go to Profile page**
3. **Click "Test Upload" button**
4. **Check console logs**

**Expected Console Output:**
```
🧪 Testing upload connection...
🧪 API Base URL: https://your-api-url...
🧪 Simple test result: true
🧪 Test data: { fileName: 'test-image.jpg', fileType: 'image/jpeg', fileContent: 'ZmFrZS1pbWFnZS1kYXRh', userId: 'test-user' }
✅ Upload test successful: { message: 'File uploaded successfully', fileUrl: 'https://...', fileName: '...', fileSize: 16 }
✅ File URL received: https://d84l1y8p4kdic.cloudfront.net/...
```

### **C. Test Cover Image Upload:**
1. **Click "Add cover" or "Change cover"**
2. **Select an image file**
3. **Click "Save"**
4. **Check console logs**

**Expected Console Output:**
```
📤 Uploading cover image...
✅ Cover image uploaded: https://d84l1y8p4kdic.cloudfront.net/...
📞 Calling updateProfile with coverImage: https://d84l1y8p4kdic.cloudfront.net/...
👤 Profile Update via AWS API: { coverImage: 'https://...' }
👤 Current user before update: { id: '...', fullName: '...', ... }
✅ Updated user from API: { id: '...', coverImage: 'https://...', ... }
🔍 updateProfile - userData.coverImage: https://d84l1y8p4kdic.cloudfront.net/...
🔍 updateProfile - user.coverImage: 
🔍 updateProfile - newUser.coverImage: https://d84l1y8p4kdic.cloudfront.net/...
✅ Final merged user object: { id: '...', coverImage: 'https://...', ... }
✅ User state and localStorage updated
✅ updateProfile result: true
🎉 Cover image update successful!
🔄 Forcing cover image state update...
🔄 Profile useEffect - User coverImage: https://d84l1y8p4kdic.cloudfront.net/...
```

## **🚨 Troubleshooting Guide**

### **If API Test Fails:**

**Error: "Cannot connect to upload API"**
- Check API Gateway URL in `env.local`
- Verify Lambda function is deployed
- Check CloudWatch logs for Lambda errors

**Error: "Upload test failed"**
- Check S3 bucket permissions
- Verify CloudFront distribution is working
- Check Lambda function logs

### **If Frontend Test Fails:**

**Error: "API endpoint not reachable"**
- Check CORS settings in API Gateway
- Verify API Gateway integration
- Check network connectivity

**Error: "Profile update failed"**
- Check DynamoDB permissions
- Verify user table exists
- Check Lambda function logs

### **If Cover Image Doesn't Persist:**

**Check localStorage:**
```javascript
// In browser console
console.log('Current user:', JSON.parse(localStorage.getItem('user')));
```

**Check user state:**
```javascript
// In browser console (if you have access to React DevTools)
// Look for the user object in the AuthContext
```

## **🔧 Common Fixes**

### **1. API Gateway CORS:**
Add these headers to your API Gateway:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST,OPTIONS
```

### **2. Lambda Environment Variables:**
Make sure your upload Lambda has:
```
CLOUDFRONT_URL=https://d84l1y8p4kdic.cloudfront.net
AWS_REGION=us-east-1
```

### **3. S3 Bucket Permissions:**
Your Lambda role needs:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::professionalnet-storage-26-07-2025/*"
        }
    ]
}
```

## **📞 Next Steps**

1. **Run the API test** and share the output
2. **Test the frontend** and share console logs
3. **Check CloudWatch logs** for any Lambda errors
4. **Verify S3 bucket** has the uploaded files
5. **Check CloudFront** distribution is working

Let me know what you see in the tests and I'll help you fix any issues! 🚀 

## **📦 Clean Upload Package Ready**

**File:** `lambda-functions/upload/upload-api-clean.zip` (2KB)

### **📋 Code Summary:**

**`index.js` (Router):**
- ✅ Uses AWS SDK v3 (`@aws-sdk/client-s3`)
- ✅ Fixed routing: `path.includes('upload')` (handles `/Dev/upload`)
- ✅ Proper CORS headers
- ✅ Detailed logging for debugging

**`uploadFile.js` (Handler):**
- ✅ Uses AWS SDK v3 (`@aws-sdk/client-s3`)
- ✅ S3 Bucket: `professionalnet-storage-26-07-2025`
- ✅ CloudFront URL: `https://d84l1y8p4kdic.cloudfront.net`
- ✅ File validation (type, size, required fields)
- ✅ Unique file naming with timestamp
- ✅ Proper error handling

## **🔧 Next Steps:**

1. **Upload to Lambda:**
   - Go to AWS Console → Lambda
   - Find `professionalnet-upload-api`
   - Upload `upload-api-clean.zip`
   - Save

2. **Test the upload:**
   ```bash
   node debug-upload.js
   ```

The code is now clean and should work with your Lambda Layer. The routing fix should resolve the 404 "Endpoint not found" error! 