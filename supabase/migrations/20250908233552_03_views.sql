-- Consolidated View Definitions

-- detailed_audit_log view
DROP VIEW IF EXISTS public.detailed_audit_log CASCADE;
CREATE OR REPLACE VIEW public.detailed_audit_log AS
SELECT
  al.id,
  al.action,
  al.created_at,
  al.actor_user_id,
  p.username AS actor_username,
  p.display_name AS actor_display_name
FROM
  public.audit_log al
LEFT JOIN
  public.profiles p ON al.actor_user_id = p.id;

-- active_subscribers view
DROP VIEW IF EXISTS public.active_subscribers CASCADE;
CREATE OR REPLACE VIEW public.active_subscribers AS
SELECT 
    p.id,
    p.username,
    p.display_name,
    p.subscription_tier,
    s.plan_id,
    s.current_period_end,
    s.status
FROM public.profiles p
JOIN public.subscriptions s ON p.id = s.user_id
WHERE s.status IN ('active', 'trialing');

-- user_dashboard_stats view
DROP VIEW IF EXISTS public.user_dashboard_stats CASCADE;
CREATE OR REPLACE VIEW public.user_dashboard_stats AS
SELECT 
    p.id as user_id,
    p.username,
    p.display_name,
    p.email,
    p.role,
    p.beta_reader_status,
    p.subscription_tier,
    p.profile_visibility as visibility,
    p.created_at as member_since,
    p.last_active_at,
    us.total_reading_minutes,
    us.books_read,
    us.chapters_read,
    us.current_streak_days,
    us.achievements_unlocked,
    us.level_reached,
    us.last_activity_date,
    -- Calculate reading stats
    ROUND(us.total_reading_minutes / 60.0, 1) as total_reading_hours,
    CASE 
        WHEN us.books_read > 0 THEN ROUND(us.total_reading_minutes::numeric / us.books_read, 1)
        ELSE 0 
    END as minutes_per_book,
    -- Account age in days
    EXTRACT(DAY FROM (NOW() - p.created_at)) as account_age_days
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id
WHERE p.profile_visibility = 'public' OR 
      p.id = auth.uid() OR
      EXISTS (
          SELECT 1 FROM public.friends 
          WHERE (user_id = auth.uid() AND friend_id = p.id) 
          OR (user_id = p.id AND friend_id = auth.uid())
      );

-- content_with_access view
DROP VIEW IF EXISTS public.content_with_access CASCADE;
CREATE OR REPLACE VIEW public.content_with_access AS
SELECT 
    w.*,
    CASE 
        WHEN w.is_free = true THEN true
        WHEN auth.uid() IS NULL THEN false
        ELSE public.has_active_subscription(auth.uid())
    END as user_has_access
FROM public.works w
WHERE w.status = 'published';

-- analytics_summary view
DROP VIEW IF EXISTS public.analytics_summary CASCADE;
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT 
    (SELECT COUNT(*) FROM public.profiles) as total_members,
    (SELECT COUNT(*) FROM public.active_subscribers) as active_subscribers,
    (SELECT COUNT(*) FROM public.works WHERE status = 'published') as published_works,
    (SELECT COUNT(*) FROM public.chapters WHERE is_published = true) as published_chapters,
    (SELECT COUNT(*) FROM public.wiki_items WHERE status = 'published' AND type = 'page') as wiki_pages,
    (SELECT COALESCE(SUM(view_count), 0) FROM public.wiki_items WHERE type = 'page') as total_content_views;

-- wiki_page_tree_view
DROP VIEW IF EXISTS public.wiki_page_tree_view CASCADE;
CREATE OR REPLACE VIEW public.wiki_page_tree_view AS
WITH RECURSIVE wiki_tree AS (
    -- Base case: root level items (no parent or parent not found)
    SELECT 
        id,
        name as title,
        slug,
        parent_id,
        created_by,
        status,
        created_at,
        updated_at,
        ARRAY[name] AS path,
        ARRAY[slug] AS slug_path,
        1 AS level,
        name AS full_title,
        slug AS full_slug
    FROM public.wiki_items
    WHERE parent_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM public.wiki_items parent WHERE parent.id = public.wiki_items.parent_id
    )
    
    UNION ALL
    
    -- Recursive case: child items
    SELECT 
        c.id,
        c.name as title,
        c.slug,
        c.parent_id,
        c.created_by,
        c.status,
        c.created_at,
        c.updated_at,
        p.path || c.name,
        p.slug_path || c.slug,
        p.level + 1,
        p.full_title || ' > ' || c.name,
        p.full_slug || '/' || c.slug
    FROM public.wiki_items c
    JOIN wiki_tree p ON c.parent_id = p.id
)
SELECT 
    id,
    title,
    slug,
    parent_id,
    created_by,
    status,
    created_at,
    updated_at,
    path,
    slug_path,
    level,
    full_title,
    full_slug,
    array_to_string(path, ' > ') AS breadcrumb,
    array_to_string(slug_path, '/') AS url_path
FROM wiki_tree
ORDER BY path;

-- wiki_latest_revisions_view
DROP VIEW IF EXISTS public.wiki_latest_revisions_view CASCADE;
CREATE OR REPLACE VIEW public.wiki_latest_revisions_view AS
WITH latest_revisions AS (
    SELECT 
        page_id,
        MAX(created_at) AS latest_revision_date
    FROM public.wiki_revisions
    GROUP BY page_id
)
SELECT 
    wi.id AS wiki_item_id,
    wi.name AS title,
    wi.slug,
    wi.parent_id,
    wi.status,
    wr.id AS revision_id,
    wr.title AS revision_title,
    wr.change_summary AS revision_summary,
    wr.created_at AS revised_at,
    wr.created_by AS revised_by,
    -- Get content preview (first 200 characters of the first content block)
    (
        SELECT substring(wcb.content::text, 1, 200) || 
               CASE WHEN length(wcb.content::text) > 200 THEN '...' ELSE '' END
        FROM public.wiki_content_blocks wcb
        WHERE wcb.page_id = wi.id
        ORDER BY wcb.position
        LIMIT 1
    ) AS content_preview,
    -- Count of content blocks
    (
        SELECT count(*) 
        FROM public.wiki_content_blocks wcb 
        WHERE wcb.page_id = wi.id
    ) AS content_block_count
FROM public.wiki_items wi
JOIN public.wiki_revisions wr ON wr.page_id = wi.id
JOIN latest_revisions lr ON lr.page_id = wi.id AND lr.latest_revision_date = wr.created_at
ORDER BY wr.created_at DESC;

-- wiki_search_view
DROP VIEW IF EXISTS public.wiki_search_view CASCADE;
CREATE OR REPLACE VIEW public.wiki_search_view AS
SELECT 
    wi.id AS wiki_item_id,
    wi.name AS title,
    wi.slug,
    wi.status,
    wi.created_at,
    wi.updated_at,
    wr.id AS revision_id,
    wr.created_at AS revised_at,
    wr.created_by AS revised_by,
    setweight(to_tsvector('english', coalesce(wi.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(wr.content::text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(wr.change_summary, '')), 'C') AS search_vector
FROM public.wiki_items wi
JOIN public.wiki_revisions wr ON wr.page_id = wi.id
JOIN (
    SELECT page_id, MAX(created_at) AS latest_revision
    FROM public.wiki_revisions
    GROUP BY page_id
) lr ON lr.page_id = wr.page_id AND lr.latest_revision = wr.created_at;

-- product_catalog view
DROP VIEW IF EXISTS public.product_catalog CASCADE;
CREATE OR REPLACE VIEW public.product_catalog AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.description,
    p.slug,
    p.status,
    p.is_featured AS featured,
    p.metadata,
    p.created_at,
    p.updated_at,
    
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', pv.id,
                'name', COALESCE(pv.name, p.name),
                'sku', pv.sku,
                'price', pv.price_amount,
                'compare_at_price', pv.compare_at_amount,
                'inventory_quantity', pv.inventory_quantity,
                'is_active', pv.is_active
            )
            ORDER BY pv.position, pv.id
        )
        FROM public.product_variants pv
        WHERE pv.product_id = p.id
        AND pv.is_active = true
    ) AS variants,
    
    (
        SELECT jsonb_agg(
            jsonb_build_object(
                'id', pc.id,
                'name', pc.name,
                'slug', pc.slug,
                'description', pc.description
            )
        )
        FROM public.product_categories pc
        JOIN public.product_category_relations pcr ON pc.id = pcr.category_id
        WHERE pcr.product_id = p.id
    ) AS categories,
    
    (
        SELECT MIN(pv.price_amount)
        FROM public.product_variants pv
        WHERE pv.product_id = p.id
        AND pv.is_active = true
    ) AS min_price,
    
    (
        SELECT MAX(pv.price_amount)
        FROM public.product_variants pv
        WHERE pv.product_id = p.id
        AND pv.is_active = true
    ) AS max_price,
    
    (
        SELECT bool_or(pv.inventory_quantity > 0)
        FROM public.product_variants pv
        WHERE pv.product_id = p.id
        AND pv.is_active = true
    ) AS in_stock
    
FROM public.products p
WHERE p.status = 'published';

-- customer_order_history view
DROP VIEW IF EXISTS public.customer_order_history CASCADE;
CREATE OR REPLACE VIEW public.customer_order_history AS
WITH order_items_aggregated AS (
    SELECT 
        oi.order_id,
        jsonb_agg(
            jsonb_build_object(
                'id', oi.id,
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'variant_id', oi.variant_id,
                'variant_name', oi.variant_name,
                'sku', oi.sku,
                'quantity', oi.quantity,
                'unit_amount', oi.unit_amount,
                'total_amount', oi.total_amount
            )
            ORDER BY oi.created_at DESC
        ) AS items
    FROM 
        public.order_items oi
    GROUP BY 
        oi.order_id
)
SELECT 
    o.id AS order_id,
    o.order_number,
    o.user_id,
    o.status,
    o.subtotal,
    o.tax_amount,
    o.discount_amount,
    o.shipping_amount,
    o.total_amount,
    o.currency,
    o.payment_status,
    o.fulfillment_status,
    o.email,
    o.phone,
    o.billing_address,
    o.shipping_address,
    o.notes,
    o.admin_notes,
    o.promotion_code,
    o.created_at,
    o.updated_at,
    o.confirmed_at,
    o.shipped_at,
    o.delivered_at,
    oia.items AS order_items
FROM 
    public.orders o
    LEFT JOIN order_items_aggregated oia ON o.id = oia.order_id;

-- subscription_details view
DROP VIEW IF EXISTS public.subscription_details CASCADE;
CREATE OR REPLACE VIEW public.subscription_details AS
WITH subscription_usage AS (
    SELECT 
        user_id,
        subscription_id,
        feature_name,
        SUM(usage_count) AS current_usage,
        MAX(usage_limit) AS usage_limit,
        MAX(period_start) AS current_period_start,
        MAX(period_end) AS current_period_end,
        ROUND((SUM(usage_count)::decimal / NULLIF(MAX(usage_limit)::decimal, 0)) * 100, 2) AS usage_percentage
    FROM 
        public.subscription_usage
    WHERE 
        period_start <= CURRENT_DATE 
        AND period_end >= CURRENT_DATE
    GROUP BY 
        user_id, subscription_id, feature_name
),
subscription_invoices_agg AS (
    SELECT 
        si.subscription_id,
        jsonb_agg(
            jsonb_build_object(
                'id', si.id,
                'invoice_number', si.invoice_number,
                'amount_due', si.amount_due,
                'amount_paid', si.amount_paid,
                'status', si.status,
                'billing_reason', si.billing_reason,
                'period_start', si.period_start,
                'period_end', si.period_end,
                'paid_at', si.paid_at,
                'created_at', si.created_at,
                'pdf_url', si.invoice_pdf_url
            )
            ORDER BY si.created_at DESC
        ) AS invoices
    FROM 
        public.subscription_invoices si
    GROUP BY 
        si.subscription_id
)
SELECT 
    s.id AS subscription_id,
    s.user_id,
    p.email AS user_email,
    p.display_name AS profile_name,
    
    s.plan_id,
    spl.name AS plan_name,
    spl.description AS plan_description,
    spl.billing_interval AS billing_interval,
    spl.interval_count,
    s.status,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.canceled_at,
    s.ended_at,
    s.trial_start,
    s.trial_end,
    s.days_until_due,
    s.billing_cycle_anchor,
    s.metadata,
    s.created_at,
    s.updated_at,
    
    spl.price_amount AS plan_amount,
    spl.currency AS plan_currency,
    spl.trial_period_days,
    spl.metadata AS plan_metadata,
    
    (SELECT jsonb_agg(
            jsonb_build_object(
                'feature_name', su.feature_name,
                'current_usage', su.current_usage,
                'usage_limit', su.usage_limit,
                'usage_percentage', su.usage_percentage,
                'period_start', su.current_period_start,
                'period_end', su.current_period_end
            )
        )
        FROM subscription_usage su
        WHERE su.subscription_id = s.id
    ) AS usage_metrics,
    
    COALESCE(sia.invoices, '[]'::jsonb) AS invoices,
    
    CASE 
        WHEN s.status = 'active' AND s.cancel_at_period_end = false THEN
            jsonb_build_object(
                'amount_due', spl.price_amount,
                'due_date', s.current_period_end,
                'days_until_due', (s.current_period_end - CURRENT_DATE)
            )
        ELSE NULL
    END AS next_payment,
    
    CASE 
        WHEN s.status = 'trialing' THEN true
        ELSE false
    END AS is_trialing,
    
    CASE 
        WHEN s.status = 'active' AND s.cancel_at_period_end = true THEN true
        ELSE false
    END AS is_canceling,
    
    CASE 
        WHEN s.status = 'active' AND s.trial_end IS NOT NULL AND s.trial_end > NOW() THEN true
        ELSE false
    END AS is_in_trial,
    
    CASE 
        WHEN s.status = 'active' AND s.current_period_end - INTERVAL '7 days' <= NOW() THEN true
        ELSE false
    END AS is_up_for_renewal_soon
    
FROM 
    public.subscriptions s
    LEFT JOIN public.profiles p ON s.user_id = p.id
    LEFT JOIN public.subscription_plans spl ON s.plan_id = spl.stripe_price_id -- Assuming plan_id stores stripe_price_id
    LEFT JOIN subscription_invoices_agg sia ON s.id = sia.subscription_id;

-- subscription_analytics view
DROP VIEW IF EXISTS public.subscription_analytics CASCADE;
CREATE OR REPLACE VIEW public.subscription_analytics AS
SELECT 
    DATE_TRUNC('day', gs.date)::date AS date,
    
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'active' AND s.created_at <= gs.date) AS active_subscriptions,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'trialing' AND s.created_at <= gs.date) AS trialing_subscriptions,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'canceled' AND s.created_at <= gs.date) AS canceled_subscriptions,
    
    COALESCE(SUM(
        CASE 
            WHEN s.status = 'active' THEN spl.price_amount
            WHEN s.status = 'trialing' AND s.trial_end >= gs.date THEN 0
            ELSE 0
        END
    ), 0) AS mrr,
    
    COUNT(DISTINCT s.id) FILTER (
        WHERE s.status = 'canceled' 
        AND s.canceled_at::date = gs.date
    ) AS churned_subscriptions,
    
    COUNT(DISTINCT s.id) FILTER (
        WHERE s.created_at::date = gs.date
    ) AS new_subscriptions,
    
    COUNT(DISTINCT s.id) FILTER (
        WHERE s.trial_end::date = gs.date 
        AND s.status = 'active'
    ) AS trial_conversions,
    
    COALESCE(SUM(su.usage_count), 0) AS total_usage,
    COUNT(DISTINCT su.feature_name) AS active_features
    
FROM 
    generate_series(
        CURRENT_DATE - INTERVAL '30 days', 
        CURRENT_DATE, 
        INTERVAL '1 day'
    ) AS gs(date)
    LEFT JOIN public.subscriptions s ON s.created_at <= gs.date
        AND (s.ended_at IS NULL OR s.ended_at >= gs.date)
    LEFT JOIN public.subscription_plans spl ON s.plan_id = spl.stripe_price_id
    LEFT JOIN public.subscription_usage su ON s.id = su.subscription_id
        AND su.period_start <= gs.date AND su.period_end >= gs.date
GROUP BY 
    gs.date
ORDER BY 
    gs.date;
