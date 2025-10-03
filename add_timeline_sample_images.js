#!/usr/bin/env node

/**
 * Sample Timeline Images Setup Script
 * 
 * This script adds sample images to your timeline system.
 * Run this after applying the database migration to populate with sample content.
 * 
 * Usage: node add_timeline_sample_images.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

const sampleImages = {
  eras: {
    'Ancient Times': {
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
      image_alt: 'Ancient mystical landscape with golden light and ancient ruins'
    },
    'Classical Period': {
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&q=80',
      image_alt: 'Classical Greek temple with marble columns against blue sky'
    },
    'Medieval Era': {
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=800&h=600&fit=crop&q=80',
      image_alt: 'Medieval castle on a misty hill surrounded by forest'
    },
    'Renaissance': {
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
      image_alt: 'Renaissance architecture with ornate details and classical art'
    },
    'Modern Age': {
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80',
      image_alt: 'Modern cityscape with futuristic elements and digital effects'
    }
  },
  events: [
    {
      title: 'The Great Awakening',
      background_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=1200&h=800&fit=crop&q=80',
      image_alt: 'Mystical energy swirling around ancient ruins under starlit sky'
    },
    {
      title: 'The Foundation Wars',
      background_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&q=80',
      image_alt: 'Epic battle scene with ancient warriors in formation'
    },
    {
      title: 'The Dark Eclipse',
      background_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80',
      image_alt: 'Solar eclipse over a medieval landscape with dramatic lighting'
    },
    {
      title: 'The Crystal Resonance',
      background_image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop&q=80',
      image_alt: 'Glowing magical crystals in an ancient temple'
    },
    {
      title: 'The Age of Discovery',
      background_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop&q=80',
      image_alt: 'Explorers discovering new mystical lands with floating islands'
    }
  ],
  nestedEvents: [
    {
      title: 'Discovery of the First Crystal',
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2ac1?w=600&h=400&fit=crop&q=80',
      image_alt: 'Glowing crystal in ancient hands with mystical light'
    },
    {
      title: 'The Crystal\'s First Activation',
      image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80',
      image_alt: 'Crystal emanating magical energy with surrounding artifacts'
    },
    {
      title: 'The First Mage Council',
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop&q=80',
      image_alt: 'Ancient council meeting in a grand hall with mystical symbols'
    },
    {
      title: 'Opening of the First Portal',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80',
      image_alt: 'Magical portal opening with swirling energy and light'
    }
  ]
};

async function updateTimelineImages() {
  console.log('🎨 Adding sample images to timeline system...');

  try {
    // 1. Update timeline eras with images
    console.log('📸 Adding images to timeline eras...');
    
    for (const [eraName, imageData] of Object.entries(sampleImages.eras)) {
      const { data, error } = await supabase
        .from('timeline_eras')
        .update({
          image_url: imageData.image_url,
          image_alt: imageData.image_alt
        })
        .eq('name', eraName)
        .select();

      if (error) {
        console.error(`❌ Error updating ${eraName}:`, error);
      } else {
        console.log(`✅ Updated ${eraName} with image`);
      }
    }

    // 2. Update existing timeline events with images
    console.log('\n🖼️ Adding images to timeline events...');
    
    for (const eventImage of sampleImages.events) {
      const { data, error } = await supabase
        .from('timeline_events')
        .update({
          background_image: eventImage.background_image,
          image_alt: eventImage.image_alt
        })
        .eq('title', eventImage.title)
        .select();

      if (error) {
        console.warn(`⚠️ Could not update ${eventImage.title}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ${eventImage.title} with background image`);
      } else {
        console.log(`ℹ️ Event '${eventImage.title}' not found - may need to be created first`);
      }
    }

    // 3. Update nested events with images
    console.log('\n🎭 Adding images to nested events...');
    
    for (const nestedImage of sampleImages.nestedEvents) {
      const { data, error } = await supabase
        .from('timeline_nested_events')
        .update({
          image_url: nestedImage.image_url,
          image_alt: nestedImage.image_alt
        })
        .eq('title', nestedImage.title)
        .select();

      if (error) {
        console.warn(`⚠️ Could not update nested event ${nestedImage.title}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Updated nested event ${nestedImage.title} with image`);
      } else {
        console.log(`ℹ️ Nested event '${nestedImage.title}' not found - may need to be created first`);
      }
    }

    console.log('\n🎉 Timeline image setup complete!');
    console.log('\n📋 Summary:');
    console.log('   • Timeline eras now have representative images');
    console.log('   • Timeline events have hero background images');
    console.log('   • Nested events have thumbnail images');
    console.log('   • All images include proper alt text for accessibility');
    console.log('\n🚀 Visit https://www.zoroastervers.com/timelines to see the results!');
    
  } catch (error) {
    console.error('❌ Error setting up timeline images:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  updateTimelineImages()
    .then(() => {
      console.log('\n✨ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { updateTimelineImages };