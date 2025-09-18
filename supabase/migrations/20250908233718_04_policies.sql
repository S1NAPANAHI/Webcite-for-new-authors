-- Consolidated RLS Policy Definitions

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (profile_visibility = 'public' OR id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.friends 
        WHERE (user_id = auth.uid() AND friend_id = id) 
        OR (user_id = id AND friend_id = auth.uid())
    ));
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- User Roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- User Stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own stats or public profiles" ON public.user_stats;
CREATE POLICY "Users can view their own stats or public profiles"
    ON public.user_stats FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = user_id 
            AND (profile_visibility = 'public' OR 
                (profile_visibility = 'friends_only' AND EXISTS (
                    SELECT 1 FROM public.friends 
                    WHERE (user_id = auth.uid() AND friend_id = user_id) 
                    OR (user_id = user_id AND friend_id = auth.uid())
                )))
    ));
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
CREATE POLICY "Users can update their own stats"
    ON public.user_stats FOR UPDATE
    USING (auth.uid() = user_id);

-- Friends
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own friends" ON public.friends;
CREATE POLICY "Users can view their own friends"
    ON public.friends FOR SELECT
    USING (user_id = auth.uid() OR friend_id = auth.uid());
DROP POLICY IF EXISTS "Users can create friend requests" ON public.friends;
CREATE POLICY "Users can create friend requests"
    ON public.friends FOR INSERT
    WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users can update their own friend requests" ON public.friends;
CREATE POLICY "Users can update their own friend requests"
    ON public.friends FOR UPDATE
    USING (user_id = auth.uid() OR friend_id = auth.uid());
DROP POLICY IF EXISTS "Users can delete their own friend relationships" ON public.friends;
CREATE POLICY "Users can delete their own friend relationships"
    ON public.friends FOR DELETE
    USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Daily Spins
ALTER TABLE public.daily_spins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own spins" ON public.daily_spins;
CREATE POLICY "Users can manage their own spins"
    ON public.daily_spins FOR ALL
    USING (auth.uid() = user_id);

-- User Activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view their own activities"
    ON public.user_activities FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;
CREATE POLICY "Users can insert their own activities"
    ON public.user_activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own activities" ON public.user_activities;
CREATE POLICY "Users can update their own activities"
    ON public.user_activities FOR UPDATE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.user_activities;
CREATE POLICY "Users can delete their own activities"
    ON public.user_activities FOR DELETE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all activities" ON public.user_activities;
CREATE POLICY "Admins can manage all activities"
    ON public.user_activities FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- User Reading History
ALTER TABLE public.user_reading_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own reading history" ON public.user_reading_history;
CREATE POLICY "Users can view their own reading history"
    ON public.user_reading_history FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own reading history" ON public.user_reading_history;
CREATE POLICY "Users can update their own reading history"
    ON public.user_reading_history FOR UPDATE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert their own reading history" ON public.user_reading_history;
CREATE POLICY "Users can insert their own reading history"
    ON public.user_reading_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own reading history" ON public.user_reading_history;
CREATE POLICY "Users can delete their own reading history"
    ON public.user_reading_history FOR DELETE
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access" ON public.user_reading_history;
CREATE POLICY "Admins have full access"
    ON public.user_reading_history FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- Beta Applications
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own beta applications" ON public.beta_applications;
CREATE POLICY "Users can view their own beta applications"
    ON public.beta_applications FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can create beta applications" ON public.beta_applications;
CREATE POLICY "Users can create beta applications"
    ON public.beta_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their pending beta applications" ON public.beta_applications;
CREATE POLICY "Users can update their pending beta applications"
    ON public.beta_applications FOR UPDATE
    USING (
        auth.uid() = user_id 
        AND status = 'pending'::public.beta_application_status
    )
    WITH CHECK (
        auth.uid() = user_id 
        AND status = 'pending'::public.beta_application_status
    );
DROP POLICY IF EXISTS "Admins can manage all beta applications" ON public.beta_applications;
CREATE POLICY "Admins can manage all beta applications"
    ON public.beta_applications FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- Works
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to published works" ON public.works;
CREATE POLICY "Enable public read access to published works"
ON public.works FOR SELECT
TO anon, authenticated
USING (status = 'published');
DROP POLICY IF EXISTS "Enable all operations for authors on their works" ON public.works;
CREATE POLICY "Enable all operations for authors on their works"
ON public.works FOR ALL
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);
DROP POLICY IF EXISTS "Enable all operations for admins on works" ON public.works;
CREATE POLICY "Enable all operations for admins on works"
ON public.works FOR ALL
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Chapters
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to chapters of published works" ON public.chapters;
CREATE POLICY "Enable public read access to chapters of published works"
ON public.chapters FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.works 
  WHERE works.id = chapters.work_id 
  AND works.status = 'published'
));
DROP POLICY IF EXISTS "Enable all operations for authors on their chapters" ON public.chapters;
CREATE POLICY "Enable all operations for authors on their chapters"
ON public.chapters FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.works 
    WHERE works.id = chapters.work_id 
    AND works.author_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.works 
    WHERE works.id = chapters.work_id 
    AND works.author_id = auth.uid()
  )
);
DROP POLICY IF EXISTS "Enable all operations for admins on chapters" ON public.chapters;
CREATE POLICY "Enable all operations for admins on chapters"
ON public.chapters FOR ALL
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published posts viewable by everyone" ON public.posts;
CREATE POLICY "Published posts viewable by everyone"
    ON public.posts FOR SELECT
    USING (status = 'published');
DROP POLICY IF EXISTS "Authors can manage their own posts" ON public.posts;
CREATE POLICY "Authors can manage their own posts"
    ON public.posts FOR ALL
    USING (auth.uid() = author_id);
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
CREATE POLICY "Admins can manage all posts"
    ON public.posts FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- Pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published pages viewable by everyone" ON public.pages;
CREATE POLICY "Published pages viewable by everyone"
    ON public.pages FOR SELECT
    USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage all pages" ON public.pages;
CREATE POLICY "Admins can manage all pages"
    ON public.pages FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- Characters
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Characters are viewable by everyone" ON public.characters;
CREATE POLICY "Characters are viewable by everyone"
    ON public.characters FOR SELECT
    USING (true);
DROP POLICY IF EXISTS "Admins can manage characters" ON public.characters;
CREATE POLICY "Admins can manage characters"
    ON public.characters FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));

-- Wiki Items (consolidated from wiki_folders and wiki_pages)
ALTER TABLE public.wiki_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to published wiki items" ON public.wiki_items;
CREATE POLICY "Enable public read access to published wiki items"
ON public.wiki_items
FOR SELECT
TO public
USING (status = 'published');
DROP POLICY IF EXISTS "Enable read access for authenticated users on their wiki items" ON public.wiki_items;
CREATE POLICY "Enable read access for authenticated users on their wiki items"
ON public.wiki_items
FOR SELECT
TO authenticated
USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.wiki_items;
CREATE POLICY "Enable insert for authenticated users"
ON public.wiki_items
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable update for users on their wiki items" ON public.wiki_items;
CREATE POLICY "Enable update for users on their wiki items"
ON public.wiki_items
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable delete for users on their wiki items" ON public.wiki_items;
CREATE POLICY "Enable delete for users on their wiki items"
ON public.wiki_items
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable all operations for admins" ON public.wiki_items;
CREATE POLICY "Enable all operations for admins"
ON public.wiki_items
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Wiki Categories
ALTER TABLE public.wiki_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to wiki categories" ON public.wiki_categories;
CREATE POLICY "Enable public read access to wiki categories"
ON public.wiki_categories
FOR SELECT
TO public
USING (true);
DROP POLICY IF EXISTS "Enable all operations for authenticated users on their wiki categories" ON public.wiki_categories;
CREATE POLICY "Enable all operations for authenticated users on their wiki categories"
ON public.wiki_categories
FOR ALL
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable all operations for admins on wiki categories" ON public.wiki_categories;
CREATE POLICY "Enable all operations for admins on wiki categories"
ON public.wiki_categories
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Wiki Revisions
ALTER TABLE public.wiki_revisions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to revisions of published wiki items" ON public.wiki_revisions;
CREATE POLICY "Enable public read access to revisions of published wiki items"
ON public.wiki_revisions
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.wiki_items 
        WHERE wiki_items.id = wiki_revisions.page_id 
        AND wiki_items.status = 'published'
    )
);
DROP POLICY IF EXISTS "Enable read access for users to their wiki revisions" ON public.wiki_revisions;
CREATE POLICY "Enable read access for users to their wiki revisions"
ON public.wiki_revisions
FOR SELECT
TO authenticated
USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM public.wiki_items 
        WHERE wiki_items.id = public.wiki_revisions.page_id 
        AND (wiki_items.created_by = auth.uid() OR wiki_items.status = 'published')
    )
);
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.wiki_revisions;
CREATE POLICY "Enable insert for authenticated users"
ON public.wiki_revisions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable all operations for admins on wiki revisions" ON public.wiki_revisions;
CREATE POLICY "Enable all operations for admins on wiki revisions"
ON public.wiki_revisions
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Wiki Content Blocks
ALTER TABLE public.wiki_content_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to content blocks of published wiki items" ON public.wiki_content_blocks;
CREATE POLICY "Enable public read access to content blocks of published wiki items"
ON public.wiki_content_blocks
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.wiki_items 
        WHERE wiki_items.id = public.wiki_content_blocks.page_id 
        AND wiki_items.status = 'published'
    )
);
DROP POLICY IF EXISTS "Enable read access for users to content blocks they have access to" ON public.wiki_content_blocks;
CREATE POLICY "Enable read access for users to content blocks they have access to"
ON public.wiki_content_blocks
FOR SELECT
TO authenticated
USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM public.wiki_items 
        WHERE wiki_items.id = public.wiki_content_blocks.page_id 
        AND (wiki_items.created_by = auth.uid() OR wiki_items.status = 'published')
    )
);
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.wiki_content_blocks;
CREATE POLICY "Enable insert for authenticated users"
ON public.wiki_content_blocks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable update for users on their content blocks" ON public.wiki_content_blocks;
CREATE POLICY "Enable update for users on their content blocks"
ON public.wiki_content_blocks
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable delete for users on their content blocks" ON public.wiki_content_blocks;
CREATE POLICY "Enable delete for users on their content blocks"
ON public.wiki_content_blocks
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable all operations for admins on content blocks" ON public.wiki_content_blocks;
CREATE POLICY "Enable all operations for admins on content blocks"
ON public.wiki_content_blocks
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Wiki Media
ALTER TABLE public.wiki_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable public read access to media of published wiki items" ON public.wiki_media;
CREATE POLICY "Enable public read access to media of published wiki items"
ON public.wiki_media
FOR SELECT
TO public
USING (
    wiki_item_id IS NULL OR 
    EXISTS (
        SELECT 1 FROM public.wiki_items 
        WHERE wiki_items.id = public.wiki_media.wiki_item_id 
        AND wiki_items.status = 'published'
    )
);
DROP POLICY IF EXISTS "Enable read access for users to media they have access to" ON public.wiki_media;
CREATE POLICY "Enable read access for users to media they have access to"
ON public.wiki_media
FOR SELECT
TO authenticated
USING (
    auth.uid() = created_by OR
    wiki_item_id IS NULL OR
    EXISTS (
        SELECT 1 FROM public.wiki_items 
        WHERE wiki_items.id = public.wiki_media.wiki_item_id 
        AND (wiki_items.created_by = auth.uid() OR wiki_items.status = 'published')
    )
);
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.wiki_media;
CREATE POLICY "Enable insert for authenticated users"
ON public.wiki_media
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable update for users on their media" ON public.wiki_media;
CREATE POLICY "Enable update for users on their media"
ON public.wiki_media
FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable delete for users on their media" ON public.wiki_media;
CREATE POLICY "Enable delete for users on their media"
ON public.wiki_media
FOR DELETE
TO authenticated
USING (auth.uid() = created_by);
DROP POLICY IF EXISTS "Enable all operations for admins on media" ON public.wiki_media;
CREATE POLICY "Enable all operations for admins on media"
ON public.wiki_media
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
CREATE POLICY "Public products are viewable by everyone"
    ON public.products FOR SELECT
    USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
CREATE POLICY "Admins can view all products"
    ON public.products FOR SELECT
    USING (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
    ON public.products FOR INSERT
    WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
    ON public.products FOR UPDATE
    USING (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Only admins can delete products (soft delete via status)" ON public.products;
CREATE POLICY "Only admins can delete products (soft delete via status)"
    ON public.products FOR DELETE
    USING (public.is_user_admin(auth.uid()));

-- Product Categories
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active categories" ON public.product_categories;
CREATE POLICY "Public can view active categories"
    ON public.product_categories FOR SELECT
    USING (is_active = true);
DROP POLICY IF EXISTS "Admins have full access to categories" ON public.product_categories;
CREATE POLICY "Admins have full access to categories"
    ON public.product_categories FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Product Category Relations
ALTER TABLE public.product_category_relations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view category relations" ON public.product_category_relations;
CREATE POLICY "Public can view category relations"
    ON public.product_category_relations FOR SELECT
    USING (true);
DROP POLICY IF EXISTS "Only admins can modify category relations" ON public.product_category_relations;
CREATE POLICY "Only admins can modify category relations"
    ON public.product_category_relations FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Product Variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active variants for published products" ON public.product_variants;
CREATE POLICY "Public can view active variants for published products"
    ON public.product_variants FOR SELECT
    USING (available_for_sale = true);
DROP POLICY IF EXISTS "Admins have full access to variants" ON public.product_variants;
CREATE POLICY "Admins have full access to variants"
    ON public.product_variants FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Prices
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prices;
CREATE POLICY "Enable read access for all users"
    ON public.prices FOR SELECT
    USING (true);
DROP POLICY IF EXISTS "Enable all for admin" ON public.prices;
CREATE POLICY "Enable all for admin"
    ON public.prices FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Stripe Customers
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for customer owners" ON public.stripe_customers;
CREATE POLICY "Enable read access for customer owners"
    ON public.stripe_customers FOR SELECT
    USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.stripe_customers;
CREATE POLICY "Enable insert for authenticated users"
    ON public.stripe_customers FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Enable update for customer owners" ON public.stripe_customers;
CREATE POLICY "Enable update for customer owners"
    ON public.stripe_customers FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Enable all for admin" ON public.stripe_customers;
CREATE POLICY "Enable all for admin"
    ON public.stripe_customers FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage all subscriptions"
    ON public.subscriptions FOR ALL
    USING (public.is_user_admin(auth.uid()))
    WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- Subscription Items
ALTER TABLE public.subscription_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscription items" ON public.subscription_items;
CREATE POLICY "Users can view their own subscription items"
    ON public.subscription_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.subscriptions s 
        WHERE s.id = subscription_id 
        AND s.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to subscription items" ON public.subscription_items;
CREATE POLICY "Admins have full access to subscription items"
    ON public.subscription_items FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.orders;
CREATE POLICY "Enable insert for authenticated users"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (true);
DROP POLICY IF EXISTS "Enable update for order owners" ON public.orders;
CREATE POLICY "Enable update for order owners"
    ON public.orders FOR UPDATE
    USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
CREATE POLICY "Admins have full access to orders"
    ON public.orders FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view items in their own orders" ON public.order_items;
CREATE POLICY "Users can view items in their own orders"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders o 
        WHERE o.id = order_id 
        AND o.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to order items" ON public.order_items;
CREATE POLICY "Admins have full access to order items"
    ON public.order_items FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Order Notes
ALTER TABLE public.order_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view notes on their own orders if visible to customer" ON public.order_notes;
CREATE POLICY "Users can view notes on their own orders if visible to customer"
    ON public.order_notes FOR SELECT
    USING (
        is_visible_to_customer = true
        AND EXISTS (
            SELECT 1 FROM public.orders o 
            WHERE o.id = order_id 
            AND o.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Admins have full access to order notes" ON public.order_notes;
CREATE POLICY "Admins have full access to order notes"
    ON public.order_notes FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Order Refunds
ALTER TABLE public.order_refunds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their order refunds" ON public.order_refunds;
CREATE POLICY "Users can view their order refunds"
    ON public.order_refunds FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders o 
        WHERE o.id = order_id 
        AND o.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to order refunds" ON public.order_refunds;
CREATE POLICY "Admins have full access to order refunds"
    ON public.order_refunds FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Order Shipments
ALTER TABLE public.order_shipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their order shipments" ON public.order_shipments;
CREATE POLICY "Users can view their order shipments"
    ON public.order_shipments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders o 
        WHERE o.id = order_id 
        AND o.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to order shipments" ON public.order_shipments;
CREATE POLICY "Admins have full access to order shipments"
    ON public.order_shipments FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for invoice owners" ON public.invoices;
CREATE POLICY "Enable read access for invoice owners"
    ON public.invoices FOR SELECT
    USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Enable all for admin" ON public.invoices;
CREATE POLICY "Enable all for admin"
    ON public.invoices FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Subscription Invoices
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscription invoices" ON public.subscription_invoices;
CREATE POLICY "Users can view their own subscription invoices"
    ON public.subscription_invoices FOR SELECT
    USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins have full access to subscription invoices" ON public.subscription_invoices;
CREATE POLICY "Admins have full access to subscription invoices"
    ON public.subscription_invoices FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Subscription Invoice Items
ALTER TABLE public.subscription_invoice_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscription invoice items" ON public.subscription_invoice_items;
CREATE POLICY "Users can view their own subscription invoice items"
    ON public.subscription_invoice_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.subscription_invoices i 
        WHERE i.id = invoice_id 
        AND i.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to subscription invoice items" ON public.subscription_invoice_items;
CREATE POLICY "Admins have full access to subscription invoice items"
    ON public.subscription_invoice_items FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Subscription Discounts
ALTER TABLE public.subscription_discounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscription discounts" ON public.subscription_discounts;
CREATE POLICY "Users can view their own subscription discounts"
    ON public.subscription_discounts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.subscriptions s 
        WHERE s.id = subscription_id 
        AND s.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to subscription discounts" ON public.subscription_discounts;
CREATE POLICY "Admins have full access to subscription discounts"
    ON public.subscription_discounts FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Subscription Usage Records
ALTER TABLE public.subscription_usage_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own usage records" ON public.subscription_usage_records;
CREATE POLICY "Users can view their own usage records"
    ON public.subscription_usage_records FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.subscriptions s 
        WHERE s.id = subscription_id 
        AND s.user_id = auth.uid()
    ));
DROP POLICY IF EXISTS "Admins have full access to usage records" ON public.subscription_usage_records;
CREATE POLICY "Admins have full access to usage records"
    ON public.subscription_usage_records FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Subscription Notes
ALTER TABLE public.subscription_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own subscription notes" ON public.subscription_notes;
CREATE POLICY "Users can view their own subscription notes"
    ON public.subscription_notes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.subscriptions s 
            WHERE s.id = subscription_id 
            AND s.user_id = auth.uid()
        )
        AND (is_visible_to_customer = true OR public.is_user_admin(auth.uid()))
    );
DROP POLICY IF EXISTS "Users can create notes on their own subscriptions" ON public.subscription_notes;
CREATE POLICY "Users can create notes on their own subscriptions"
    ON public.subscription_notes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.subscriptions s 
            WHERE s.id = subscription_id 
            AND s.user_id = auth.uid()
        )
        AND is_system_note = false
    );
DROP POLICY IF EXISTS "Users can update their own notes" ON public.subscription_notes;
CREATE POLICY "Users can update their own notes"
    ON public.subscription_notes FOR UPDATE
    USING (
        user_id = auth.uid() 
        AND is_system_note = false
    )
    WITH CHECK (
        user_id = auth.uid() 
        AND is_system_note = false
    );
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.subscription_notes;
CREATE POLICY "Users can delete their own notes"
    ON public.subscription_notes FOR DELETE
    USING (
        user_id = auth.uid() 
        AND is_system_note = false
    );
DROP POLICY IF EXISTS "Admins have full access to subscription notes" ON public.subscription_notes;
CREATE POLICY "Admins have full access to subscription notes"
    ON public.subscription_notes FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Promotions
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active promotions" ON public.promotions;
CREATE POLICY "Public can view active promotions"
    ON public.promotions FOR SELECT
    USING (active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));
DROP POLICY IF EXISTS "Admins can manage promotions" ON public.promotions;
CREATE POLICY "Admins can manage promotions"
    ON public.promotions FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Product Reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view approved product reviews" ON public.product_reviews;
CREATE POLICY "Public can view approved product reviews"
    ON public.product_reviews FOR SELECT
    USING (is_approved = true);
DROP POLICY IF EXISTS "Users can manage their own product reviews" ON public.product_reviews;
CREATE POLICY "Users can manage their own product reviews"
    ON public.product_reviews FOR ALL
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all product reviews" ON public.product_reviews;
CREATE POLICY "Admins can manage all product reviews"
    ON public.product_reviews FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Inventory Movements
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for admins" ON public.inventory_movements;
CREATE POLICY "Enable all access for admins"
    ON public.inventory_movements FOR ALL
    USING (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable all for service role" ON public.inventory_movements;
CREATE POLICY "Enable all for service role"
    ON public.inventory_movements FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Shopping Carts
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own shopping carts" ON public.shopping_carts;
CREATE POLICY "Users can manage their own shopping carts"
    ON public.shopping_carts FOR ALL
    USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Public can manage their own session carts" ON public.shopping_carts;
CREATE POLICY "Public can manage their own session carts"
    ON public.shopping_carts FOR ALL
    USING (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- Cart Items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
CREATE POLICY "Users can manage their own cart items"
    ON public.cart_items FOR ALL
    USING (EXISTS (SELECT 1 FROM public.shopping_carts sc WHERE sc.id = cart_id AND sc.user_id = auth.uid()));
DROP POLICY IF EXISTS "Public can manage their own session cart items" ON public.cart_items;
CREATE POLICY "Public can manage their own session cart items"
    ON public.cart_items FOR ALL
    USING (EXISTS (SELECT 1 FROM public.shopping_carts sc WHERE sc.id = cart_id AND sc.session_id = current_setting('request.headers', true)::json->>'x-session-id'));

-- Stripe Sync Logs
ALTER TABLE public.stripe_sync_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for admins" ON public.stripe_sync_logs;
CREATE POLICY "Enable read access for admins"
    ON public.stripe_sync_logs FOR SELECT
    USING (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Enable insert for service role" ON public.stripe_sync_logs;
CREATE POLICY "Enable insert for service role"
    ON public.stripe_sync_logs FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Timeline Events
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published timeline events are viewable by everyone" ON public.timeline_events;
CREATE POLICY "Published timeline events are viewable by everyone"
    ON public.timeline_events FOR SELECT
    USING (is_published = true);
DROP POLICY IF EXISTS "Admins can manage timeline events" ON public.timeline_events;
CREATE POLICY "Admins can manage timeline events"
    ON public.timeline_events FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Timeline Nested Events
ALTER TABLE public.timeline_nested_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published nested timeline events are viewable by everyone" ON public.timeline_nested_events;
CREATE POLICY "Published nested timeline events are viewable by everyone"
    ON public.timeline_nested_events FOR SELECT
    USING ((EXISTS (SELECT 1 FROM public.timeline_events te WHERE te.id = timeline_event_id AND te.is_published = true)));
DROP POLICY IF EXISTS "Admins can manage nested timeline events" ON public.timeline_nested_events;
CREATE POLICY "Admins can manage nested timeline events"
    ON public.timeline_nested_events FOR ALL
    USING (public.is_user_admin(auth.uid()));

-- Authors Journey Posts
ALTER TABLE public.authors_journey_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admins full access to authors journey posts" ON public.authors_journey_posts;
CREATE POLICY "Allow admins full access to authors journey posts"
ON public.authors_journey_posts FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Allow public read access to published authors journey posts" ON public.authors_journey_posts;
CREATE POLICY "Allow public read access to published authors journey posts"
ON public.authors_journey_posts FOR SELECT
USING (status = 'published');

-- Writing Guides
ALTER TABLE public.writing_guides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admins full access to writing guides" ON public.writing_guides;
CREATE POLICY "Allow admins full access to writing guides"
ON public.writing_guides FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Allow public read access to published writing guides" ON public.writing_guides;
CREATE POLICY "Allow public read access to published writing guides"
ON public.writing_guides FOR SELECT
USING (status = 'published');

-- Video Tutorials
ALTER TABLE public.video_tutorials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admins full access to video tutorials" ON public.video_tutorials;
CREATE POLICY "Allow admins full access to video tutorials"
ON public.video_tutorials FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Allow public read access to published video tutorials" ON public.video_tutorials;
CREATE POLICY "Allow public read access to published video tutorials"
ON public.video_tutorials FOR SELECT
USING (status = 'published');

-- Downloadable Templates
ALTER TABLE public.downloadable_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admins full access to downloadable templates" ON public.downloadable_templates;
CREATE POLICY "Allow admins full access to downloadable templates"
ON public.downloadable_templates FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Allow public read access to published downloadable templates" ON public.downloadable_templates;
CREATE POLICY "Allow public read access to published downloadable templates"
ON public.downloadable_templates FOR SELECT
USING (status = 'published');

-- Professional Services
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admins full access to professional services" ON public.professional_services;
CREATE POLICY "Allow admins full access to professional services"
ON public.professional_services FOR ALL
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));
DROP POLICY IF EXISTS "Allow public read access to available professional services" ON public.professional_services;
CREATE POLICY "Allow public read access to available professional services"
ON public.professional_services FOR SELECT
USING (is_available = true);

-- Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to create comments" ON public.comments;
CREATE POLICY "Allow users to create comments" ON public.comments
FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.role() = 'authenticated') OR
    (auth.uid() IS NULL AND author_name IS NOT NULL AND author_email IS NOT NULL)
);
DROP POLICY IF EXISTS "Allow all users to read comments" ON public.comments;
CREATE POLICY "Allow all users to read comments" ON public.comments
FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow users to update their own comments" ON public.comments;
CREATE POLICY "Allow users to update their own comments" ON public.comments
FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow users to delete their own comments" ON public.comments;
CREATE POLICY "Allow users to delete their own comments" ON public.comments
FOR DELETE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Allow admins full access to comments" ON public.comments;
CREATE POLICY "Allow admins full access to comments" ON public.comments
FOR ALL USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Learn Sections
ALTER TABLE public.learn_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for learn_sections" ON public.learn_sections;
CREATE POLICY "Public read access for learn_sections" 
ON public.learn_sections 
FOR SELECT 
TO public 
USING (true);
DROP POLICY IF EXISTS "Admin full access to learn_sections" ON public.learn_sections;
CREATE POLICY "Admin full access to learn_sections"
ON public.learn_sections
FOR ALL
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));

-- Learn Cards
ALTER TABLE public.learn_cards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for learn_cards" ON public.learn_cards;
CREATE POLICY "Public read access for learn_cards" 
ON public.learn_cards 
FOR SELECT 
TO public 
USING (is_active = true);
DROP POLICY IF EXISTS "Admin full access to learn_cards" ON public.learn_cards;
CREATE POLICY "Admin full access to learn_cards"
ON public.learn_cards
FOR ALL
TO authenticated
USING (public.is_user_admin(auth.uid()))
WITH CHECK (public.is_user_admin(auth.uid()));
