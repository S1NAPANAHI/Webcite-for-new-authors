import express from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { supabaseAdmin } from '@zoroaster/shared/supabaseAdminClient.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

// List all files
router.get('/files', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('file_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload a new file
router.post('/files/upload', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePathInStorage = `general/${uniqueFileName}`; // Store in a 'general' bucket or similar

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('general_files') // Assuming a bucket named 'general_files' for general assets
      .upload(filePathInStorage, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file to storage.', details: uploadError.message });
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('general_files')
      .getPublicUrl(filePathInStorage);

    // Insert file metadata into the database
    const { data: fileAsset, error: insertError } = await supabaseAdmin
      .from('file_assets')
      .insert({
        storage_key: filePathInStorage,
        url: publicUrlData.publicUrl,
        filename: file.originalname,
        mime_type: file.mimetype,
        size_bytes: file.size,
        uploaded_by: req.user.id, // Assuming req.user.id is available from auth middleware
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return res.status(500).json({ error: 'Failed to save file metadata.', details: insertError.message });
    }

    res.status(201).json({
      message: 'File uploaded and metadata saved successfully.',
      fileAsset,
    });

  } catch (error) {
    console.error('Error in file upload handler:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Delete a file
router.delete('/files/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // First, get the file_asset record to get the storage_key
    const { data: fileAsset, error: fetchError } = await supabaseAdmin
      .from('file_assets')
      .select('storage_key')
      .eq('id', id)
      .single();

    if (fetchError || !fileAsset) {
      return res.status(404).json({ error: 'File asset not found.' });
    }

    // Delete from Supabase Storage
    const { error: deleteStorageError } = await supabaseAdmin.storage
      .from('general_files')
      .remove([fileAsset.storage_key]);

    if (deleteStorageError) {
      console.error('Supabase storage delete error:', deleteStorageError);
      // Continue to delete from DB even if storage delete fails, or handle as needed
    }

    // Delete from database
    const { error: deleteDbError } = await supabaseAdmin
      .from('file_assets')
      .delete()
      .eq('id', id);

    if (deleteDbError) {
      console.error('Database delete error:', deleteDbError);
      throw deleteDbError;
    }

    res.status(204).send();

  } catch (error) {
    console.error('Error in file delete handler:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;