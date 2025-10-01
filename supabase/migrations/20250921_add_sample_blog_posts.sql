-- Add sample blog posts to your EXISTING blog schema
-- This migration works with your current blog_posts, blog_categories, and blog_tags tables
-- Run this in Supabase SQL Editor

-- First, ensure we have some basic categories (your schema already supports this)
INSERT INTO blog_categories (name, slug, description, color) VALUES
    ('Philosophy', 'philosophy', 'Philosophical explorations of Zoroastrian thought', '#8b5cf6'),
    ('Religion', 'religion', 'Religious and spiritual content', '#10b981'),
    ('Architecture', 'architecture', 'Sacred architecture and fire temples', '#f97316'),
    ('Scripture', 'scripture', 'Sacred texts and interpretations', '#84cc16'),
    ('Community', 'community', 'Modern Zoroastrian communities', '#ec4899'),
    ('History', 'history', 'Historical articles about Zoroastrianism', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- Insert some basic tags (your schema already supports this)
INSERT INTO blog_tags (name, slug) VALUES
    ('Philosophy', 'philosophy'),
    ('Religion', 'religion'),
    ('History', 'history'),
    ('Architecture', 'architecture'),
    ('Sacred Sites', 'sacred-sites'),
    ('Culture', 'culture'),
    ('Scripture', 'scripture'),
    ('Poetry', 'poetry'),
    ('Theology', 'theology'),
    ('Community', 'community'),
    ('Modern Life', 'modern-life'),
    ('Symbolism', 'symbolism'),
    ('Ethics', 'ethics'),
    ('Practice', 'practice'),
    ('Worship', 'worship'),
    ('Fire', 'fire'),
    ('Gathas', 'gathas')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts into your EXISTING blog_posts table
INSERT INTO blog_posts (
    title, 
    slug,
    excerpt,
    content, 
    featured_image, 
    author, 
    status, 
    is_featured, 
    category,
    published_at
) VALUES 
(
    'Welcome to Zoroastervers: Your Gateway to Ancient Wisdom',
    'welcome-to-zoroastervers',
    'Discover the profound teachings of Zoroaster and explore how this ancient religion continues to inspire modern seekers of truth and wisdom.',
    'Welcome to Zoroastervers, where ancient wisdom meets modern understanding. Zoroastrianism, one of the world''s oldest monotheistic religions, offers profound insights into the nature of good and evil, the importance of free will, and the cosmic struggle between light and darkness. 

Founded by the prophet Zoroaster (also known as Zarathustra) sometime between 1500-1000 BCE, Zoroastrianism introduced revolutionary concepts that would later influence Judaism, Christianity, and Islam. The religion''s emphasis on ethical dualism, the worship of Ahura Mazda as the "Wise Lord," and the importance of individual choice in determining one''s spiritual destiny created a framework for understanding divine justice and human responsibility.

At Zoroastervers, we explore these timeless teachings and their relevance to contemporary spiritual seekers, philosophers, and anyone interested in the roots of monotheistic thought.',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1200&h=600&fit=crop',
    'Zoroastervers Team',
    'published',
    true,
    'Philosophy',
    NOW()
),
(
    'The Sacred Fire: Symbol of Divine Light and Purity',
    'sacred-fire-divine-light',
    'Fire holds a central place in Zoroastrian worship as a symbol of Ahura Mazda''s light and the path to truth.',
    'In Zoroastrian tradition, fire is not worshipped itself but serves as a symbol of Ahura Mazda''s light and purity. Fire temples around the world maintain this sacred flame as a focal point for prayer and meditation.

The sacred fire represents several key concepts in Zoroastrian theology: purity, truth, and the divine presence. Zoroastrians pray in the direction of a source of light, most commonly fire, as it symbolizes the light of Ahura Mazda that illuminates truth and dispels the darkness of ignorance and evil.

There are three grades of sacred fires in Zoroastrianism: the Atash Dadgah (village fire), Atash Adaran (town fire), and the most sacred Atash Behram (cathedral fire). Each serves different communities and requires different levels of ritual purity in its maintenance.',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop',
    'Dr. Farah Kermani',
    'published',
    false,
    'Religion',
    NOW() - INTERVAL '1 day'
),
(
    'Good Thoughts, Good Words, Good Deeds: The Zoroastrian Way',
    'good-thoughts-words-deeds-zoroastrian-way',
    'The threefold path of righteousness in Zoroastrianism emphasizes the importance of aligning our thoughts, words, and actions with truth and goodness.',
    'Humata, Hukhta, Hvarshta - Good Thoughts, Good Words, Good Deeds. This fundamental principle of Zoroastrianism guides believers in living a righteous life, emphasizing personal responsibility and the power of individual choice in the cosmic battle between good and evil.

This threefold path is not merely a moral guideline but a practical framework for spiritual development. Good Thoughts (Humata) involve cultivating wisdom, compassion, and truth in one''s mind. Good Words (Hukhta) require speaking honestly, kindly, and constructively. Good Deeds (Hvarshta) demand acting with integrity, charity, and justice in all aspects of life.

Together, these three principles create a holistic approach to righteous living that strengthens not only the individual soul but also the community and the cosmic order itself.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
    'Prof. Jamshid Rostami',
    'published',
    false,
    'Philosophy',
    NOW() - INTERVAL '2 days'
)
ON CONFLICT (slug) DO NOTHING;

-- Now let's add tags to these posts using your existing blog_post_tags junction table
-- Get the post IDs and tag IDs, then create the relationships

-- For "Welcome to Zoroastervers" post
INSERT INTO blog_post_tags (blog_post_id, tag_id)
SELECT 
    bp.id as blog_post_id,
    bt.id as tag_id
FROM blog_posts bp
CROSS JOIN blog_tags bt
WHERE bp.slug = 'welcome-to-zoroastervers'
  AND bt.slug IN ('philosophy', 'religion', 'history')
ON CONFLICT DO NOTHING;

-- For "Sacred Fire" post
INSERT INTO blog_post_tags (blog_post_id, tag_id)
SELECT 
    bp.id as blog_post_id,
    bt.id as tag_id
FROM blog_posts bp
CROSS JOIN blog_tags bt
WHERE bp.slug = 'sacred-fire-divine-light'
  AND bt.slug IN ('fire', 'worship', 'religion', 'sacred-sites')
ON CONFLICT DO NOTHING;

-- For "Good Thoughts, Good Words, Good Deeds" post
INSERT INTO blog_post_tags (blog_post_id, tag_id)
SELECT 
    bp.id as blog_post_id,
    bt.id as tag_id
FROM blog_posts bp
CROSS JOIN blog_tags bt
WHERE bp.slug = 'good-thoughts-words-deeds-zoroastrian-way'
  AND bt.slug IN ('ethics', 'philosophy', 'practice')
ON CONFLICT DO NOTHING;

-- Update the posts_count for categories and tags (your triggers should handle this automatically)
-- But let's refresh the counts to be safe
UPDATE blog_categories 
SET posts_count = (
    SELECT COUNT(*) 
    FROM blog_posts 
    WHERE blog_posts.category = blog_categories.name 
      AND blog_posts.status = 'published'
);

UPDATE blog_tags 
SET posts_count = (
    SELECT COUNT(*) 
    FROM blog_post_tags bpt
    JOIN blog_posts bp ON bp.id = bpt.blog_post_id
    WHERE bpt.tag_id = blog_tags.id 
      AND bp.status = 'published'
);