const AWS = require('aws-sdk');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'zoroasterverse-ebooks';

/**
 * Generate a pre-signed URL for secure file download
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type of the file
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Pre-signed URL
 */
async function generateDownloadUrl(key, contentType, expiresIn = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentType: contentType,
      ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    
    console.log(`🔗 Generated download URL for ${key}, expires in ${expiresIn} seconds`);
    return url;
    
  } catch (error) {
    console.error('❌ Error generating download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Generate a pre-signed URL for file preview (inline viewing)
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type of the file
 * @param {number} expiresIn - Expiration time in seconds (default: 15 minutes)
 * @returns {Promise<string>} Pre-signed URL
 */
async function generatePreviewUrl(key, contentType, expiresIn = 900) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ResponseContentType: contentType,
      ResponseContentDisposition: 'inline',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    
    console.log(`👁️ Generated preview URL for ${key}, expires in ${expiresIn} seconds`);
    return url;
    
  } catch (error) {
    console.error('❌ Error generating preview URL:', error);
    throw new Error('Failed to generate preview URL');
  }
}

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type of the file
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Upload result
 */
async function uploadFile(fileBuffer, key, contentType, metadata = {}) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: metadata,
      ServerSideEncryption: 'AES256', // Enable server-side encryption
    });

    const result = await s3Client.send(command);
    
    console.log(`📤 File uploaded successfully: ${key}`);
    return {
      key,
      etag: result.ETag,
      versionId: result.VersionId
    };
    
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    throw new Error('Failed to upload file to S3');
  }
}

/**
 * Delete a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} Success status
 */
async function deleteFile(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    
    console.log(`🗑️ File deleted successfully: ${key}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error deleting file:', error);
    throw new Error('Failed to delete file from S3');
  }
}

/**
 * Check if a file exists in S3
 * @param {string} key - S3 object key
 * @returns {Promise<boolean>} File existence status
 */
async function fileExists(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
    
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      return false;
    }
    throw error;
  }
}

/**
 * Get file metadata from S3
 * @param {string} key - S3 object key
 * @returns {Promise<Object>} File metadata
 */
async function getFileMetadata(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const result = await s3Client.send(command);
    
    return {
      key,
      contentType: result.ContentType,
      contentLength: result.ContentLength,
      lastModified: result.LastModified,
      etag: result.ETag,
      metadata: result.Metadata
    };
    
  } catch (error) {
    console.error('❌ Error getting file metadata:', error);
    throw new Error('Failed to get file metadata');
  }
}

/**
 * Generate a secure key for file storage
 * @param {string} productId - Product ID
 * @param {string} format - File format (pdf, epub, mobi)
 * @param {string} filename - Original filename
 * @returns {string} Secure S3 key
 */
function generateSecureKey(productId, format, filename) {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  
  return `products/${productId}/${format}/${timestamp}-${randomId}.${extension}`;
}

/**
 * Validate file format and size
 * @param {string} format - File format
 * @param {number} size - File size in bytes
 * @returns {Object} Validation result
 */
function validateFile(format, size) {
  const allowedFormats = ['pdf', 'epub', 'mobi'];
  const maxSize = 100 * 1024 * 1024; // 100MB limit
  
  const isValidFormat = allowedFormats.includes(format.toLowerCase());
  const isValidSize = size <= maxSize;
  
  return {
    isValid: isValidFormat && isValidSize,
    errors: {
      format: isValidFormat ? null : `Format ${format} is not allowed. Allowed formats: ${allowedFormats.join(', ')}`,
      size: isValidSize ? null : `File size ${(size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of 100MB`
    }
  };
}

module.exports = {
  generateDownloadUrl,
  generatePreviewUrl,
  uploadFile,
  deleteFile,
  fileExists,
  getFileMetadata,
  generateSecureKey,
  validateFile,
  BUCKET_NAME
};
