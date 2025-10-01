-- Consolidated Initial Data

-- Insert initial section data for learn_sections
INSERT INTO public.learn_sections (section_type, title, description)
VALUES 
    ('authors_journey', 'My Writing Journey', 'Discover the behind-the-scenes of my writing process, challenges I''ve faced, and how I overcome them to bring my fantasy world to life.'),
    ('educational_resources', 'Educational Resources', 'Access my collection of writing resources, tutorials, and guides to help you on your writing journey.'),
    ('professional_services', 'Professional Services', 'Take your writing to the next level with my professional editing and coaching services.')
ON CONFLICT (section_type) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert initial cards for Author's Journey section
WITH section_id AS (
    SELECT id FROM public.learn_sections WHERE section_type = 'authors_journey'
)
INSERT INTO public.learn_cards (section_id, title, description, display_order)
SELECT 
    id,
    data->>'title',
    data->>'description',
    (data->>'display_order')::INTEGER
FROM 
    section_id,
    jsonb_array_elements(
        '[
            {"title": "World-Building", "description": "How I craft immersive fantasy worlds and cultures.", "display_order": 1},
            {"title": "Character Development", "description": "Techniques for creating memorable and relatable characters.", "display_order": 2},
            {"title": "Plotting & Pacing", "description": "Strategies for keeping readers engaged from start to finish.", "display_order": 3}
        ]'::jsonb
    ) AS data
ON CONFLICT DO NOTHING;

-- Insert initial cards for Educational Resources section
WITH section_id AS (
    SELECT id FROM public.learn_sections WHERE section_type = 'educational_resources'
)
INSERT INTO public.learn_cards (section_id, title, description, action_text, display_order)
SELECT 
    id,
    data->>'title',
    data->>'description',
    data->>'action_text',
    (data->>'display_order')::INTEGER
FROM 
    section_id,
    jsonb_array_elements(
        '[
            {"title": "Writing Guides", "description": "Comprehensive guides covering various aspects of creative writing.", "action_text": "View Guides", "display_order": 1},
            {"title": "Video Tutorials", "description": "In-depth video lessons on writing techniques and strategies.", "action_text": "Watch Now", "display_order": 2},
            {"title": "Downloadable Templates", "description": "Useful templates for character sheets, world-building, and more.", "action_text": "Download", "display_order": 3}
        ]'::jsonb
    ) AS data
ON CONFLICT DO NOTHING;

-- Insert initial cards for Professional Services section
WITH section_id AS (
    SELECT id FROM public.learn_sections WHERE section_type = 'professional_services'
)
INSERT INTO public.learn_cards (section_id, title, description, action_text, display_order)
SELECT 
    id,
    data->>'title',
    data->>'description',
    data->>'action_text',
    (data->>'display_order')::INTEGER
FROM 
    section_id,
    jsonb_array_elements(
        '[
            {"title": "Developmental Editing", "description": "In-depth analysis of your manuscript''s structure, plot, and character development.", "action_text": "Learn More", "display_order": 1},
            {"title": "Line Editing", "description": "Detailed feedback on your prose, style, and language use.", "action_text": "Learn More", "display_order": 2},
            {"title": "Writing Coaching", "description": "One-on-one guidance to help you develop your writing skills and complete your project.", "action_text": "Book Session", "display_order": 3}
        ]'::jsonb
    ) AS data
ON CONFLICT DO NOTHING;

-- Insert subscription products
INSERT INTO public.products (slug, name, title, description, product_type, is_subscription, active, status, published_at) VALUES
(
    'monthly-membership',
    'Monthly Membership',
    'Monthly Membership',
    'Access to all released chapters and new chapters as they are written. Includes community access and behind-the-scenes content.',
    'subscription',
    true,
    true,
    'published',
    NOW()
),
(
    'annual-membership', 
    'Annual Membership',
    'Annual Membership',
    'Everything in Monthly plan plus 2 months free, priority content access, exclusive annual content, and direct Q&A with author.',
    'subscription',
    true,
    true,
    'published',
    NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- Insert Stripe price data
INSERT INTO public.prices (product_id, provider, price_id, currency, amount_cents, unit_amount, interval, interval_count, trial_period_days, trial_days, active) VALUES
(
    (SELECT id FROM public.products WHERE slug = 'monthly-membership'),
    'stripe',
    'price_1S2L8JQv3TvmaocsYofzFKgm',
    'USD',
    999,
    999,
    'month',
    1,
    0,
    0,
    true
),
(
    (SELECT id FROM public.products WHERE slug = 'annual-membership'),
    'stripe', 
    'price_1S2L95Qv3TvmaocsN5zRIEXO',
    'USD',
    9999,
    9999,
    'year',
    1,
    0,
    0,
    true
)
ON CONFLICT (price_id) DO NOTHING;

-- Sample homepage content
INSERT INTO public.homepage_content (title, content, section, order_position) VALUES 
('Welcome to Zoroastervers', 'Experience the epic saga of cosmic proportions', 'hero', 1),
('About the Universe', 'Dive into a world where ancient wisdom meets modern storytelling', 'about', 2),
('Latest Updates', 'Stay up to date with the latest releases and announcements', 'updates', 3)
ON CONFLICT DO NOTHING;

-- Sample release items
INSERT INTO public.release_items (title, type, description, release_date, link) VALUES 
('Welcome Chapter Available', 'chapter', 'The first chapter of our epic journey is now live', CURRENT_DATE, '/read/1'),
('Character Profiles Updated', 'announcement', 'New character profiles added to the wiki', CURRENT_DATE - INTERVAL '1 day', '/wiki/characters'),
('Beta Reader Program Open', 'announcement', 'Applications now open for beta readers', CURRENT_DATE - INTERVAL '2 days', '/beta/application')
ON CONFLICT DO NOTHING;
