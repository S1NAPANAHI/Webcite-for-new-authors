-- Add sample products for the Zoroasterverse shop
-- This migration creates sample books, guides, and bundles with Persian mythology themes

-- Insert sample products
INSERT INTO products (
  id,
  slug,
  name,
  title,
  subtitle,
  description,
  product_type,
  cover_image_url,
  is_bundle,
  is_subscription,
  is_premium,
  is_featured,
  is_digital,
  is_available,
  active,
  status,
  published_at,
  price_cents,
  metadata,
  created_at,
  updated_at
) VALUES
-- Featured Books
(
  gen_random_uuid(),
  'fire-temple-chronicles',
  'The Fire Temple Chronicles',
  'The Fire Temple Chronicles: Volume I',
  'The Rise of Ahriman',
  'In the ancient land of Persia, where the sacred fires burn eternal, a young priest discovers a darkness that threatens to consume all light. Follow the epic tale of good versus evil as ancient Zoroastrian prophecies come to life in this thrilling fantasy adventure.',
  'book',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  'published',
  NOW(),
  1299, -- $12.99
  '{"pages": 420, "words": 95000, "language": "English", "isbn": "978-1-234567-89-0", "mythology_tags": ["Ahriman", "Ahura Mazda", "Fire Temple", "Zoroastrianism"]}',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'shahnameh-retold',
  'Shahnameh Retold: Modern Tales',
  'Shahnameh Retold: Modern Tales of Ancient Heroes',
  'Epic Stories for the Digital Age',
  'Experience the timeless stories of the Shahnameh reimagined for contemporary readers. From Rostam mighty deeds to the tragic tale of Sohrab, these beloved Persian epic tales are brought to life with stunning prose and modern sensibilities.',
  'book',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  false,
  false,
  false,
  true,
  true,
  true,
  true,
  'published',
  NOW(),
  999, -- $9.99
  '{"pages": 320, "words": 78000, "language": "English", "mythology_tags": ["Shahnameh", "Rostam", "Sohrab", "Persian Epic"]}',
  NOW(),
  NOW()
),

-- Study Guides
(
  gen_random_uuid(),
  'zoroastrian-wisdom-guide',
  'Zoroastrian Wisdom: A Modern Guide',
  'Zoroastrian Wisdom: A Modern Guide to Ancient Teachings',
  'Good Thoughts, Good Words, Good Deeds',
  'Discover the profound teachings of Zarathustra and how they apply to modern life. This comprehensive guide explores Zoroastrian philosophy, ethics, and spiritual practices with practical applications for contemporary seekers.',
  'guide',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
  false,
  false,
  false,
  false,
  true,
  true,
  true,
  'published',
  NOW(),
  799, -- $7.99
  '{"pages": 180, "words": 45000, "language": "English", "mythology_tags": ["Zarathustra", "Zoroastrianism", "Philosophy", "Ethics"]}',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'persian-mythology-compendium',
  'Persian Mythology Compendium',
  'Persian Mythology Compendium: Gods, Heroes & Legends',
  'Complete Reference Guide',
  'An exhaustive reference guide to Persian mythology, featuring detailed profiles of gods, heroes, creatures, and legendary tales. Perfect for writers, researchers, and mythology enthusiasts seeking authentic Persian lore.',
  'guide',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  false,
  false,
  true,
  false,
  true,
  true,
  true,
  'published',
  NOW(),
  1499, -- $14.99
  '{"pages": 280, "words": 65000, "language": "English", "mythology_tags": ["Persian Mythology", "Reference", "Gods", "Heroes"]}',
  NOW(),
  NOW()
),

-- Bundles
(
  gen_random_uuid(),
  'complete-zoroasterverse-collection',
  'Complete Zoroasterverse Collection',
  'Complete Zoroasterverse Collection: Books & Guides',
  'Everything You Need for Your Persian Mythology Journey',
  'Get the complete Zoroasterverse experience with this exclusive bundle containing all our published books, study guides, and bonus content. Save 40% compared to individual purchases and gain access to exclusive behind-the-scenes materials.',
  'bundle',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  true,
  false,
  true,
  true,
  true,
  true,
  true,
  'published',
  NOW(),
  2999, -- $29.99 (normally $45+)
  '{"includes": ["All Books", "All Guides", "Character Art", "Bonus Content"], "savings": "40%", "mythology_tags": ["Complete Collection", "Bundle"]}',
  NOW(),
  NOW()
),

-- Subscription
(
  gen_random_uuid(),
  'monthly-mythology-subscription',
  'Monthly Mythology Subscription',
  'Monthly Mythology Subscription: Premium Access',
  'Unlimited Access to Growing Library',
  'Join our monthly subscription for unlimited access to our growing library of Persian mythology content, early access to new releases, exclusive subscriber-only content, and monthly mythology deep-dives.',
  'subscription',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  false,
  true,
  true,
  false,
  true,
  true,
  true,
  'published',
  NOW(),
  999, -- $9.99/month
  '{"billing": "monthly", "includes": ["All Content", "Early Access", "Exclusive Content", "Monthly Deep-dives"], "mythology_tags": ["Subscription", "Premium"]}',
  NOW(),
  NOW()
),

-- Character Art Collections
(
  gen_random_uuid(),
  'character-portraits-collection',
  'Character Portraits Collection',
  'Character Portraits Collection: Digital Art',
  'Beautiful Illustrations of Zoroasterverse Characters',
  'A stunning collection of high-resolution character portraits featuring the heroes and villains of the Zoroasterverse. Perfect for fans, artists, and anyone who appreciates beautiful fantasy art inspired by Persian mythology.',
  'guide', -- Using 'guide' for art collections
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
  false,
  false,
  false,
  false,
  true,
  true,
  true,
  'published',
  NOW(),
  599, -- $5.99
  '{"type": "artwork", "count": 25, "resolution": "4K", "format": "PNG", "mythology_tags": ["Character Art", "Digital Art", "Illustrations"]}',
  NOW(),
  NOW()
),

-- Free Sample
(
  gen_random_uuid(),
  'fire-temple-sample',
  'Fire Temple Chronicles - Free Sample',
  'Fire Temple Chronicles: Chapter One (Free)',
  'Discover the World of Zoroasterverse',
  'Get a taste of the Zoroasterverse with this free sample chapter from The Fire Temple Chronicles. Experience the rich world-building and compelling storytelling that brings Persian mythology to life.',
  'book',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  false,
  false,
  false,
  false,
  true,
  true,
  true,
  'published',
  NOW(),
  0, -- Free
  '{"pages": 25, "words": 6000, "language": "English", "sample_of": "fire-temple-chronicles", "mythology_tags": ["Sample", "Free", "Fire Temple"]}',
  NOW(),
  NOW()
);

-- Add product variants for the main products
INSERT INTO product_variants (
  id,
  product_id,
  name,
  description,
  price_amount,
  price_currency,
  is_digital,
  is_default,
  available_for_sale,
  option1,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  p.id,
  CASE 
    WHEN p.product_type = 'book' THEN 'Digital Edition'
    WHEN p.product_type = 'guide' THEN 'Digital Guide'
    WHEN p.product_type = 'bundle' THEN 'Complete Bundle'
    WHEN p.product_type = 'subscription' THEN 'Monthly Plan'
    ELSE 'Standard'
  END,
  'Standard digital format with lifetime access',
  CASE 
    WHEN p.price_cents = 0 THEN 0
    ELSE p.price_cents
  END,
  'USD',
  true,
  true,
  true,
  CASE 
    WHEN p.product_type = 'book' THEN 'PDF + EPUB'
    WHEN p.product_type = 'guide' THEN 'PDF'
    WHEN p.product_type = 'bundle' THEN 'All Formats'
    WHEN p.product_type = 'subscription' THEN 'Digital Access'
    ELSE 'Digital'
  END,
  NOW(),
  NOW()
FROM products p
WHERE p.name LIKE '%Fire Temple%' OR p.name LIKE '%Shahnameh%' OR p.name LIKE '%Wisdom%' OR p.name LIKE '%Compendium%' OR p.name LIKE '%Collection%' OR p.name LIKE '%Subscription%' OR p.name LIKE '%Sample%';

-- Add some sample reviews
INSERT INTO product_reviews (
  id,
  user_id,
  product_id,
  rating,
  title,
  review_text,
  is_verified_purchase,
  is_approved,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1), -- Use first user, or create a dummy one
  p.id,
  CASE 
    WHEN p.name LIKE '%Fire Temple%' THEN 5
    WHEN p.name LIKE '%Shahnameh%' THEN 4
    WHEN p.name LIKE '%Wisdom%' THEN 5
    WHEN p.name LIKE '%Compendium%' THEN 4
    WHEN p.name LIKE '%Collection%' THEN 5
    ELSE 4
  END,
  CASE 
    WHEN p.name LIKE '%Fire Temple%' THEN 'Absolutely Captivating'
    WHEN p.name LIKE '%Shahnameh%' THEN 'Beautiful Retelling'
    WHEN p.name LIKE '%Wisdom%' THEN 'Profound and Practical'
    WHEN p.name LIKE '%Compendium%' THEN 'Comprehensive Reference'
    WHEN p.name LIKE '%Collection%' THEN 'Incredible Value'
    ELSE 'Great Read'
  END,
  CASE 
    WHEN p.name LIKE '%Fire Temple%' THEN 'This book transported me to ancient Persia like no other fantasy novel has. The attention to authentic Zoroastrian mythology is remarkable, and the characters feel so real and compelling. Cannot wait for the next volume!'
    WHEN p.name LIKE '%Shahnameh%' THEN 'A wonderful modernization of the classic Persian epic. The author has done an excellent job making these ancient stories accessible to contemporary readers while preserving their cultural significance.'
    WHEN p.name LIKE '%Wisdom%' THEN 'As someone interested in philosophy and spirituality, this guide opened my eyes to the profound wisdom of Zarathustra. The practical applications for modern life are genuinely helpful.'
    WHEN p.name LIKE '%Compendium%' THEN 'An invaluable resource for anyone interested in Persian mythology. Well-researched, comprehensive, and beautifully presented. Perfect for writers and mythology enthusiasts.'
    WHEN p.name LIKE '%Collection%' THEN 'Fantastic bundle deal! Getting all the content plus the bonus materials at this price is incredible value. The character art is absolutely stunning.'
    ELSE 'Really enjoyed this content. Well worth the investment.'
  END,
  true,
  true,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '30 days'
FROM products p
WHERE p.name NOT LIKE '%Sample%' AND p.name NOT LIKE '%Subscription%'
LIMIT 5;