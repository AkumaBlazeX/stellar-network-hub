const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

exports.handler = async (event) => {
    try {
        // Parse request body
        const { fileName, fileType, fileContent, userId } = JSON.parse(event.body || '{}');
        
        // Validate required fields
        if (!fileName || !fileType || !fileContent || !userId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'fileName, fileType, fileContent, and userId are required' })
            };
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(fileType)) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'Invalid file type. Only images are allowed.' })
            };
        }

        // Decode base64 content
        const fileBuffer = Buffer.from(fileContent, 'base64');
        
        // Validate file size (max 5MB)
        if (fileBuffer.length > 5 * 1024 * 1024) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST,OPTIONS'
                },
                body: JSON.stringify({ error: 'File size too large. Maximum 5MB allowed.' })
            };
        }

        // Generate unique file name
        const timestamp = Date.now();
        const fileExtension = fileName.split('.').pop();
        const uniqueFileName = `${userId}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

        // Upload to S3
        const uploadParams = {
            Bucket: 'professionalnet-storage',
            Key: uniqueFileName,
            Body: fileBuffer,
            ContentType: fileType,
            ACL: 'public-read',
            Metadata: {
                'uploaded-by': userId,
                'original-name': fileName
            }
        };

        const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({
                message: 'File uploaded successfully',
                fileUrl: `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${uploadParams.Key}`,
                fileName: uniqueFileName,
                fileSize: fileBuffer.length
            })
        };

    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST,OPTIONS'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 