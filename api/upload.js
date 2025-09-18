const path = require('path');
const Busboy = require('busboy');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid'); // For generating unique file names

// Load environment variables
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../apps/backend/.env') });
} catch (e) {
  require('dotenv').config();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to create/update product in the database
// This will need to be implemented or integrated with existing product logic
async function createProductEntry(productData) {
  // For now, this is a placeholder.
  // In a real scenario, you would call a function from your shared package
  // or directly interact with Supabase to insert into the 'products' table.
  console.log('Attempting to create product entry with:', productData);
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name: productData.title,
        description: productData.description,
        product_type: productData.product_type,
        is_premium: productData.is_premium === 'true', // Convert string to boolean
        isbn: productData.isbn,
        page_count: parseInt(productData.page_count) || null,
        word_count: parseInt(productData.word_count) || null,
        cover_image_url: productData.cover_image_url,
        file_key: productData.file_key, // Supabase Storage path
        file_type: productData.file_type,
        file_size_bytes: productData.file_size_bytes,
        // Assuming 'author_id' will be handled by the admin context or a separate 'works' entry
        // For now, we'll omit it or set a default/null
      },
    ])
    .select();

  if (error) {
    console.error('Error creating product entry:', error);
    throw error;
  }
  return data[0];
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const busboy = Busboy({ headers: req.headers });
  const fields = {};
  let fileBuffer = null;
  let fileInfo = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const chunks = [];
    file.on('data', (chunk) => {
      chunks.push(chunk);
    });
    file.on('end', () => {
      fileBuffer = Buffer.concat(chunks);
      fileInfo = { filename: filename.filename, mimetype, encoding };
    });
  });

  busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
    fields[fieldname] = val;
  });

  busboy.on('finish', async () => {
    if (!fileBuffer) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileExtension = path.extname(fileInfo.filename);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePathInStorage = `epubs/${uniqueFileName}`; // Path within the 'epubs' bucket

    try {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('epubs')
        .upload(filePathInStorage, fileBuffer, {
          contentType: fileInfo.mimetype,
          upsert: false, // Do not overwrite if file exists
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload file to storage.', details: uploadError.message });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('epubs')
        .getPublicUrl(filePathInStorage);

      const productData = {
        title: fields.title || fileInfo.filename,
        author: fields.author || 'Unknown',
        description: fields.description || '',
        product_type: fields.product_type || 'digital_book',
        is_premium: fields.is_premium || 'false',
        isbn: fields.isbn || null,
        page_count: fields.page_count || null,
        word_count: fields.word_count || null,
        cover_image_url: fields.cover_image_url || null,
        file_key: filePathInStorage,
        file_type: fileInfo.mimetype,
        file_size_bytes: fileBuffer.length,
        public_url: publicUrlData.publicUrl, // Store public URL if needed
      };

      const newProduct = await createProductEntry(productData);

      res.status(201).json({
        message: 'File uploaded and product created successfully.',
        product: newProduct,
        fileUrl: publicUrlData.publicUrl,
      });

    } catch (error) {
      console.error('Error in upload handler:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

  req.pipe(busboy);
};