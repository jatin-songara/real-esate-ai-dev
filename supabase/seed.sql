-- Nuvanta AI — Super Admin Seed
-- Email:    admin@nuvanta.ai
-- Password: Admin@123456
-- Change the password after first login!

-- 1. Super Admin profile
INSERT OR IGNORE INTO profiles (id, email, password_hash, created_at)
VALUES (
    'superadmin-0000-0000-0000-000000000001',
    'admin@nuvanta.ai',
    'ad89b64d66caa8e30e5d5ce4a9763f4ecc205814c412175f3e2c50027471426d',
    datetime('now')
);

-- 2. Nuvanta Software Solutions business (linked to super admin)
INSERT OR IGNORE INTO businesses (id, owner_id, name, slug, subscription_tier, created_at)
VALUES (
    'nuvanta-biz-0000-0000-000000000001',
    'superadmin-0000-0000-0000-000000000001',
    'Nuvanta Software Solutions',
    'nuvanta',
    'Business',
    datetime('now')
);
