
-- Enhanced Store Database Migration
-- File: supabase/migrations/20250929_enhanced_store_system.sql

-- Drop existing constraints and add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_type VARCHAR(50) DEFAULT 'digital',
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20), -- beginner, intermediate, advanced
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS duration VARCHAR(50), -- For courses/audio: "2 hours", "30 minutes"
ADD COLUMN IF NOT EXISTS file_format VARCHAR(100), -- PDF, EPUB, MP3, MP4, etc.
ADD COLUMN IF NOT EXISTS is_physical BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shipping_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS preview_content TEXT, -- Sample content, first chapter, etc.
ADD COLUMN IF NOT EXISTS product_badges TEXT[] DEFAULT '{}', -- Featured, New, Bestseller
ADD COLUMN IF NOT EXISTS related_characters TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS mythology_themes TEXT[] DEFAULT '{}', -- Persian, Zoroastrian, Epic
ADD COLUMN IF NOT EXISTS preview_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2), -- For showing discounts
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER, -- For physical products
ADD COLUMN IF NOT EXISTS digital_asset_url TEXT, -- Link to digital download
ADD COLUMN IF NOT EXISTS requires_shipping BOOLEAN DEFAULT false;

-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50), -- Lucide icon name
    color_scheme JSONB DEFAULT '{"primary": "#D97706", "secondary": "#F59E0B", "gradient": "from-amber-500 to-orange-600"}',
    parent_id UUID REFERENCES product_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    product_count INTEGER DEFAULT 0, -- Cache for quick access
    featured_product_id UUID, -- Will reference products(id)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert main categories
INSERT INTO product_categories (name, slug, description, icon, color_scheme, sort_order) VALUES
('Digital Literature', 'literature', 'Epic fantasy novels, short stories, and poetry inspired by Persian mythology', 'Book', '{"primary": "#3B82F6", "secondary": "#06B6D4", "gradient": "from-blue-500 to-cyan-600"}', 1),
('Learning Academy', 'learning', 'Courses, tutorials, and educational content for writers and mythology enthusiasts', 'GraduationCap', '{"primary": "#10B981", "secondary": "#14B8A6", "gradient": "from-emerald-500 to-teal-600"}', 2),
('Sacred Merchandise', 'merchandise', 'Physical products including apparel, accessories, and collectibles', 'Shirt', '{"primary": "#8B5CF6", "secondary": "#EC4899", "gradient": "from-purple-500 to-pink-600"}', 3),
('Professional Services', 'services', 'Editing, consultation, and creative services for authors', 'Briefcase', '{"primary": "#6366F1", "secondary": "#8B5CF6", "gradient": "from-indigo-500 to-purple-600"}', 4),
('Digital Assets', 'digital-art', 'Character art, backgrounds, templates, and design elements', 'Palette', '{"primary": "#F43F5E", "secondary": "#EF4444", "gradient": "from-rose-500 to-red-600"}', 5),
('Audio Experience', 'audio', 'Audiobooks, meditation tracks, and Persian-inspired soundscapes', 'Music', '{"primary": "#EAB308", "secondary": "#D97706", "gradient": "from-yellow-500 to-amber-600"}', 6);

-- Create subcategories
INSERT INTO product_categories (name, slug, description, parent_id, sort_order) VALUES
-- Literature subcategories
('Novels', 'novels', 'Full-length fantasy novels and epics', (SELECT id FROM product_categories WHERE slug = 'literature'), 1),
('Short Stories', 'short-stories', 'Bite-sized Persian mythology tales', (SELECT id FROM product_categories WHERE slug = 'literature'), 2),
('Poetry', 'poetry', 'Modern interpretations of ancient verses', (SELECT id FROM product_categories WHERE slug = 'literature'), 3),
('Character Guides', 'character-guides', 'Deep dives into mythological figures', (SELECT id FROM product_categories WHERE slug = 'literature'), 4),

-- Learning subcategories  
('Writing Courses', 'writing-courses', 'Craft epic fantasy and mythology-based stories', (SELECT id FROM product_categories WHERE slug = 'learning'), 1),
('Language Tutorials', 'language', 'Basic Avestan, Persian phrases for writers', (SELECT id FROM product_categories WHERE slug = 'learning'), 2),
('History Lessons', 'history', 'Ancient Persian civilization deep dives', (SELECT id FROM product_categories WHERE slug = 'learning'), 3),
('Mythology Masterclasses', 'mythology', 'Video series on Zoroastrian theology', (SELECT id FROM product_categories WHERE slug = 'learning'), 4),

-- Merchandise subcategories
('Apparel', 'apparel', 'T-shirts, hoodies with Persian symbols', (SELECT id FROM product_categories WHERE slug = 'merchandise'), 1),
('Accessories', 'accessories', 'Jewelry, bookmarks, Persian-inspired items', (SELECT id FROM product_categories WHERE slug = 'merchandise'), 2),
('Art Prints', 'art-prints', 'Character illustrations, Persian calligraphy', (SELECT id FROM product_categories WHERE slug = 'merchandise'), 3),
('Home Decor', 'home-decor', 'Persian-inspired design elements', (SELECT id FROM product_categories WHERE slug = 'merchandise'), 4),

-- Services subcategories
('Editing Services', 'editing', 'Fantasy manuscript editing and proofreading', (SELECT id FROM product_categories WHERE slug = 'services'), 1),
('Cover Design', 'cover-design', 'Book covers with Persian aesthetic', (SELECT id FROM product_categories WHERE slug = 'services'), 2),
('Writing Coaching', 'coaching', 'One-on-one mythology writing guidance', (SELECT id FROM product_categories WHERE slug = 'services'), 3),
('Research Services', 'research', 'Persian mythology fact-checking and consultation', (SELECT id FROM product_categories WHERE slug = 'services'), 4),

-- Digital Art subcategories
('Character Art', 'character-art', 'High-res illustrations of mythological figures', (SELECT id FROM product_categories WHERE slug = 'digital-art'), 1),
('Backgrounds', 'backgrounds', 'Persian-inspired digital wallpapers', (SELECT id FROM product_categories WHERE slug = 'digital-art'), 2),
('Icons & Symbols', 'icons', 'Zoroastrian and Persian design elements', (SELECT id FROM product_categories WHERE slug = 'digital-art'), 3),
('Templates', 'templates', 'Book formatting, social media templates', (SELECT id FROM product_categories WHERE slug = 'digital-art'), 4),

-- Audio subcategories
('Audiobooks', 'audiobooks', 'Narrated versions of Persian mythology stories', (SELECT id FROM product_categories WHERE slug = 'audio'), 1),
('Meditation Tracks', 'meditation', 'Persian-inspired ambient music for focus', (SELECT id FROM product_categories WHERE slug = 'audio'), 2),
('Pronunciation Guides', 'pronunciation', 'How to say Persian names correctly', (SELECT id FROM product_categories WHERE slug = 'audio'), 3),
('Epic Soundscapes', 'soundscapes', 'Background music for reading and writing', (SELECT id FROM product_categories WHERE slug = 'audio'), 4);

-- Enhanced product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    reviewer_name VARCHAR(100),
    reviewer_tier VARCHAR(20) DEFAULT 'initiate', -- initiate, devotee, guardian, fire_keeper
    verified_purchase BOOLEAN DEFAULT false,
    helpfulness_score INTEGER DEFAULT 0, -- Upvotes - downvotes
    is_featured BOOLEAN DEFAULT false,
    mythology_knowledge_score INTEGER DEFAULT 0, -- 0-10 scale for expertise
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

-- User loyalty and gamification system
CREATE TABLE IF NOT EXISTS user_loyalty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    sacred_fire_points INTEGER DEFAULT 0,
    current_tier VARCHAR(20) DEFAULT 'initiate', -- initiate, devotee, guardian, fire_keeper
    tier_progress INTEGER DEFAULT 0, -- Progress to next tier
    total_purchases DECIMAL(10,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    achievements TEXT[] DEFAULT '{}', -- Array of achievement badge IDs
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES user_loyalty(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User wishlist system
CREATE TABLE IF NOT EXISTS user_wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Shopping cart system
CREATE TABLE IF NOT EXISTS shopping_cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, product_id, variant_id)
);

-- Product view tracking for recommendations
CREATE TABLE IF NOT EXISTS product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(100), -- For anonymous users
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    view_duration INTEGER, -- Seconds spent on product page
    viewed_at TIMESTAMP DEFAULT NOW()
);

-- User preferences for personalization
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    preferred_categories TEXT[] DEFAULT '{}',
    preferred_characters TEXT[] DEFAULT '{}',
    preferred_themes TEXT[] DEFAULT '{}',
    preferred_languages TEXT[] DEFAULT '{"en"}',
    price_range_min DECIMAL(10,2) DEFAULT 0,
    price_range_max DECIMAL(10,2) DEFAULT 1000,
    notification_preferences JSONB DEFAULT '{"new_products": true, "sales": true, "recommendations": true}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Achievement definitions
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50), -- Emoji or icon name
    badge_color VARCHAR(50) DEFAULT 'amber',
    points_reward INTEGER DEFAULT 0,
    requirements JSONB, -- Flexible requirements definition
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert achievement definitions
INSERT INTO achievements (slug, name, description, icon, badge_color, points_reward, requirements) VALUES
('first_purchase', 'Sacred Beginning', 'Made your first purchase in the Sacred Treasury', '🔥', 'amber', 100, '{"type": "purchase_count", "value": 1}'),
('epic_reader', 'Epic Reader', 'Purchased 10 or more books', '📚', 'blue', 500, '{"type": "category_purchases", "category": "literature", "value": 10}'),
('knowledge_seeker', 'Knowledge Seeker', 'Completed 5 or more courses', '🎓', 'emerald', 300, '{"type": "category_purchases", "category": "learning", "value": 5}'),
('helpful_reviewer', 'Helpful Guide', 'Wrote 10 helpful reviews', '⭐', 'yellow', 200, '{"type": "helpful_reviews", "value": 10}'),
('persian_scholar', 'Persian Scholar', 'Completed all advanced mythology courses', '👑', 'purple', 1000, '{"type": "advanced_courses_completed", "value": "all"}'),
('community_champion', 'Community Champion', 'Referred 5 new customers', '🌟', 'pink', 750, '{"type": "referrals", "value": 5}'),
('collector', 'Sacred Collector', 'Owned items from all 6 main categories', '🏆', 'gold', 800, '{"type": "category_diversity", "value": 6}'),
('loyal_devotee', 'Loyal Devotee', 'Reached Devotee tier status', '⭐', 'orange', 250, '{"type": "tier_reached", "value": "devotee"}'),
('guardian_protector', 'Guardian Protector', 'Reached Guardian tier status', '🛡️', 'indigo', 500, '{"type": "tier_reached", "value": "guardian"}'),
('fire_keeper_master', 'Fire Keeper Master', 'Reached the highest Fire Keeper tier', '🔥', 'red', 1000, '{"type": "tier_reached", "value": "fire_keeper"}');

-- User achievement tracking
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Enhanced product variants table
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS variant_type VARCHAR(50), -- format, size, color, edition
ADD COLUMN IF NOT EXISTS variant_metadata JSONB DEFAULT '{}', -- Additional variant-specific data
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS download_url TEXT,
ADD COLUMN IF NOT EXISTS file_size_mb INTEGER;

-- Orders table enhancement
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    points_used INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Update product categories with product counts (function)
CREATE OR REPLACE FUNCTION update_category_counts() 
RETURNS TRIGGER AS $$
BEGIN
    -- Update main category count
    UPDATE product_categories 
    SET product_count = (
        SELECT COUNT(*) 
        FROM products p
        JOIN product_categories pc ON pc.slug = p.category
        WHERE pc.id = product_categories.id
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update category counts
DROP TRIGGER IF EXISTS trigger_update_category_counts ON products;
CREATE TRIGGER trigger_update_category_counts
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH STATEMENT
    EXECUTE FUNCTION update_category_counts();

-- Function to calculate user tier based on points and purchases
CREATE OR REPLACE FUNCTION calculate_user_tier(points INTEGER, total_spent DECIMAL)
RETURNS VARCHAR AS $$
BEGIN
    IF points >= 5000 OR total_spent >= 500 THEN
        RETURN 'fire_keeper';
    ELSIF points >= 1500 OR total_spent >= 150 THEN
        RETURN 'guardian';
    ELSIF points >= 500 OR total_spent >= 50 THEN
        RETURN 'devotee';
    ELSE
        RETURN 'initiate';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to award points for various actions
CREATE OR REPLACE FUNCTION award_points(user_uuid UUID, action VARCHAR, amount INTEGER)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_loyalty (user_id, sacred_fire_points)
    VALUES (user_uuid, amount)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        sacred_fire_points = user_loyalty.sacred_fire_points + amount,
        current_tier = calculate_user_tier(
            user_loyalty.sacred_fire_points + amount, 
            user_loyalty.total_purchases
        ),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_badges ON products USING GIN(product_badges);
CREATE INDEX IF NOT EXISTS idx_products_characters ON products USING GIN(related_characters);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_user_loyalty_tier ON user_loyalty(current_tier);
CREATE INDEX IF NOT EXISTS idx_user_loyalty_points ON user_loyalty(sacred_fire_points);
CREATE INDEX IF NOT EXISTS idx_product_views_product_user ON product_views(product_id, user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_cart_user ON shopping_cart(user_id);
CREATE INDEX IF NOT EXISTS idx_user_wishlists_user ON user_wishlists(user_id);

-- Row Level Security policies
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and achievements
CREATE POLICY "Public read access for categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read access for achievements" ON achievements FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view their own loyalty data" ON user_loyalty FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own loyalty data" ON user_loyalty FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their wishlist" ON user_wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their cart" ON shopping_cart FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-- Public read access for reviews
CREATE POLICY "Public read access for reviews" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reviews" ON product_reviews FOR UPDATE USING (auth.uid() = user_id);

-- Initial data population function
CREATE OR REPLACE FUNCTION populate_enhanced_store_data()
RETURNS VOID AS $$
BEGIN
    -- Update existing products with new fields
    UPDATE products SET 
        category_type = 'digital',
        subcategory = CASE 
            WHEN title LIKE '%Chronicles%' OR title LIKE '%Retold%' THEN 'novels'
            WHEN title LIKE '%Guide%' OR title LIKE '%Compendium%' THEN 'character-guides'
            WHEN title LIKE '%Collection%' THEN 'digital-art'
            WHEN title LIKE '%Consultation%' THEN 'research'
            WHEN title LIKE '%Masterclass%' THEN 'writing-courses'
            WHEN title LIKE '%Tracks%' THEN 'meditation'
            ELSE 'novels'
        END,
        language = 'en',
        preview_available = CASE 
            WHEN category IN ('books', 'guides', 'art') THEN true 
            ELSE false 
        END,
        product_badges = CASE 
            WHEN title LIKE '%Fire Temple Chronicles%' THEN ARRAY['Bestseller', 'Award Winner']
            WHEN title LIKE '%Masterclass%' THEN ARRAY['New', 'Staff Pick']
            WHEN title LIKE '%Collection%' OR title LIKE '%Bundle%' THEN ARRAY['Limited Edition']
            WHEN title LIKE '%Consultation%' THEN ARRAY['Professional']
            WHEN title LIKE '%Art%' THEN ARRAY['Digital']
            WHEN title LIKE '%Meditation%' THEN ARRAY['Relaxing']
            ELSE ARRAY[]::TEXT[]
        END,
        related_characters = CASE
            WHEN title LIKE '%Fire Temple%' OR title LIKE '%Zarathustra%' THEN ARRAY['Ahura Mazda', 'Zarathustra', 'Angra Mainyu']
            WHEN title LIKE '%Mythology%' THEN ARRAY['Ahura Mazda', 'Zarathustra']
            WHEN title LIKE '%Art%' AND title LIKE '%Zarathustra%' THEN ARRAY['Zarathustra']
            ELSE ARRAY[]::TEXT[]
        END,
        is_physical = CASE 
            WHEN title LIKE '%T-Shirt%' OR title LIKE '%Print%' THEN true 
            ELSE false 
        END,
        difficulty_level = CASE
            WHEN title LIKE '%Masterclass%' THEN 'intermediate'
            WHEN title LIKE '%Guide%' THEN 'beginner'
            WHEN title LIKE '%Consultation%' THEN 'advanced'
            ELSE null
        END;

    -- Map existing categories to new category system
    UPDATE products SET category = CASE
        WHEN category = 'books' OR category = 'guide' THEN 'literature'
        WHEN category = 'bundle' THEN 'literature'
        WHEN category = 'art' THEN 'digital-art'
        WHEN title LIKE '%Consultation%' THEN 'services'
        WHEN title LIKE '%Masterclass%' THEN 'learning'
        WHEN title LIKE '%Meditation%' THEN 'audio'
        WHEN title LIKE '%T-Shirt%' THEN 'merchandise'
        ELSE 'literature'
    END;

END;
$$ LANGUAGE plpgsql;

-- Execute the data population
SELECT populate_enhanced_store_data();

-- Comments for documentation
COMMENT ON TABLE product_categories IS 'Hierarchical category system for organizing products';
COMMENT ON TABLE user_loyalty IS 'User loyalty points and tier management system';
COMMENT ON TABLE user_wishlists IS 'User wishlist functionality for saved products';
COMMENT ON TABLE shopping_cart IS 'Shopping cart system for managing user selections';
COMMENT ON TABLE achievements IS 'Gamification system achievement definitions';
COMMENT ON TABLE user_achievements IS 'Tracking of user-earned achievements';
COMMENT ON TABLE product_reviews IS 'Enhanced review system with helpfulness scoring';
COMMENT ON TABLE user_preferences IS 'User personalization preferences';
COMMENT ON TABLE product_views IS 'Analytics tracking for product page views';
COMMENT ON TABLE orders IS 'Order management system';
COMMENT ON TABLE order_items IS 'Individual items within orders';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Enhanced Store Database Migration completed successfully!';
    RAISE NOTICE 'Features added:';
    RAISE NOTICE '✅ Multi-category product organization';
    RAISE NOTICE '✅ User loyalty and tier system'; 
    RAISE NOTICE '✅ Wishlist and shopping cart';
    RAISE NOTICE '✅ Gamification with achievements';
    RAISE NOTICE '✅ Enhanced product reviews';
    RAISE NOTICE '✅ User preferences and personalization';
    RAISE NOTICE '✅ Order management system';
    RAISE NOTICE '✅ Analytics and view tracking';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your frontend components';
    RAISE NOTICE '2. Implement loyalty point awarding logic';  
    RAISE NOTICE '3. Set up email notifications for achievements';
    RAISE NOTICE '4. Configure payment processing';
END $$;
