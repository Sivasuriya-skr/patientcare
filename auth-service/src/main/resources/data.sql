-- =========================================
-- 1. CREATE TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY,
                                     email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
    );

-- =========================================
-- 2. INSERT DEFAULT USER (SAFE UPSERT)
-- =========================================
INSERT INTO users (id, email, password, role)
VALUES (
           gen_random_uuid(),
           'testuser@test5.com',
           '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LnXbMmjMUmu',
           'PATIENT'
       )
    ON CONFLICT (email) DO NOTHING;