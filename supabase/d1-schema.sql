-- SQLite compatible schema for Cloudflare D1 with Native Auth

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Sessions (cookie auth tokens)
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
    price REAL NOT NULL,
    type TEXT CHECK (type IN ('sale', 'rent')) NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms REAL NOT NULL,
    sqft REAL NOT NULL,
    amenities TEXT DEFAULT '[]' NOT NULL, -- JSON array of strings
    images TEXT DEFAULT '[]' NOT NULL, -- JSON array of strings
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
    custom_qa TEXT DEFAULT '[]' NOT NULL, -- JSON array of QA objects
    widget_color TEXT DEFAULT '#2563eb' NOT NULL,
    widget_theme TEXT DEFAULT 'light' NOT NULL,
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
    transcript TEXT DEFAULT '[]' NOT NULL, -- JSON array of messages
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
