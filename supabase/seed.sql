-- Nuvanta AI — Supabase Demo Seeding Script
-- Seeds all types of users and subscription scenarios:
-- 1. Super Admin: admin@nuvanta.ai
-- 2. Agency Owner (Premium): owner.premium@nuvanta.ai
-- 3. Agency Owner (Free): owner.free@nuvanta.ai
-- 4. Agent / Staff: agent@nuvanta.ai
-- 5. Client / Buyer: buyer@nuvanta.ai
-- Default Password for all accounts: Admin@123456

-- =============================================================================
-- USER TYPE 1: SUPER ADMIN (Platform Controller)
-- =============================================================================

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0a00000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'admin@nuvanta.ai',
    '$2b$10$fn8cKBH0YcM.PACFftpDyefj32BhBP.gHlBTZ84wEtw.j3YFVGE4G',
    NOW(), NULL, NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Platform Super Admin","role":"superadmin"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    'a0a00000-0000-0000-0000-000000000001',
    'a0a00000-0000-0000-0000-000000000001',
    '{"sub":"a0a00000-0000-0000-0000-000000000001","email":"admin@nuvanta.ai"}'::jsonb,
    'email', NOW(), NOW(), NOW()
)
ON CONFLICT ON CONSTRAINT identities_pkey DO NOTHING;

INSERT INTO public.profiles (id, email, created_at)
VALUES ('a0a00000-0000-0000-0000-000000000001', 'admin@nuvanta.ai', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- USER TYPE 2: AGENCY OWNER - PREMIUM PLAN (Business Tier)
-- =============================================================================

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b0b00000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'owner.premium@nuvanta.ai',
    '$2b$10$fn8cKBH0YcM.PACFftpDyefj32BhBP.gHlBTZ84wEtw.j3YFVGE4G',
    NOW(), NULL, NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Premium Agency Owner","role":"agency_owner"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    'b0b00000-0000-0000-0000-000000000002',
    'b0b00000-0000-0000-0000-000000000002',
    '{"sub":"b0b00000-0000-0000-0000-000000000002","email":"owner.premium@nuvanta.ai"}'::jsonb,
    'email', NOW(), NOW(), NOW()
)
ON CONFLICT ON CONSTRAINT identities_pkey DO NOTHING;

INSERT INTO public.profiles (id, email, created_at)
VALUES ('b0b00000-0000-0000-0000-000000000002', 'owner.premium@nuvanta.ai', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- USER TYPE 3: AGENCY OWNER - FREE PLAN (Free Tier)
-- =============================================================================

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'c0c00000-0000-0000-0000-000000000003',
    'authenticated', 'authenticated', 'owner.free@nuvanta.ai',
    '$2b$10$fn8cKBH0YcM.PACFftpDyefj32BhBP.gHlBTZ84wEtw.j3YFVGE4G',
    NOW(), NULL, NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Free Agency Owner","role":"agency_owner"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    'c0c00000-0000-0000-0000-000000000003',
    'c0c00000-0000-0000-0000-000000000003',
    '{"sub":"c0c00000-0000-0000-0000-000000000003","email":"owner.free@nuvanta.ai"}'::jsonb,
    'email', NOW(), NOW(), NOW()
)
ON CONFLICT ON CONSTRAINT identities_pkey DO NOTHING;

INSERT INTO public.profiles (id, email, created_at)
VALUES ('c0c00000-0000-0000-0000-000000000003', 'owner.free@nuvanta.ai', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- USER TYPE 4: AGENT / STAFF MEMBER
-- =============================================================================

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'd0d00000-0000-0000-0000-000000000004',
    'authenticated', 'authenticated', 'agent@nuvanta.ai',
    '$2b$10$fn8cKBH0YcM.PACFftpDyefj32BhBP.gHlBTZ84wEtw.j3YFVGE4G',
    NOW(), NULL, NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Staff Agent","role":"agent"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    'd0d00000-0000-0000-0000-000000000004',
    'd0d00000-0000-0000-0000-000000000004',
    '{"sub":"d0d00000-0000-0000-0000-000000000004","email":"agent@nuvanta.ai"}'::jsonb,
    'email', NOW(), NOW(), NOW()
)
ON CONFLICT ON CONSTRAINT identities_pkey DO NOTHING;

INSERT INTO public.profiles (id, email, created_at)
VALUES ('d0d00000-0000-0000-0000-000000000004', 'agent@nuvanta.ai', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- USER TYPE 5: CLIENT / BUYER (General Portal User)
-- =============================================================================

INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'e0e00000-0000-0000-0000-000000000005',
    'authenticated', 'authenticated', 'buyer@nuvanta.ai',
    '$2b$10$fn8cKBH0YcM.PACFftpDyefj32BhBP.gHlBTZ84wEtw.j3YFVGE4G',
    NOW(), NULL, NOW(), '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Portal Buyer Client","role":"client"}'::jsonb,
    NOW(), NOW(), '', '', '', ''
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
    'e0e00000-0000-0000-0000-000000000005',
    'e0e00000-0000-0000-0000-000000000005',
    '{"sub":"e0e00000-0000-0000-0000-000000000005","email":"buyer@nuvanta.ai"}'::jsonb,
    'email', NOW(), NOW(), NOW()
)
ON CONFLICT ON CONSTRAINT identities_pkey DO NOTHING;

INSERT INTO public.profiles (id, email, created_at)
VALUES ('e0e00000-0000-0000-0000-000000000005', 'buyer@nuvanta.ai', NOW())
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- BUSINESS SEEDING (PREMIUM VS FREE SCENARIOS)
-- =============================================================================

-- 1. Premium Business (owner.premium@nuvanta.ai)
INSERT INTO public.businesses (
    id, owner_id, name, slug, subscription_tier, timezone, operating_hours, website_addon_subscribed, created_at
)
VALUES (
    'b1000000-0000-0000-0000-000000000001',
    'b0b00000-0000-0000-0000-000000000002',
    'Apex Horizon Realty',
    'apex-horizon',
    'Business',
    'Asia/Kolkata',
    '{"monday":["09:00-18:00"],"tuesday":["09:00-18:00"],"wednesday":["09:00-18:00"],"thursday":["09:00-18:00"],"friday":["09:00-18:00"]}'::jsonb,
    TRUE,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Free Business (owner.free@nuvanta.ai)
INSERT INTO public.businesses (
    id, owner_id, name, slug, subscription_tier, timezone, operating_hours, website_addon_subscribed, created_at
)
VALUES (
    'b1000000-0000-0000-0000-000000000002',
    'c0c00000-0000-0000-0000-000000000003',
    'Budget Homes Realty',
    'budget-homes',
    'Free',
    'UTC',
    '{"monday":["10:00-17:00"],"tuesday":["10:00-17:00"],"wednesday":["10:00-17:00"],"thursday":["10:00-17:00"],"friday":["10:00-17:00"]}'::jsonb,
    FALSE,
    NOW()
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- PREMIUM PORTFOLIO DATA (Properties, AI Agents, Bookings)
-- =============================================================================

-- Property 1: Sea-Facing Luxury Villa
INSERT INTO public.properties (
    id, business_id, title, description, address, city, state, zip, price, type, category, status,
    bedrooms, bathrooms, parking_spaces, sqft, year_built, amenities, images, created_at
)
VALUES (
    'p1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'Seaside Serenity Villa',
    'Gorgeous 4 BHK luxury villa overlooking the Arabian Sea. Features a private infinity pool, massive beachfront deck, custom designer kitchen, and top-tier security systems.',
    'Carter Road, Bandra West', 'Mumbai', 'Maharashtra', '400050',
    125000000, 'sale', 'House', 'Available',
    4, 5, 3, 5200, 2022,
    '["Infinity Pool", "Sea View", "Home Automation", "Private Garden", "Gym"]'::jsonb,
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Property 2: High-End Penthouse
INSERT INTO public.properties (
    id, business_id, title, description, address, city, state, zip, price, type, category, status,
    bedrooms, bathrooms, parking_spaces, sqft, year_built, amenities, images, created_at
)
VALUES (
    'p1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'Skyline heights Penthouse',
    'Breathtaking 3 BHK penthouse located in Koramangala. Double-height ceilings, private elevator access, and a massive wrap-around private terrace.',
    'Koramangala 3rd Block', 'Bengaluru', 'Karnataka', '560034',
    180000, 'rent', 'Apartment', 'Available',
    3, 3.5, 2, 3100, 2023,
    '["Private Terrace", "Skyline View", "Italian Marble", "Concierge"]'::jsonb,
    '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Agent 1: Rohan (Bandra Villa Assistant)
INSERT INTO public.agents (
    id, business_id, property_id, name, voice, personality, greeting, language, custom_qa,
    widget_color, widget_theme, interpretation_level, service_type, created_at
)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000001',
    'Rohan', 'alloy', 'professional',
    'Hello! Thanks for calling Apex Horizon Realty. My name is Rohan. I can answer any questions you have about our Seaside Serenity Luxury Villa in Bandra. How can I help you today?',
    'English',
    '[{"question":"What is the price of the villa?","answer":"The villa is priced at Rupees 12.5 Crores."},{"question":"Is it Vaastu compliant?","answer":"Yes, the villa is fully east-facing and designed according to traditional Vaastu principles."}]'::jsonb,
    '#0f172a', 'dark', 'high', 'Viewing Property', NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Agent 2: Priya (Bengaluru Penthouse Assistant)
INSERT INTO public.agents (
    id, business_id, property_id, name, voice, personality, greeting, language, custom_qa,
    widget_color, widget_theme, interpretation_level, service_type, created_at
)
VALUES (
    'a1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'p1000000-0000-0000-0000-000000000002',
    'Priya', 'shimmer', 'enthusiastic',
    'Hi there! Priya here from Apex Horizon Realty. I am super excited to tell you about our Skyline Heights Penthouse in Koramangala. What details can I share with you?',
    'English',
    '[{"question":"What is the monthly rent?","answer":"The rent is Rupees 1.8 Lakhs per month, with a standard security deposit of six months."}]'::jsonb,
    '#2563eb', 'light', 'medium', 'Viewing Property', NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Appointments
INSERT INTO public.appointments (
    id, business_id, property_id, client_name, client_email, client_phone, slot_time, status, payment_status, payment_amount, created_at
)
VALUES (
    'e1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001',
    'Aditya Sharma', 'aditya.sharma@example.com', '+919876543210', NOW() + INTERVAL '1 day', 'confirmed', 'paid_cash', 0, NOW() - INTERVAL '2 hours'
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- FREE PORTFOLIO DATA (Limited to 1 Property & 1 Agent)
-- =============================================================================

-- Property 3: Modest Apartment
INSERT INTO public.properties (
    id, business_id, title, description, address, city, state, zip, price, type, category, status,
    bedrooms, bathrooms, parking_spaces, sqft, year_built, amenities, images, created_at
)
VALUES (
    'p1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'Cosy 2 BHK Bangalore Flat',
    'A charming, well-ventilated 2 BHK apartment located in Whitefield. Features round-the-clock water supply, power backup, and gated community parking.',
    'Whitefield Main Road', 'Bengaluru', 'Karnataka', '560066',
    35000, 'rent', 'Apartment', 'Available',
    2, 2, 1, 1100, 2018,
    '["Power Backup", "Gated Security", "Elevator", "Kids Play Area"]'::jsonb,
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"]'::jsonb,
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Agent 3: Kavita (Whitefield Flat Assistant)
INSERT INTO public.agents (
    id, business_id, property_id, name, voice, personality, greeting, language, custom_qa,
    widget_color, widget_theme, interpretation_level, service_type, created_at
)
VALUES (
    'a1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000002',
    'p1000000-0000-0000-0000-000000000003',
    'Kavita', 'shimmer', 'professional',
    'Hello! Welcome to Budget Homes Realty. My name is Kavita. I can assist you with details regarding our Cosy 2 BHK Whitefield flat. What would you like to know?',
    'English',
    '[{"question":"What is the rent and security deposit?","answer":"The rent is Rupees 35,000 per month, with a security deposit of Rupees 1.5 Lakhs."}]'::jsonb,
    '#16a34a', 'light', 'medium', 'Viewing Property', NOW()
)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- LOGS & CUSTOMER TICKETS
-- =============================================================================

-- Call Logs
INSERT INTO public.call_logs (
    id, business_id, agent_id, client_phone, duration, transcript, created_at
)
VALUES (
    'l1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
    '+919999999999', 42,
    '[{"role":"assistant","content":"Hello! Thanks for calling Apex Horizon Realty. My name is Rohan. I can answer any questions you have about our Seaside Serenity Luxury Villa in Bandra. How can I help you today?"},{"role":"user","content":"Hi Rohan, is the villa east-facing as per Vaastu?"},{"role":"assistant","content":"Yes, the villa is fully east-facing and designed according to traditional Vaastu principles."},{"role":"user","content":"Awesome. And how many bedrooms does it have?"},{"role":"assistant","content":"It has 4 spacious bedrooms, all with ensuite bathrooms."}]'::jsonb,
    NOW() - INTERVAL '4 hours'
)
ON CONFLICT (id) DO NOTHING;

-- Support Ticket & Chat Message
INSERT INTO public.support_tickets (id, business_id, client_name, client_email, status, created_at)
VALUES ('t1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Rajesh Patel', 'rajesh.patel@example.com', 'open', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.chat_messages (id, ticket_id, sender, message, image_url, created_at)
VALUES ('m1000000-0000-0000-0000-000000000001', 't1000000-0000-0000-0000-000000000001', 'client', 'Hi, I booked a slot for Bangalore penthouse tomorrow, but I might be late by 30 minutes. Is that fine?', NULL, NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;
