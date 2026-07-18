-- Nuvanta AI — Supabase PostgreSQL Schema
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Businesses
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stripe_secret_key TEXT,
    stripe_publishable_key TEXT,
    razorpay_key_id TEXT,
    razorpay_key_secret TEXT,
    subscription_tier TEXT DEFAULT 'Free' NOT NULL,
    stripe_subscription_id TEXT,
    contact_phone TEXT,
    support_email TEXT,
    website_url TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    maps_latitude NUMERIC,
    maps_longitude NUMERIC,
    operating_hours JSONB DEFAULT '{}'::JSONB,
    website_addon_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    address TEXT NOT NULL,
    city TEXT DEFAULT '',
    state TEXT DEFAULT '',
    zip TEXT DEFAULT '',
    price NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('sale', 'rent')) NOT NULL,
    category TEXT DEFAULT 'House',
    status TEXT DEFAULT 'Available',
    bedrooms INTEGER DEFAULT 0,
    bathrooms NUMERIC DEFAULT 0,
    parking_spaces INTEGER DEFAULT 0,
    sqft NUMERIC DEFAULT 0,
    year_built INTEGER,
    amenities JSONB DEFAULT '[]'::JSONB,
    images JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Agents (AI Voice configurations)
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    voice TEXT DEFAULT 'alloy' NOT NULL,
    personality TEXT DEFAULT 'professional' NOT NULL,
    greeting TEXT NOT NULL,
    language TEXT DEFAULT 'English' NOT NULL,
    custom_qa JSONB DEFAULT '[]'::JSONB NOT NULL,
    widget_color TEXT DEFAULT '#2563eb' NOT NULL,
    widget_theme TEXT DEFAULT 'light' NOT NULL,
    interpretation_level TEXT DEFAULT 'medium' NOT NULL,
    service_type TEXT DEFAULT 'Viewing Property' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    slot_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')) NOT NULL,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid_cash','paid_stripe','paid_razorpay')) NOT NULL,
    payment_amount NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Call Logs
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    client_phone TEXT NOT NULL,
    duration INTEGER DEFAULT 0 NOT NULL,
    transcript JSONB DEFAULT '[]'::JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    subject TEXT DEFAULT 'General Inquiry' NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open','closed')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender TEXT CHECK (sender IN ('client','agent')) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Businesses: owner can read/write their own
CREATE POLICY "owner_all_businesses" ON public.businesses
    FOR ALL USING (owner_id = auth.uid());

-- Properties: owner of parent business
CREATE POLICY "owner_all_properties" ON public.properties
    FOR ALL USING (
        business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
    );

-- Agents
CREATE POLICY "owner_all_agents" ON public.agents
    FOR ALL USING (
        business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
    );

-- Appointments
CREATE POLICY "owner_all_appointments" ON public.appointments
    FOR ALL USING (
        business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
    );

-- Call Logs
CREATE POLICY "owner_all_call_logs" ON public.call_logs
    FOR ALL USING (
        business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
    );

-- Support Tickets
CREATE POLICY "owner_all_tickets" ON public.support_tickets
    FOR ALL USING (
        business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
    );

-- Chat Messages (owner of the ticket's business)
CREATE POLICY "owner_all_messages" ON public.chat_messages
    FOR ALL USING (
        ticket_id IN (
            SELECT st.id FROM public.support_tickets st
            JOIN public.businesses b ON b.id = st.business_id
            WHERE b.owner_id = auth.uid()
        )
    );

-- ── Super Admin via seed (run separately if needed) ─────────────────────────
-- After creating your admin user via Supabase Auth Dashboard,
-- run: INSERT INTO public.businesses (owner_id, name, slug, subscription_tier)
--      VALUES ('<your-user-id>', 'Nuvanta Software Solutions', 'nuvanta', 'Business');
