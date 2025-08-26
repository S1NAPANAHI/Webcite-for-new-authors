const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/html'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, TXT, and HTML are allowed.'), false);
    }
  },
});

// Middleware to verify JWT and get user
const verifyUser = async (req, res, next) => {
  console.log('--- Verifying User ---');
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    console.log('Error: No Authorization header provided.');
    return res.status(401).json({ error: 'Authorization header missing.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  if (!token) {
    console.log('Error: Token not found in Authorization header.');
    return res.status(401).json({ error: 'Bearer token missing.' });
  }

  try {
    // Use the admin client to get user by access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.log('Error: Invalid or expired token.', userError);
      return res.status(401).json({ error: 'Invalid or expired authentication token.' });
    }

    // Attach user to request object
    req.user = user;
    console.log('User verified. ID:', user.id);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Authentication failed.', details: error.message });
  }
};

// Helper function to check active subscription
const checkActiveSubscription = async (userId) => {
  console.log('Checking active subscription for user:', userId);
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .or(`end_date.gte.${new Date().toISOString()},end_date.is.null`); // Active if end_date is in future or null

  if (error) {
    console.error('Error checking subscription:', error);
    return { isActive: false, subscription: null };
  }

  return { isActive: data && data.length > 0, subscription: data ? data[0] : null };
};


// POST /api/chapters/upload - Admin upload endpoint
router.post('/upload', verifyUser, upload.single('file'), async (req, res) => {
  console.log('--- Chapter Upload Request Received ---');
  try {
    // Ensure user is an admin (basic check for now)
    // In a real app, you'd have roles in user metadata or a separate roles table
    if (!req.user) { // req.user is set by verifyUser middleware
      console.log('Error: User not found in request after verification.');
      return res.status(401).json({ error: 'User not authenticated.' });
    }
    // For a more robust admin check:
    // if (req.user.app_metadata.roles && !req.user.app_metadata.roles.includes('admin')) {
    //   return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    // }
    console.log('User is authenticated for upload. User ID:', req.user.id);


    if (!req.file) {
      console.log('Error: No file uploaded.');
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    console.log('File received:', req.file.originalname);

    const { title, chapter_number, book_id, is_published } = req.body;
    console.log('Request Body:', { title, chapter_number, book_id, is_published });

    if (!title || !chapter_number || !book_id) {
      console.log('Error: Missing required chapter metadata.');
      return res.status(400).json({ error: 'Missing required chapter metadata.' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${book_id}/${chapter_number}-${title.replace(/\s/g, '_')}${path.extname(req.file.originalname)}`;
    const filePathInStorage = `chapters/${fileName}`;
    console.log('Attempting to upload to Supabase Storage:', filePathInStorage);

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('chapters') // Your Supabase Storage bucket name
      .upload(filePathInStorage, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: true, // Changed to true to overwrite existing files
      });

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file to storage.', details: uploadError.message });
    }
    console.log('File uploaded to Supabase Storage successfully. Path:', uploadData.path);

    // Placeholder for file processing (e.g., word count, preview generation)
    const word_count = Math.floor(fileBuffer.length / 5);
    const estimated_read_time = Math.ceil(word_count / 200);
    const preview_text = fileBuffer.toString('utf8').substring(0, 500);
    console.log('File processing (mock) complete.');

    // Insert chapter record into database
    console.log('Attempting to insert chapter record into database.');
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .insert({
        title,
        chapter_number: parseInt(chapter_number),
        book_id,
        file_path: uploadData.path,
        file_size: req.file.size,
        file_type: req.file.mimetype,
        is_published: is_published === 'true',
        preview_text,
        word_count,
        estimated_read_time,
        admin_id: req.user.id, // Use verified user ID
      })
      .select();

    if (chapterError) {
      console.error('Supabase DB Insert Error:', chapterError);
      return res.status(500).json({ error: 'Failed to create chapter record in database.', details: chapterError.message });
    }
    console.log('Chapter record inserted successfully. Chapter ID:', chapterData[0].id);

    res.status(201).json({ message: 'Chapter uploaded and recorded successfully.', chapter: chapterData[0] });
    console.log('--- Chapter Upload Request Finished Successfully ---');

  } catch (error) {
    console.error('Chapter Upload Error (Catch Block):', error);
    res.status(500).json({ error: 'An unexpected error occurred during chapter upload.', details: error.message });
    console.log('--- Chapter Upload Request Finished with Error ---');
  }
});

// GET /api/chapters/secure/:chapterId - Generate pre-signed URL for chapter content
router.get('/secure/:chapterId', verifyUser, async (req, res) => { // Added verifyUser middleware
  console.log('--- Secure Chapter URL Request Received ---'); // Corrected newline
  try {
    const { chapterId } = req.params;
    // User is already verified by verifyUser middleware, req.user is available
    const userId = req.user.id;
    console.log('User ID for secure access:', userId);

    const { isActive } = await checkActiveSubscription(userId);
    if (!isActive) {
      console.log('Error: Active subscription required.');
      return res.status(403).json({ error: 'Active subscription required to access this chapter.' });
    }
    console.log('User has active subscription.');
    
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('file_path, is_published')
      .eq('id', chapterId)
      .single();

    if (chapterError || !chapter) {
      console.log('Error: Chapter not found.', chapterError);
      return res.status(404).json({ error: 'Chapter not found.' });
    }
    console.log('Chapter found. File path:', chapter.file_path);

    if (!chapter.is_published) {
      console.log('Error: Chapter is not published.');
      return res.status(403).json({ error: 'Chapter is not published.' });
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('chapters')
      .createSignedUrl(chapter.file_path, 3600); // URL valid for 1 hour (3600 seconds)

    if (signedUrlError) {
      console.error('Supabase Signed URL Error:', signedUrlError);
      return res.status(500).json({ error: 'Failed to generate signed URL.', details: signedUrlData.message });
    }
    console.log('Signed URL generated successfully.');

    res.json({ signedUrl: signedUrlData.signedUrl });
    console.log('--- Secure Chapter URL Request Finished Successfully ---');

  } catch (error) {
    console.error('Secure Chapter URL Error (Catch Block):', error);
    res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
    console.log('--- Secure Chapter URL Request Finished with Error ---');
  }
});

module.exports = router;