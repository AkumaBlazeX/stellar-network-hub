# 🗑️ API Gateway DELETE Method Setup

## 🔧 Step-by-Step Configuration

### 1. Go to API Gateway Console
- Open AWS Console
- Navigate to API Gateway
- Select your API: `professionalnet-api`

### 2. Find the Posts Resource
- Click on "Resources" in the left sidebar
- Look for `/posts/{postId}` resource
- If it doesn't exist, create it:
  - Click "Actions" → "Create Resource"
  - Resource Name: `{postId}`
  - Resource Path: `{postId}`
  - Enable API Gateway CORS: ✅ Yes
  - Click "Create Resource"

### 3. Add DELETE Method
- Select the `/posts/{postId}` resource
- Click "Actions" → "Create Method"
- Select "DELETE" from the dropdown
- Click the checkmark ✅
- Configure the integration:
  - Integration type: **Lambda Function**
  - Use Lambda Proxy integration: ✅ **Yes** (important!)
  - Lambda Function: `professionalnet-posts-api`
  - Click "Save"

### 4. Deploy the API
- Click "Actions" → "Deploy API"
- Deployment stage: `Dev`
- Click "Deploy"

### 5. Test the Delete Functionality
After deployment, test the delete functionality in your app:

1. **Create a test post**
2. **Click the three dots (⋮) on the post**
3. **Select "Delete post"**
4. **Confirm deletion**
5. **Check console logs** for API responses

## 🧪 Manual API Test

You can also test the API directly:

```bash
# First, create a test post
curl -X POST "https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": "test-user-123",
    "content": "Test post for deletion",
    "authorName": "Test User",
    "authorPicture": ""
  }'

# Then delete it (replace {postId} with the actual post ID)
curl -X DELETE "https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com/Dev/posts/{postId}" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "{postId}",
    "userId": "test-user-123"
  }'
```

## 🔍 Troubleshooting

### If DELETE method returns 404:
- Make sure the `/posts/{postId}` resource exists
- Verify the DELETE method is properly configured
- Check that the Lambda integration is set to "Lambda Proxy"

### If DELETE method returns 500:
- Check CloudWatch logs for the Lambda function
- Verify the `deletePost.js` file is included in the deployment package
- Make sure the Lambda function has proper DynamoDB permissions

### If posts still show after deletion:
- Check browser console for API errors
- Verify the frontend is calling `onDelete(post.id)` correctly
- Check if the post count is being decremented

## ✅ Success Indicators

When properly configured, you should see:
- ✅ DELETE requests return 200 status
- ✅ Posts disappear from the feed immediately
- ✅ Post count decrements
- ✅ Success toast notification
- ✅ No console errors 