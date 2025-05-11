const express = require('express');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();

// Generate a presigned URL for uploading
router.post('/presigned-url', auth, (req, res) => {
  try {
    const { fileType } = req.body;
    
    if (!fileType) {
      return res.status(400).json({ message: 'File type is required' });
    }
    
    const fileExtension = fileType.split('/')[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${req.user.id}/${fileName}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5 // URL expires in 5 minutes
    };
    
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error generating upload URL' });
      }
      
      res.json({
        uploadUrl: url,
        fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;