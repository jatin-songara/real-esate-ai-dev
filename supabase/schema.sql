-- =============================================================================
-- SECTION 1: SUPABASE (POSTGRESQL) SCHEMA
-- =============================================================================
-- Copy and run this section in the Supabase Dashboard SQL Editor.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Optional if using Supabase Auth provider
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Sessions (only needed if bypass Supabase Auth cookie session is done)
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Businesses
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stripe_secret_key TEXT,
    stripe_publishable_key TEXT,
    subscription_tier TEXT DEFAULT 'Free' NOT NULL,
    stripe_subscription_id TEXT,
    contact_phone TEXT,
    support_email TEXT,
    website_url TEXT,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    maps_latitude NUMERIC,
    maps_longitude NUMERIC,
    operating_hours JSONB DEFAULT '{}'::JSONB NOT NULL,
    website_addon_subscribed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip TEXT,
    price NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('sale', 'rent')) NOT NULL,
    category TEXT CHECK (category IN ('House', 'Apartment', 'Commercial')) DEFAULT 'House' NOT NULL,
    status TEXT CHECK (status IN ('Available', 'Pending', 'Sold')) DEFAULT 'Available' NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms NUMERIC NOT NULL,
    parking_spaces INTEGER DEFAULT 0 NOT NULL,
    sqft NUMERIC NOT NULL,
    year_built INTEGER,
    amenities JSONB DEFAULT '[]'::JSONB NOT NULL,
    images JSONB DEFAULT '[]'::JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Agents
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    voice TEXT NOT NULL,
    personality TEXT NOT NULL,
    greeting TEXT NOT NULL,
    language TEXT DEFAULT 'English' NOT NULL,
    custom_qa JSONB DEFAULT '[]'::JSONB NOT NULL,
    widget_color TEXT DEFAULT '#2563eb' NOT NULL,
    widget_theme TEXT DEFAULT 'light' NOT NULL,
    interpretation_level TEXT DEFAULT 'medium' NOT NULL,
    service_type TEXT CHECK (service_type IN ('Buyer Consultation', 'Viewing Property')) DEFAULT 'Viewing Property' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    slot_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) NOT NULL,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid_cash', 'paid_stripe')) NOT NULL,
    payment_amount NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Call Logs
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    client_phone TEXT NOT NULL,
    duration INTEGER DEFAULT 0 NOT NULL,
    transcript JSONB DEFAULT '[]'::JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender TEXT CHECK (sender IN ('client', 'agent')) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ── Trigger to sync auth.users with public.profiles ──────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, created_at)
    VALUES (new.id, new.email, new.created_at);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Row Level Security (RLS) & Policies ──────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_owner" ON public.profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "sessions_owner" ON public.sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "owner_all_businesses" ON public.businesses FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "owner_all_properties" ON public.properties FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
);
CREATE POLICY "owner_all_agents" ON public.agents FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
);
CREATE POLICY "owner_all_appointments" ON public.appointments FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
);
CREATE POLICY "owner_all_call_logs" ON public.call_logs FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
);
CREATE POLICY "owner_all_tickets" ON public.support_tickets FOR ALL USING (
    business_id IN (SELECT id FROM public.businesses WHERE owner_id = auth.uid())
);
CREATE POLICY "owner_all_messages" ON public.chat_messages FOR ALL USING (
    ticket_id IN (
        SELECT st.id FROM public.support_tickets st
        JOIN public.businesses b ON b.id = st.business_id
        WHERE b.owner_id = auth.uid()
    )
);


-- =============================================================================
-- SECTION 2: CLOUDFLARE D1 (SQLITE) SCHEMA
-- =============================================================================
-- Copy and run this section for Cloudflare D1 local/remote databases.

/*
-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Sessions
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY(user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 3. Businesses
CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stripe_secret_key TEXT,
    stripe_publishable_key TEXT,
    subscription_tier TEXT DEFAULT 'Free' NOT NULL,
    stripe_subscription_id TEXT,
    contact_phone TEXT,
    support_email TEXT,
    website_url TEXT,
    timezone TEXT DEFAULT 'UTC' NOT NULL,
    maps_latitude REAL,
    maps_longitude REAL,
    operating_hours TEXT DEFAULT '{}' NOT NULL,
    website_addon_subscribed BOOLEAN DEFAULT 0 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(owner_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- 4. Properties
CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip TEXT,
    price REAL NOT NULL,
    type TEXT CHECK (type IN ('sale', 'rent')) NOT NULL,
    category TEXT CHECK (category IN ('House', 'Apartment', 'Commercial')) DEFAULT 'House' NOT NULL,
    status TEXT CHECK (status IN ('Available', 'Pending', 'Sold')) DEFAULT 'Available' NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms REAL NOT NULL,
    parking_spaces INTEGER DEFAULT 0 NOT NULL,
    sqft REAL NOT NULL,
    year_built INTEGER,
    amenities TEXT DEFAULT '[]' NOT NULL,
    images TEXT DEFAULT '[]' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- 5. Agents
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    property_id TEXT,
    name TEXT NOT NULL,
    voice TEXT NOT NULL,
    personality TEXT NOT NULL,
    greeting TEXT NOT NULL,
    language TEXT DEFAULT 'English' NOT NULL,
    custom_qa TEXT DEFAULT '[]' NOT NULL,
    widget_color TEXT DEFAULT '#2563eb' NOT NULL,
    widget_theme TEXT DEFAULT 'light' NOT NULL,
    interpretation_level TEXT DEFAULT 'medium' NOT NULL,
    service_type TEXT CHECK (service_type IN ('Buyer Consultation', 'Viewing Property')) DEFAULT 'Viewing Property' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    property_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) NOT NULL,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid_cash', 'paid_stripe')) NOT NULL,
    payment_amount REAL DEFAULT 0 NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY(property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- 7. Call Logs
CREATE TABLE IF NOT EXISTS call_logs (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    agent_id TEXT,
    client_phone TEXT NOT NULL,
    duration INTEGER DEFAULT 0 NOT NULL,
    transcript TEXT DEFAULT '[]' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY(agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- 8. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- 9. Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    sender TEXT CHECK (sender IN ('client', 'agent')) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);
*/
