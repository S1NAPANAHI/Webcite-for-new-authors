-- Add sample Zoroasterverse products for the Sacred Treasury store
-- Migration: Add Zoroasterverse Sample Products
-- Created: 2025-09-29

-- Insert sample products
INSERT INTO products (
  id,
  name,
  subtitle,
  description,
  product_type,
  price_cents,
  status,
  is_available,
  is_premium,
  is_featured,
  active,
  cover_image_url,
  preview_url,
  created_at,
  updated_at
) VALUES
-- Fire Temple Chronicles - Featured Epic Fantasy
(
  'ftc-001',
  'The Fire Temple Chronicles',
  'An Epic Persian Fantasy Novel',
  'Journey through the sacred fire temples of ancient Persia in this epic tale of light versus darkness. Follow Darius, a young fire keeper, as he discovers his destiny in the eternal battle between Ahura Mazda and Angra Mainyu. This sweeping fantasy novel brings Persian mythology to life with rich worldbuilding and unforgettable characters.',
  'book',
  1299, -- $12.99
  'published',
  true,
  true,
  true,
  true,
  '/images/products/fire-temple-chronicles.jpg',
  '/preview/fire-temple-sample',
  NOW(),
  NOW()
),

-- Shahnameh Retold - Modern Epic Tales
(
  'shr-002',
  'Shahnameh Retold',
  'Modern Persian Epic Tales',
  'Experience the timeless stories of the Shahnameh reimagined for modern readers. From the legendary Rostam to the tragic tale of Sohrab, these beloved Persian epics are brought to life with contemporary storytelling while honoring their ancient roots.',
  'book',
  999, -- $9.99
  'published',
  true,
  false,
  false,
  true,
  '/images/products/shahnameh-retold.jpg',
  '/preview/shahnameh-sample',
  NOW(),
  NOW()
),

-- Zoroastrian Wisdom Guide
(
  'zwg-003',
  'Zoroastrian Wisdom Guide',
  'Philosophy and Teachings for Modern Life',
  'Discover the profound wisdom of Zarathustra in this comprehensive guide to Zoroastrian philosophy. Learn about the three pillars of Good Thoughts, Good Words, and Good Deeds, and how these ancient teachings can illuminate your path in the modern world.',
  'guide',
  799, -- $7.99
  'published',
  true,
  false,
  false,
  true,
  '/images/products/zoroastrian-wisdom.jpg',
  '/preview/wisdom-guide-sample',
  NOW(),
  NOW()
),

-- Persian Mythology Compendium
(
  'pmc-004',
  'Persian Mythology Compendium',
  'Complete Reference to Ancient Persian Myths',
  'The ultimate reference guide to Persian mythology, featuring detailed entries on gods, demons, heroes, and legendary creatures. From Ahura Mazda to the Simurgh, explore the rich mythological heritage that has inspired countless stories and continues to captivate readers worldwide.',
  'guide',
  1499, -- $14.99
  'published',
  true,
  true,
  false,
  true,
  '/images/products/mythology-compendium.jpg',
  '/preview/compendium-sample',
  NOW(),
  NOW()
),

-- Complete Collection Bundle
(
  'ccb-005',
  'Complete Collection Bundle',
  'Everything + Exclusive Bonus Content',
  'Get the entire Zoroasterverse collection at an incredible 40% savings! Includes all books, guides, character art, and exclusive bonus content including author commentary, deleted scenes, and a digital soundtrack inspired by Persian music.',
  'bundle',
  2999, -- $29.99 (40% off individual prices)
  'published',
  true,
  true,
  true,
  true,
  '/images/products/complete-collection.jpg',
  '/preview/collection-overview',
  NOW(),
  NOW()
),

-- Monthly Mythology Subscription
(
  'mms-006',
  'Monthly Mythology Subscription',
  'Unlimited Access to Growing Content Library',
  'Get unlimited access to the expanding Zoroasterverse library! New stories, guides, and exclusive content added monthly. Includes early access to new releases, subscriber-only content, and monthly mythology deep-dives.',
  'subscription',
  999, -- $9.99/month
  'published',
  true,
  true,
  false,
  true,
  '/images/products/monthly-subscription.jpg',
  '/preview/subscription-overview',
  NOW(),
  NOW()
),

-- Character Portraits Collection
(
  'cpc-007',
  'Character Portraits Collection',
  'Digital Art Pack - Heroes and Villains',
  'Beautiful digital artwork featuring the major characters from the Zoroasterverse. High-resolution portraits of Darius, Yasmin, Ahriman, and other beloved characters, perfect for wallpapers or printing. Includes concept art and character development sketches.',
  'art',
  599, -- $5.99
  'published',
  true,
  false,
  false,
  true,
  '/images/products/character-portraits.jpg',
  '/preview/art-gallery',
  NOW(),
  NOW()
),

-- Free Sample Chapter
(
  'fsc-008',
  'Sample Chapter: The Awakening',
  'Free Introduction to the Zoroasterverse',
  'Discover the Zoroasterverse with this free sample chapter from The Fire Temple Chronicles. Meet Darius as he begins his journey and get a taste of the epic adventure that awaits. Perfect introduction for new readers!',
  'book',
  0, -- Free
  'published',
  true,
  false,
  false,
  true,
  '/images/products/sample-chapter.jpg',
  '/read/sample-chapter',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert product variants (different formats/editions)
INSERT INTO product_variants (
  id,
  product_id,
  name,
  description,
  price_amount,
  compare_at_amount,
  sku,
  format,
  active,
  created_at,
  updated_at
) VALUES
-- Fire Temple Chronicles variants
('ftc-001-ebook', 'ftc-001', 'eBook Edition', 'Digital eBook format', 1299, NULL, 'FTC-EBOOK-001', 'ebook', true, NOW(), NOW()),
('ftc-001-audio', 'ftc-001', 'Audiobook Edition', 'Professional narration', 1599, 1799, 'FTC-AUDIO-001', 'audiobook', true, NOW(), NOW()),

-- Shahnameh Retold variants
('shr-002-ebook', 'shr-002', 'eBook Edition', 'Digital eBook format', 999, NULL, 'SHR-EBOOK-002', 'ebook', true, NOW(), NOW()),

-- Zoroastrian Wisdom Guide variants
('zwg-003-ebook', 'zwg-003', 'eBook Edition', 'Digital eBook format', 799, NULL, 'ZWG-EBOOK-003', 'ebook', true, NOW(), NOW()),
('zwg-003-print', 'zwg-003', 'Print Edition', 'Physical paperback', 1299, NULL, 'ZWG-PRINT-003', 'paperback', true, NOW(), NOW()),

-- Persian Mythology Compendium variants
('pmc-004-ebook', 'pmc-004', 'eBook Edition', 'Digital eBook format', 1499, NULL, 'PMC-EBOOK-004', 'ebook', true, NOW(), NOW()),
('pmc-004-print', 'pmc-004', 'Hardcover Edition', 'Premium hardcover with illustrations', 2499, NULL, 'PMC-HARD-004', 'hardcover', true, NOW(), NOW()),

-- Complete Collection Bundle (single variant)
('ccb-005-digital', 'ccb-005', 'Digital Collection', 'All digital formats included', 2999, 4999, 'CCB-DIGITAL-005', 'bundle', true, NOW(), NOW()),

-- Monthly Subscription variants
('mms-006-monthly', 'mms-006', 'Monthly Plan', 'Billed monthly', 999, NULL, 'MMS-MONTH-006', 'subscription', true, NOW(), NOW()),
('mms-006-yearly', 'mms-006', 'Yearly Plan', 'Billed annually (2 months free)', 9999, 11988, 'MMS-YEAR-006', 'subscription', true, NOW(), NOW()),

-- Character Portraits variants
('cpc-007-digital', 'cpc-007', 'Digital Download', 'High-res digital files', 599, NULL, 'CPC-DIGITAL-007', 'digital', true, NOW(), NOW()),

-- Free Sample (single variant)
('fsc-008-free', 'fsc-008', 'Free Sample', 'Free digital sample', 0, NULL, 'FSC-FREE-008', 'ebook', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO product_reviews (
  id,
  product_id,
  user_id,
  rating,
  title,
  content,
  verified_purchase,
  helpful_count,
  created_at,
  updated_at
) VALUES
-- Fire Temple Chronicles reviews
('rev-001', 'ftc-001', NULL, 5, 'Absolutely captivating!', 'This book transported me to ancient Persia. The world-building is incredible and the characters feel so real. Cannot wait for the sequel!', true, 12, NOW() - INTERVAL '2 weeks', NOW()),
('rev-002', 'ftc-001', NULL, 5, 'Persian mythology at its finest', 'As someone fascinated by Zoroastrian history, this book exceeded all expectations. The author clearly did their research.', true, 8, NOW() - INTERVAL '1 week', NOW()),
('rev-003', 'ftc-001', NULL, 4, 'Great fantasy read', 'Engaging story with rich cultural elements. A few pacing issues but overall highly recommended.', true, 5, NOW() - INTERVAL '3 days', NOW()),

-- Shahnameh Retold reviews
('rev-004', 'shr-002', NULL, 5, 'Beautiful retelling', 'These classic stories are brought to life in a way that feels both ancient and modern. Perfect for introducing young readers to Persian culture.', true, 6, NOW() - INTERVAL '1 week', NOW()),
('rev-005', 'shr-002', NULL, 4, 'Nostalgic and wonderful', 'Reminded me of the stories my grandmother used to tell. Beautifully written.', true, 4, NOW() - INTERVAL '5 days', NOW()),

-- Zoroastrian Wisdom Guide reviews
('rev-006', 'zwg-003', NULL, 5, 'Life-changing wisdom', 'The three pillars philosophy has genuinely improved my daily life. Highly practical and inspiring.', true, 9, NOW() - INTERVAL '10 days', NOW()),
('rev-007', 'zwg-003', NULL, 4, 'Insightful and accessible', 'Complex philosophical concepts explained in an easy-to-understand way. Great introduction to Zoroastrianism.', true, 3, NOW() - INTERVAL '1 week', NOW()),

-- Persian Mythology Compendium reviews
('rev-008', 'pmc-004', NULL, 5, 'The ultimate reference', 'Every mythology enthusiast needs this book. Comprehensive, well-researched, and beautifully illustrated.', true, 7, NOW() - INTERVAL '2 weeks', NOW()),

-- Complete Collection Bundle reviews
('rev-009', 'ccb-005', NULL, 5, 'Incredible value!', 'Getting everything in one bundle was perfect. The bonus content is amazing - especially the author commentary!', true, 15, NOW() - INTERVAL '1 week', NOW()),

-- Character Portraits reviews
('rev-010', 'cpc-007', NULL, 5, 'Stunning artwork', 'These portraits are absolutely gorgeous. The artist really captured the essence of each character.', true, 8, NOW() - INTERVAL '4 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Add some tags for better categorization
INSERT INTO product_tags (product_id, tag) VALUES
('ftc-001', 'fantasy'),
('ftc-001', 'persian-mythology'),
('ftc-001', 'epic'),
('ftc-001', 'zoroastrianism'),
('shr-002', 'shahnameh'),
('shr-002', 'persian-classics'),
('shr-002', 'retelling'),
('zwg-003', 'philosophy'),
('zwg-003', 'wisdom'),
('zwg-003', 'spirituality'),
('zwg-003', 'zoroastrianism'),
('pmc-004', 'mythology'),
('pmc-004', 'reference'),
('pmc-004', 'persian-culture'),
('ccb-005', 'bundle'),
('ccb-005', 'complete-collection'),
('ccb-005', 'best-value'),
('mms-006', 'subscription'),
('mms-006', 'unlimited-access'),
('cpc-007', 'art'),
('cpc-007', 'characters'),
('cpc-007', 'digital-art'),
('fsc-008', 'free'),
('fsc-008', 'sample'),
('fsc-008', 'introduction')
ON CONFLICT (product_id, tag) DO NOTHING;

-- Update statistics
SELECT 'Sample Zoroasterverse products added successfully!' as message;