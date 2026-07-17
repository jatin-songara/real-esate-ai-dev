-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Businesses (Real Estate Agencies / Agents)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stripe_secret_key TEXT,
    stripe_publishable_key TEXT,
    subscription_tier TEXT DEFAULT 'Free'::text NOT NULL,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Properties
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    price NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('sale', 'rent')) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms NUMERIC NOT NULL,
    sqft NUMERIC NOT NULL,
    amenities TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Agents (AI Voice configurations)
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    voice TEXT NOT NULL, -- e.g. 'alloy', 'echo', 'shimmer'
    personality TEXT NOT NULL, -- e.g. 'professional', 'enthusiastic'
    greeting TEXT NOT NULL,
    language TEXT DEFAULT 'English' NOT NULL,
    custom_qa JSONB DEFAULT '[]'::JSONB NOT NULL, -- list of custom Q&As
    widget_color TEXT DEFAULT '#2563eb' NOT NULL,
    widget_theme TEXT DEFAULT 'light' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Appointments (Calendar bookings)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    slot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) NOT NULL,
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid_cash', 'paid_stripe')) NOT NULL,
    payment_amount NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Call Logs
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
    client_phone TEXT NOT NULL,
    duration INTEGER DEFAULT 0 NOT NULL, -- in seconds
    transcript JSONB DEFAULT '[]'::JSONB NOT NULL, -- array of message objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Support Tickets
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender TEXT CHECK (sender IN ('client', 'agent')) NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create simple trigger to sync auth.users with public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
