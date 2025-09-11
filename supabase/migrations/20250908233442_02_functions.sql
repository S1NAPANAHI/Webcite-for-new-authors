-- Consolidated Function Definitions

-- Function to update updated_at timestamps
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Check if a user has admin privileges
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_admin(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.is_user_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = p_user_id
        AND role IN ('admin'::public.user_role, 'super_admin'::public.user_role)
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in is_user_admin: %', SQLERRM;
    RETURN FALSE;
END;
$$;

-- Alias for is_user_admin for backward compatibility
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
    SELECT public.is_user_admin(p_user_id);
$$;

-- Get user's role
DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID DEFAULT auth.uid())
RETURNS public.user_role
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_role public.user_role;
BEGIN
    SELECT role INTO v_role 
    FROM public.profiles 
    WHERE id = p_user_id;
    
    RETURN COALESCE(v_role, 'user'::public.user_role);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_user_role: %', SQLERRM;
    RETURN 'user'::public.user_role;
END;
$$;

-- Set up default roles for new users
DROP FUNCTION IF EXISTS public.setup_default_roles(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.setup_default_roles(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, 'user'::public.user_role) -- Assuming 'user' is a default role and user_role is an ENUM type
    ON CONFLICT (user_id) DO NOTHING; -- Prevents error if role already exists (e.g., if run multiple times)
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in setup_default_roles for user %: %', p_user_id, SQLERRM;
END;
$$;

-- Handle new user registration
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_username TEXT;
BEGIN
    -- Generate a username from email (before @ symbol)
    DECLARE
        v_user_email TEXT;
        v_display_name TEXT;
    BEGIN
    -- Get email from NEW.email or raw_user_meta_data
    v_user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');

    -- Get display name from raw_user_meta_data or generate from email
    v_display_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'user_name', split_part(v_user_email, '@', 1));

    -- Generate a username from email (before @ symbol)
    v_username := split_part(v_user_email, '@', 1);
    
    -- Ensure username is unique by appending a number if needed
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) THEN
        v_username := v_username || '_' || floor(random() * 1000)::TEXT;
    END IF;
    
    -- Create profile for new user
    INSERT INTO public.profiles (id, username, email, display_name)
    VALUES (NEW.id, v_username, v_user_email, v_display_name);
    
    -- Create user stats
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    -- Set up default roles
    PERFORM public.setup_default_roles(NEW.id);
    
    RETURN NEW;
    END; -- Added END for the inner block
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Get member count
DROP FUNCTION IF EXISTS public.get_member_count() CASCADE;
CREATE OR REPLACE FUNCTION public.get_member_count()
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.profiles);
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_member_count: %', SQLERRM;
    RETURN 0;
END;
$$;

-- Update profile beta status
DROP FUNCTION IF EXISTS public.update_profile_beta_status() CASCADE;
CREATE OR REPLACE FUNCTION public.update_profile_beta_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.status = 'approved' THEN
            UPDATE public.profiles 
            SET beta_reader_status = 'approved' 
            WHERE id = NEW.user_id;
        ELSIF NEW.status = 'denied' THEN
            UPDATE public.profiles 
            SET beta_reader_status = 'rejected' 
            WHERE id = NEW.user_id;
        ELSE
            UPDATE public.profiles 
            SET beta_reader_status = 'pending' 
            WHERE id = NEW.user_id;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in update_profile_beta_status: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Handle email change
DROP FUNCTION IF EXISTS public.handle_email_change() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_email_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

-- Generate slug from text
DROP FUNCTION IF EXISTS public.generate_slug(text) CASCADE;
CREATE OR REPLACE FUNCTION public.generate_slug(input_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '[^a-zA-Z0-9\s\-_]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$;

-- Get or create cart
DROP FUNCTION IF EXISTS public.get_or_create_cart(uuid, text) CASCADE;
CREATE OR REPLACE FUNCTION public.get_or_create_cart(
    p_user_id UUID DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    cart_id UUID;
BEGIN
    IF p_user_id IS NULL AND p_session_id IS NULL THEN
        RAISE EXCEPTION 'Either user_id or session_id must be provided';
    END IF;
    
    IF p_user_id IS NOT NULL THEN
        SELECT id INTO cart_id
        FROM public.shopping_carts
        WHERE user_id = p_user_id
        AND expires_at > now()
        ORDER BY updated_at DESC
        LIMIT 1;
    ELSE
        SELECT id INTO cart_id
        FROM public.shopping_carts
        WHERE session_id = p_session_id
        AND expires_at > now()
        ORDER BY updated_at DESC
        LIMIT 1;
    END IF;
    
    IF cart_id IS NULL THEN
        INSERT INTO public.shopping_carts (user_id, session_id, expires_at)
        VALUES (
            p_user_id, 
            p_session_id,
            now() + INTERVAL '30 days'
        )
        RETURNING id INTO cart_id;
    END IF;
    
    RETURN cart_id;
END;
$$;

-- Get user active subscription
DROP FUNCTION IF EXISTS public.get_user_active_subscription(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_active_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_name TEXT,
  status TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  privileges JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    sp.name,
    us.status,
    us.current_period_end,
    sp.privileges
  FROM public.subscriptions us
  JOIN public.subscription_plans sp ON us.plan_price_id = sp.stripe_price_id
  WHERE us.user_id = user_uuid 
    AND us.status IN ('active', 'trialing')
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific privilege
DROP FUNCTION IF EXISTS public.user_has_privilege(uuid, text) CASCADE;
CREATE OR REPLACE FUNCTION public.user_has_privilege(user_uuid UUID, privilege_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_privileges JSONB;
BEGIN
  SELECT privileges INTO user_privileges
  FROM public.get_user_active_subscription(user_uuid) gas
  JOIN public.subscription_plans sp ON sp.name = gas.plan_name
  LIMIT 1;
  
  IF user_privileges IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN COALESCE((user_privileges->privilege_name)::BOOLEAN, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if a user has an active subscription
DROP FUNCTION IF EXISTS public.has_active_subscription(p_user_id UUID);
CREATE OR REPLACE FUNCTION public.has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.subscriptions
        WHERE user_id = p_user_id
        AND status IN ('active', 'trialing')
    );
END;
$;

-- Create wiki page
DROP FUNCTION IF EXISTS public.create_wiki_page(text, text, jsonb, text, uuid, uuid, text, text, text[]) CASCADE;
CREATE OR REPLACE FUNCTION public.create_wiki_page(
    p_title text,
    p_slug text,
    p_content jsonb,
    p_excerpt text,
    p_category_id uuid,
    p_user_id uuid,
    p_seo_title text DEFAULT NULL,
    p_seo_description text DEFAULT NULL,
    p_seo_keywords text[] DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
    new_page_id uuid;
BEGIN
    INSERT INTO public.wiki_items (
        name, type, slug, content, excerpt, category_id, created_by,
        status, visibility,
        seo_title, seo_description, seo_keywords
    ) VALUES (
        p_title, 'page', p_slug, p_content, p_excerpt, p_category_id, p_user_id,
        'draft', 'public',
        p_seo_title, p_seo_description, p_seo_keywords
    ) RETURNING id INTO new_page_id;
    
    RETURN new_page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get child folders
DROP FUNCTION IF EXISTS public.get_child_folders(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_child_folders(parent_id uuid)
RETURNS TABLE(id uuid, level integer, name text, slug text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE folder_hierarchy AS (
    SELECT
      f.id,
      f.name,
      f.slug,
      1 AS level
    FROM
      public.wiki_items f
    WHERE
      f.parent_id = parent_id AND f.type = 'folder'

    UNION ALL

    SELECT
      f.id,
      f.name,
      f.slug,
      fh.level + 1
    FROM
      public.wiki_items f
    INNER JOIN
      folder_hierarchy fh ON f.parent_id = fh.id
    WHERE f.type = 'folder'
  )
  SELECT
    id,
    level,
    name,
    slug
  FROM
    folder_hierarchy;
END;
$$;

-- Get folder path
DROP FUNCTION IF EXISTS public.get_folder_path(folder_id uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_folder_path(folder_id uuid)
RETURNS TABLE(id uuid, level integer, name text, slug text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE folder_path AS (
    SELECT
      f.id,
      f.name,
      f.slug,
      1 AS level
    FROM
      public.wiki_items f
    WHERE
      f.id = folder_id AND f.type = 'folder'

    UNION ALL

    SELECT
      f.id,
      f.name,
      f.slug,
      fp.level + 1
    FROM
      public.wiki_items f
    INNER JOIN
      folder_path fp ON f.id = fp.parent_id
    WHERE f.type = 'folder'
  )
  SELECT
    id,
    level,
    name,
    slug
  FROM
    folder_path
  ORDER BY
    level DESC;
END;
$$;

-- Increment wiki page views
DROP FUNCTION IF EXISTS public.increment_wiki_page_views(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.increment_wiki_page_views(page_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.wiki_items
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = page_id AND type = 'page';
END;
$$;

-- Create product with variants
DROP FUNCTION IF EXISTS public.create_product_with_variants(jsonb, jsonb) CASCADE;
CREATE OR REPLACE FUNCTION public.create_product_with_variants(
    p_product_data JSONB,
    p_variants_data JSONB DEFAULT '[]'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    new_product_id UUID;
    variant_ids UUID[] := '{}';
    variant_record RECORD;
    result JSONB;
BEGIN
    -- Insert product
    INSERT INTO public.products (
        name, description, product_type, 
        slug, title, subtitle, cover_image_url, thumbnail_url, preview_url,
        file_key, file_size_bytes, file_type, page_count, word_count, isbn, publisher, language_code,
        is_bundle, is_subscription, is_premium, is_featured, is_digital, requires_shipping,
        active, status, published_at, metadata, seo_title, seo_description,
        stripe_product_id, images, track_inventory, inventory_quantity, allow_backorders, price_cents, sort_order, category_id, work_id, content_grants
    )
    VALUES (
        p_product_data->>'name',
        p_product_data->>'description',
        (p_product_data->>'product_type')::public.product_type,
        public.generate_slug(p_product_data->>'name'),
        p_product_data->>'title',
        p_product_data->>'subtitle',
        p_product_data->>'cover_image_url',
        p_product_data->>'thumbnail_url',
        p_product_data->>'preview_url',
        (p_product_data->>'file_key')::text,
        (p_product_data->>'file_size_bytes')::bigint,
        p_product_data->>'file_type',
        (p_product_data->>'page_count')::integer,
        (p_product_data->>'word_count')::integer,
        p_product_data->>'isbn',
        p_product_data->>'publisher',
        COALESCE(p_product_data->>'language_code', 'en'),
        COALESCE((p_product_data->>'is_bundle')::BOOLEAN, false),
        COALESCE((p_product_data->>'is_subscription')::BOOLEAN, false),
        COALESCE((p_product_data->>'is_premium')::BOOLEAN, false),
        COALESCE((p_product_data->>'is_featured')::BOOLEAN, false),
        COALESCE((p_product_data->>'is_digital')::BOOLEAN, true),
        COALESCE((p_product_data->>'requires_shipping')::BOOLEAN, false),
        COALESCE((p_product_data->>'active')::BOOLEAN, true),
        COALESCE(p_product_data->>'status', 'draft'),
        (p_product_data->>'published_at')::timestamptz,
        COALESCE(p_product_data->'metadata', '{}'::jsonb),
        p_product_data->>'seo_title',
        p_product_data->>'seo_description',
        p_product_data->>'stripe_product_id',
        COALESCE((p_product_data->'images')::TEXT[], '{}'),
        COALESCE((p_product_data->>'track_inventory')::BOOLEAN, false),
        COALESCE((p_product_data->>'inventory_quantity')::INTEGER, 0),
        COALESCE((p_product_data->>'allow_backorders')::BOOLEAN, false),
        (p_product_data->>'price_cents')::INTEGER,
        (p_product_data->>'sort_order')::INTEGER,
        (p_product_data->>'category_id')::UUID,
        (p_product_data->>'work_id')::UUID,
        COALESCE(p_product_data->'content_grants', '[]'::jsonb)
    )
    RETURNING id INTO new_product_id;

    -- Insert variants if provided
    IF jsonb_array_length(p_variants_data) > 0 THEN
        FOR variant_record IN 
            SELECT * FROM jsonb_array_elements(p_variants_data)
        LOOP
            DECLARE
                new_variant_id UUID;
            BEGIN
                INSERT INTO public.product_variants (
                    product_id, name, sku, description, price_amount, price_currency,
                    compare_at_amount, cost_amount, cost_currency, tax_code, tax_included,
                    track_inventory, inventory_quantity, inventory_policy, inventory_management, low_stock_threshold,
                    barcode, barcode_type, weight_grams, weight_unit, height_cm, width_cm, depth_cm, dimension_unit,
                    requires_shipping, is_digital, digital_file_url, digital_file_name, digital_file_size_bytes,
                    is_active, is_default, option1, option2, option3, position, metadata, stripe_price_id
                )
                VALUES (
                    new_product_id,
                    variant_record.value->>'name',
                    variant_record.value->>'sku',
                    variant_record.value->>'description',
                    (variant_record.value->>'price_amount')::decimal,
                    COALESCE(variant_record.value->>'price_currency', 'USD'),
                    (variant_record.value->>'compare_at_amount')::decimal,
                    (variant_record.value->>'cost_amount')::decimal,
                    variant_record.value->>'cost_currency',
                    variant_record.value->>'tax_code',
                    COALESCE((variant_record.value->>'tax_included')::BOOLEAN, false),
                    COALESCE((variant_record.value->>'track_inventory')::BOOLEAN, true),
                    COALESCE((variant_record.value->>'inventory_quantity')::INTEGER, 0),
                    COALESCE(variant_record.value->>'inventory_policy', 'deny'),
                    variant_record.value->>'inventory_management',
                    COALESCE((variant_record.value->>'low_stock_threshold')::INTEGER, 5),
                    variant_record.value->>'barcode',
                    variant_record.value->>'barcode_type',
                    (variant_record.value->>'weight_grams')::decimal,
                    COALESCE(variant_record.value->>'weight_unit', 'g'),
                    (variant_record.value->>'height_cm')::decimal,
                    (variant_record.value->>'width_cm')::decimal,
                    (variant_record.value->>'depth_cm')::decimal,
                    COALESCE(variant_record.value->>'dimension_unit', 'cm'),
                    COALESCE((variant_record.value->>'requires_shipping')::BOOLEAN, true),
                    COALESCE((variant_record.value->>'is_digital')::BOOLEAN, false),
                    variant_record.value->>'digital_file_url',
                    variant_record.value->>'digital_file_name',
                    (variant_record.value->>'digital_file_size_bytes')::bigint,
                    COALESCE((variant_record.value->>'is_active')::BOOLEAN, true),
                    COALESCE((variant_record.value->>'is_default')::BOOLEAN, false),
                    variant_record.value->>'option1',
                    variant_record.value->>'option2',
                    variant_record.value->>'option3',
                    COALESCE((variant_record.value->>'position')::INTEGER, 0),
                    COALESCE(variant_record.value->'metadata', '{}'::jsonb),
                    variant_record.value->>'stripe_price_id'
                )
                RETURNING id INTO new_variant_id;
                
                variant_ids := variant_ids || new_variant_id;
            END;
        END LOOP;
    END IF;

    -- Build result
    result := jsonb_build_object(
        'product_id', new_product_id,
        'variant_ids', to_jsonb(variant_ids)
    );

    RETURN result;
END;
$$;

-- Update inventory
DROP FUNCTION IF EXISTS public.update_inventory(uuid, uuid, integer, text, text, text, uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.update_inventory(uuid, integer, text) CASCADE;
CREATE OR REPLACE FUNCTION public.update_inventory(
    p_variant_id UUID,
    p_quantity_change INTEGER,
    p_operation TEXT DEFAULT 'increment'
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_quantity integer;
    v_current_quantity integer;
    v_track_inventory boolean;
    v_product_id uuid;
BEGIN
    -- Get current quantity and track_inventory status
    SELECT 
        inventory_quantity, 
        track_inventory,
        product_id
    INTO 
        v_current_quantity, 
        v_track_inventory,
        v_product_id
    FROM public.product_variants
    WHERE id = p_variant_id
    FOR UPDATE;
    
    IF v_track_inventory = false THEN
        RETURN v_current_quantity;
    END IF;
    
    IF p_operation = 'set' THEN
        v_new_quantity := p_quantity_change;
    ELSE
        v_new_quantity := v_current_quantity + p_quantity_change;
    END IF;
    
    IF v_new_quantity < 0 THEN
        RAISE EXCEPTION 'Insufficient inventory';
    END IF;
    
    UPDATE public.product_variants
    SET 
        inventory_quantity = v_new_quantity,
        updated_at = NOW()
    WHERE id = p_variant_id;
    
    UPDATE public.products
    SET updated_at = NOW()
    WHERE id = v_product_id;
    
    RETURN v_new_quantity;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to update inventory: %', SQLERRM;
END;
$$;

-- Get variant pricing information
DROP FUNCTION IF EXISTS public.get_variant_pricing(uuid, boolean) CASCADE;
CREATE OR REPLACE FUNCTION public.get_variant_pricing(
    p_variant_id uuid,
    p_include_tax boolean DEFAULT false
)
RETURNS TABLE (
    variant_id uuid,
    price_amount decimal(12, 2),
    price_currency text,
    compare_at_amount decimal(12, 2),
    tax_amount decimal(12, 2),
    total_amount decimal(12, 2),
    on_sale boolean,
    discount_percent integer,
    discount_amount decimal(12, 2)
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        v.id AS variant_id,
        v.price_amount,
        v.price_currency,
        v.compare_at_amount,
        CASE 
            WHEN p_include_tax AND v.tax_code IS NOT NULL 
            THEN ROUND(v.price_amount * 0.1, 2)
            ELSE 0 
        END AS tax_amount,
        CASE 
            WHEN p_include_tax AND v.tax_code IS NOT NULL 
            THEN ROUND(v.price_amount * 1.1, 2)
            ELSE v.price_amount 
        END AS total_amount,
        COALESCE(v.compare_at_amount > v.price_amount, false) AS on_sale,
        CASE 
            WHEN v.compare_at_amount IS NOT NULL AND v.compare_at_amount > 0 
            THEN ROUND(((v.compare_at_amount - v.price_amount) / v.compare_at_amount) * 100)::integer 
            ELSE NULL 
        END AS discount_percent,
        COALESCE(v.compare_at_amount - v.price_amount, 0) AS discount_amount
    FROM public.product_variants v
    WHERE v.id = p_variant_id;
$$;

-- Get the default variant for a product
DROP FUNCTION IF EXISTS public.get_default_variant(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_default_variant(p_product_id uuid)
RETURNS SETOF public.product_variants
LANGUAGE sql
STABLE
AS $$
    SELECT v.*
    FROM public.product_variants v
    WHERE v.product_id = p_product_id
    AND v.is_active = true
    ORDER BY v.is_default DESC, v.position, v.price_amount, v.created_at
    LIMIT 1;
$$;

-- Check if a variant is in stock
DROP FUNCTION IF EXISTS public.is_variant_in_stock(uuid, integer) CASCADE;
CREATE OR REPLACE FUNCTION public.is_variant_in_stock(p_variant_id uuid, p_quantity integer DEFAULT 1)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
    SELECT 
        CASE 
            WHEN track_inventory = false THEN true
            ELSE inventory_quantity >= p_quantity 
        END
    FROM public.product_variants
    WHERE id = p_variant_id;
$$;

-- Generate order number
DROP FUNCTION IF EXISTS public.generate_order_number() CASCADE;
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    attempt INTEGER := 0;
    max_attempts INTEGER := 10;
BEGIN
    LOOP
        new_number := 'ZV-' || to_char(now(), 'YYYYMMDD') || '-' || 
                     LPAD(floor(random() * 99999)::TEXT, 5, '0');
        
        IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_number) THEN
            RETURN new_number;
        END IF;
        
        attempt := attempt + 1;
        IF attempt >= max_attempts THEN
            RAISE EXCEPTION 'Failed to generate unique order number after % attempts', max_attempts;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create order
DROP FUNCTION IF EXISTS public.create_order(uuid, text, jsonb, jsonb, jsonb[], numeric, text, text) CASCADE;
CREATE OR REPLACE FUNCTION public.create_order(
    p_user_id uuid,
    p_customer_email text,
    p_billing_address jsonb,
    p_shipping_address jsonb,
    p_items jsonb[],
    p_shipping_amount decimal(12, 2) DEFAULT 0,
    p_payment_method text DEFAULT NULL,
    p_customer_note text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id uuid;
    v_order_number text;
    v_subtotal decimal(12, 2) := 0;
    v_tax_total decimal(12, 2) := 0;
    v_discount_total decimal(12, 2) := 0;
    v_item record;
    v_variant record;
    v_total decimal(12, 2);
BEGIN
    v_order_number := public.generate_order_number();
    
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items::jsonb) AS item
    LOOP
        SELECT * INTO v_variant 
        FROM public.product_variants 
        WHERE id = (v_item->>'variant_id')::uuid
        FOR UPDATE;
        
        IF v_variant.id IS NULL THEN
            RAISE EXCEPTION 'Variant not found';
        END IF;
        
        IF v_variant.track_inventory AND v_variant.inventory_quantity < (v_item->>'quantity')::integer THEN
            RAISE EXCEPTION 'Insufficient inventory for variant %', v_variant.sku;
        END IF;
        
        v_subtotal := v_subtotal + ((v_item->>'price')::decimal * (v_item->>'quantity')::integer);
        v_tax_total := v_tax_total + COALESCE((v_item->>'tax_amount')::decimal, 0);
        v_discount_total := v_discount_total + COALESCE((v_item->>'discount_amount')::decimal, 0);
    END LOOP;
    
    v_total := v_subtotal + v_tax_total + p_shipping_amount - v_discount_total;
    
    INSERT INTO public.orders (
        user_id,
        order_number,
        email,
        notes,
        billing_address,
        shipping_address,
        subtotal,
        shipping_amount,
        tax_amount,
        discount_amount,
        total_amount,
        payment_status,
        status,
        currency
    ) VALUES (
        p_user_id,
        v_order_number,
        p_customer_email,
        p_customer_note,
        p_billing_address,
        p_shipping_address,
        v_subtotal,
        p_shipping_amount,
        v_tax_total,
        v_discount_total,
        v_total,
        'unpaid',
        'pending',
        'usd'
    )
    RETURNING id INTO v_order_id;
    
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items::jsonb) AS item
    LOOP
        SELECT p.name, p.description, v.sku, v.barcode, v.is_digital, v.digital_file_url
        INTO v_variant
        FROM public.products p
        LEFT JOIN public.product_variants v ON v.id = (v_item->>'variant_id')::uuid
        WHERE p.id = (v_item->>'product_id')::uuid;
        
        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            description,
            sku,
            quantity,
            unit_amount,
            total_amount,
            access_granted,
            access_granted_at,
            stripe_price_id,
            variant_name
        ) VALUES (
            v_order_id,
            (v_item->>'product_id')::uuid,
            (v_item->>'variant_id')::uuid,
            COALESCE(v_variant.name, 'Product'),
            v_variant.description,
            v_variant.sku,
            (v_item->>'quantity')::integer,
            (v_item->>'price')::integer,
            ((v_item->>'price')::integer * (v_item->>'quantity')::integer),
            COALESCE(v_variant.is_digital, false),
            CASE WHEN COALESCE(v_variant.is_digital, false) THEN NOW() ELSE NULL END,
            v_item->>'stripe_price_id',
            v_variant.name
        );
        
        IF v_variant.track_inventory THEN
            PERFORM public.update_inventory(
                (v_item->>'variant_id')::uuid,
                -((v_item->>'quantity')::integer)
            );
        END IF;
    END LOOP;
    
    RETURN v_order_id;
EXCEPTION WHEN OTHERS THEN
    IF v_order_id IS NOT NULL THEN
        DELETE FROM public.order_items WHERE order_id = v_order_id;
        DELETE FROM public.orders WHERE id = v_order_id;
    END IF;
    
    RAISE EXCEPTION 'Failed to create order: %', SQLERRM;
END;
$$;

-- Update order timestamps
DROP FUNCTION IF EXISTS public.update_order_timestamps() CASCADE;
CREATE OR REPLACE FUNCTION public.update_order_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Update order item updated_at
DROP FUNCTION IF EXISTS public.update_order_item_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_order_item_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Update order totals when order items change
DROP FUNCTION IF EXISTS public.update_order_totals() CASCADE;
CREATE OR REPLACE FUNCTION public.update_order_totals()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM public.recalculate_order_totals(OLD.order_id);
        RETURN OLD;
    ELSE
        PERFORM public.recalculate_order_totals(NEW.order_id);
        RETURN NEW;
    END IF;
END;
$$;

-- Recalculate order totals
DROP FUNCTION IF EXISTS public.recalculate_order_totals(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.recalculate_order_totals(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.orders o
    SET 
        subtotal = COALESCE(
            (SELECT SUM(unit_amount * quantity) 
             FROM public.order_items 
             WHERE order_id = p_order_id
             GROUP BY order_id),
            0
        ),
        tax_amount = COALESCE(
            (SELECT SUM(tax_amount) 
             FROM public.order_items 
             WHERE order_id = p_order_id
             GROUP BY order_id),
            0
        ),
        discount_amount = COALESCE(
            (SELECT SUM(discount_amount) 
             FROM public.order_items 
             WHERE order_id = p_order_id
             GROUP BY order_id),
            0
        ),
        total_amount = COALESCE(
            (SELECT SUM(total_amount) 
             FROM public.order_items 
             WHERE order_id = p_order_id
             GROUP BY order_id),
            0
        ) + COALESCE(
            (SELECT shipping_amount FROM public.orders WHERE id = p_order_id),
            0
        ),
        updated_at = NOW()
    WHERE id = p_order_id;
END;
$$;

-- Get product price range
DROP FUNCTION IF EXISTS public.get_product_price_range(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_product_price_range(p_product_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
    SELECT jsonb_build_object(
        'min_price', MIN(price_amount),
        'max_price', MAX(price_amount),
        'currency', MAX(price_currency),
        'has_discount', BOOL_OR(compare_at_amount IS NOT NULL AND compare_at_amount > price_amount)
    )
    FROM public.product_variants
    WHERE product_id = p_product_id
    AND is_active = true;
$$;

-- Update subscription updated_at
DROP FUNCTION IF EXISTS public.update_subscription_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    
    IF NEW.status = 'canceled' AND OLD.status != 'canceled' AND NEW.cancel_at_period_end = true THEN
        NEW.ended_at = NEW.current_period_end;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Update subscription item updated_at
DROP FUNCTION IF EXISTS public.update_subscription_item_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_subscription_item_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Update order status
DROP FUNCTION IF EXISTS public.update_order_status(uuid, public.order_status, text) CASCADE;
CREATE OR REPLACE FUNCTION public.update_order_status(
    p_order_id uuid,
    p_status public.order_status,
    p_note text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_old_status public.order_status;
    v_user_id uuid := auth.uid();
BEGIN
    SELECT status INTO v_old_status
    FROM public.orders
    WHERE id = p_order_id
    FOR UPDATE;
    
    UPDATE public.orders
    SET 
        status = p_status,
        updated_at = NOW()
    WHERE id = p_order_id;
    
    IF p_note IS NOT NULL THEN
        INSERT INTO public.order_notes (
            order_id,
            user_id,
            note,
            is_visible_to_customer,
            is_customer_notified
        ) VALUES (
            p_order_id,
            v_user_id,
            'Status changed from ' || v_old_status || ' to ' || p_status || ': ' || p_note,
            true,
            true
        );
    END IF;
    
    IF p_status = 'paid' THEN
        UPDATE public.orders
        SET 
            payment_status = 'paid',
            confirmed_at = NOW(),
            updated_at = NOW()
        WHERE id = p_order_id;
        
        INSERT INTO public.order_notes (
            order_id,
            user_id,
            note,
            is_visible_to_customer,
            is_customer_notified
        ) VALUES (
            p_order_id,
            v_user_id,
            'Payment received',
            true,
            true
        );
        
    ELSIF p_status = 'cancelled' THEN
        PERFORM public.restore_inventory_for_order(p_order_id);
    END IF;
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to update order status: %', SQLERRM;
END;
$$;

-- Restore inventory for a cancelled order
DROP FUNCTION IF EXISTS public.restore_inventory_for_order(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.restore_inventory_for_order(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item record;
BEGIN
    FOR v_item IN 
        SELECT variant_id, quantity 
        FROM public.order_items 
        WHERE order_id = p_order_id
        AND variant_id IS NOT NULL
    LOOP
        PERFORM public.update_inventory(
            v_item.variant_id,
            v_item.quantity
        );
    END LOOP;
    
    INSERT INTO public.order_notes (
        order_id,
        user_id,
        note,
        is_visible_to_customer,
        is_customer_notified
    ) VALUES (
        p_order_id,
        auth.uid(),
        'Inventory restored for cancelled order',
        false,
        false
    );
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to restore inventory: %', SQLERRM;
END;
$$;

-- Get order totals for reporting
DROP FUNCTION IF EXISTS public.get_order_totals(timestamptz, timestamptz, public.order_status) CASCADE;
CREATE OR REPLACE FUNCTION public.get_order_totals(
    p_start_date timestamptz DEFAULT NULL,
    p_end_date timestamptz DEFAULT NULL,
    p_status public.order_status DEFAULT NULL
)
RETURNS TABLE (
    order_count bigint,
    total_sales decimal(12, 2),
    total_tax decimal(12, 2),
    total_shipping decimal(12, 2),
    total_discounts decimal(12, 2),
    net_sales decimal(12, 2)
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        COUNT(*)::bigint AS order_count,
        COALESCE(SUM(total_amount), 0) AS total_sales,
        COALESCE(SUM(tax_amount), 0) AS total_tax,
        COALESCE(SUM(shipping_amount), 0) AS total_shipping,
        COALESCE(SUM(discount_amount), 0) AS total_discounts,
        COALESCE(SUM(subtotal), 0) AS net_sales
    FROM public.orders
    WHERE 
        (p_start_date IS NULL OR created_at >= p_start_date)
        AND (p_end_date IS NULL OR created_at <= p_end_date)
        AND (p_status IS NULL OR status = p_status::text)
        AND status NOT IN ('cancelled', 'refunded');
$$;

-- Get customer order history
DROP FUNCTION IF EXISTS public.get_customer_order_history(uuid, integer, integer) CASCADE;
CREATE OR REPLACE FUNCTION public.get_customer_order_history(
    p_user_id uuid,
    p_limit integer DEFAULT 10,
    p_offset integer DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    order_number text,
    status public.order_status,
    total_amount decimal(12, 2),
    currency text,
    item_count bigint,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        o.id,
        o.order_number,
        o.status::public.order_status,
        o.total_amount,
        o.currency,
        COUNT(oi.id)::bigint AS item_count,
        o.created_at,
        o.updated_at
    FROM public.orders o
    LEFT JOIN public.order_items oi ON oi.order_id = o.id
    WHERE o.user_id = p_user_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
$$;

-- Get order details
DROP FUNCTION IF EXISTS public.get_order_details(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.get_order_details(p_order_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
    SELECT jsonb_build_object(
        'order', to_jsonb(o.*) - 'user_id',
        'items', COALESCE(
            (SELECT jsonb_agg(to_jsonb(oi.*) - 'order_id')
             FROM public.order_items oi
             WHERE oi.order_id = o.id),
            '[]'::jsonb
        ),
        'notes', COALESCE(
            (SELECT jsonb_agg(jsonb_build_object(
                'id', ono.id,
                'note', ono.note,
                'created_at', ono.created_at,
                'is_visible_to_customer', ono.is_visible_to_customer,
                'is_customer_notified', ono.is_customer_notified
            ) ORDER BY ono.created_at DESC)
            FROM public.order_notes ono
            WHERE ono.order_id = o.id),
            '[]'::jsonb
        ),
        'shipments', COALESCE(
            (SELECT jsonb_agg((to_jsonb(os.*) - 'order_id') ORDER BY os.created_at DESC)
             FROM public.order_shipments os
             WHERE os.order_id = o.id),
            '[]'::jsonb
        ),
        'refunds', COALESCE(
            (SELECT jsonb_agg((to_jsonb(orf.*) - 'order_id') ORDER BY orf.created_at DESC)
             FROM public.order_refunds orf
             WHERE orf.order_id = o.id),
            '[]'::jsonb
        )
    )
    FROM public.orders o
    WHERE o.id = p_order_id;
$$;

-- Function to update reading statistics
DROP FUNCTION IF EXISTS public.update_reading_stats() CASCADE;
CREATE OR REPLACE FUNCTION public.update_reading_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_content_type TEXT;
    v_is_completed BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        v_user_id := NEW.user_id;
        v_content_type := NEW.content_type;
        v_is_completed := NEW.is_completed;
    ELSIF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
        v_content_type := OLD.content_type;
        v_is_completed := OLD.is_completed;
    END IF;

    -- Update total chapters read if content type is 'chapter' and it's completed
    IF v_content_type = 'chapter' AND v_is_completed THEN
        UPDATE public.user_stats
        SET chapters_read = chapters_read + 1
        WHERE user_id = v_user_id;
    END IF;

    -- Update books completed if content type is 'work' and it's completed
    IF v_content_type = 'work' AND v_is_completed THEN
        UPDATE public.user_stats
        SET books_read = books_read + 1
        WHERE user_id = v_user_id;
    END IF;

    RETURN NEW;
END;
$$;