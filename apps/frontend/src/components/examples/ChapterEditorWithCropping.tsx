// Example showing how to integrate ImageInputWithCropping into your existing ChapterEditor
// This demonstrates how to replace the current ImageInput usage with the enhanced version

import React, { useState } from 'react';
import ImageInputWithCropping, { CROP_PRESETS, FileRecord } from '../ImageInputWithCropping';

// This is how you would update your existing ChapterEditor to use the new cropping functionality

interface ChapterFormData {
  title: string;
  hero_file_id?: string | null;
  banner_file_id?: string | null;
  // ... other fields
}

const ChapterEditorWithCropping: React.FC = () => {
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    hero_file_id: null,
    banner_file_id: null
  });
  
  const [heroFile, setHeroFile] = useState<FileRecord | null>(null);
  const [bannerFile, setBannerFile] = useState<FileRecord | null>(null);

  // Handler for hero image - with cropping enabled and portrait aspect ratio
  const handleHeroChange = (fileRecord: FileRecord | null, url: string | null) => {
    console.log('Hero image changed:', { fileRecord, url });
    setHeroFile(fileRecord);
    setFormData(prev => ({
      ...prev,
      hero_file_id: fileRecord?.id || null
    }));
  };

  // Handler for banner image - with cropping enabled and landscape aspect ratio
  const handleBannerChange = (fileRecord: FileRecord | null, url: string | null) => {
    console.log('Banner image changed:', { fileRecord, url });
    setBannerFile(fileRecord);
    setFormData(prev => ({
      ...prev,
      banner_file_id: fileRecord?.id || null
    }));
  };

  return (
    <div className="space-y-6">
      {/* NEW: Visual Assets Card with Enhanced Cropping */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          🎨 Visual Assets (Enhanced)
        </h3>
        
        <div className="space-y-6">
          <div>
            {/* HERO IMAGE with Portrait Cropping */}
            <ImageInputWithCropping
              label="Hero Image"
              value={heroFile}
              onChange={handleHeroChange}
              placeholder="Chapter opening artwork"
              allowedTypes={['images']}
              enableCropping={true}
              cropConfig={CROP_PRESETS.portrait} // 3:4 ratio perfect for hero images
              cropPresets={['portrait', 'square', 'free']} // Allow user to choose
              previewSize="large" // Larger preview for hero images
            />
            <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mt-2">
              🎨 <strong>Hero Image:</strong> Displayed at the very beginning of the chapter. 
              Portrait orientation works best. You can crop and adjust the image before using it.
            </div>
          </div>

          <div>
            {/* BANNER IMAGE with Landscape Cropping */}
            <ImageInputWithCropping
              label="Banner Image"
              value={bannerFile}
              onChange={handleBannerChange}
              placeholder="Library card background"
              allowedTypes={['images']}
              enableCropping={true}
              cropConfig={CROP_PRESETS.banner} // 3:1 ratio perfect for banners
              cropPresets={['banner', 'landscape', 'free']} // Allow user to choose
              previewSize="medium"
            />
            <div className="text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md mt-2">
              🏰️ <strong>Banner Image:</strong> Used as background for chapter cards in the library. 
              Wide landscape orientation (3:1 ratio) recommended. Cropping tools help you get the perfect framing.
            </div>
          </div>
        </div>
      </div>

      {/* Example of advanced usage with custom crop handling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚙️ Advanced Example: Custom Crop Processing
        </h3>
        
        <ImageInputWithCropping
          label="Custom Processed Image"
          value={null}
          onChange={() => {}} // Handle final result
          enableCropping={true}
          cropConfig={CROP_PRESETS.square}
          onImageProcessed={async (croppedBlob: Blob, originalFile: FileRecord) => {
            // Custom processing - you could:
            // 1. Apply filters or watermarks
            // 2. Generate multiple sizes
            // 3. Upload to different storage locations
            // 4. Create thumbnails
            // 5. Add metadata
            
            console.log('Processing cropped image:', croppedBlob.size, 'bytes');
            console.log('Original file:', originalFile.name);
            
            // Example: Generate thumbnail and full-size versions
            try {
              // Your custom upload logic here
              const formData = new FormData();
              formData.append('croppedImage', croppedBlob, `cropped-${originalFile.name}`);
              
              // Example API call
              // const response = await fetch('/api/upload-cropped-image', {
              //   method: 'POST',
              //   body: formData
              // });
              
              console.log('Custom processing completed');
            } catch (error) {
              console.error('Custom processing failed:', error);
            }
          }}
        />
      </div>

      {/* Show current state for debugging */}
      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Current Form State:</h4>
        <pre className="text-xs text-gray-600 dark:text-gray-300">
          {JSON.stringify(
            {
              hero_file_id: formData.hero_file_id,
              banner_file_id: formData.banner_file_id,
              hero_file_name: heroFile?.name,
              banner_file_name: bannerFile?.name
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default ChapterEditorWithCropping;