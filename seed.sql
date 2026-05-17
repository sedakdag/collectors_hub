-- ========================================================
-- 1. TABLOLARI OLUŞTURMA
-- ========================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100),
    image_url TEXT,
    is_for_sale BOOLEAN DEFAULT FALSE,
    is_for_swap BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2) DEFAULT NULL,
    description TEXT,
    condition VARCHAR(50) DEFAULT 'Mint (10/10)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 2. BAŞLANGIÇ VERİLERİ (SEED DATA)
-- ========================================================

-- Kategoriler (Frontend butonlarınla birebir aynı isimler)
INSERT INTO categories (name) VALUES 
('Vinyl'), 
('Photocards'), 
('CDs'),
('Vintage Tech'),
('Postcards'),
('Signed Art');

-- Test Kullanıcıları
INSERT INTO users (username, email, password) VALUES 
('koleksiyoner1', 'user1@email.com', 'hashed_password'),
('seda', 'seda@collectorhub.com', 'hashed_password_placeholder');

-- Kategoriye özel, basılmadan tam dikey (2:3) duracak harika Unsplash görselleri:
INSERT INTO items (user_id, category_id, title, artist, image_url, is_for_sale, is_for_swap, price, description, condition) VALUES 
(1, 1, 'Abbey Road Vinyl', 'The Beatles', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&q=80', true, false, 1250.00, 'Original 1969 press, gatefold mirror vinyl.', 'Mint (10/10)'),
(1, 2, 'Love Yourself: Tear', 'BTS', 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80', false, true, NULL, 'Official K-pop photocards album version complete set.', 'Near Mint (9/10)'),
(1, 3, 'The Dark Side of the Moon CD', 'Pink Floyd', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80', true, true, 350.00, 'Remastered gold edition audio compact disc.', 'Excellent (8/10)'),
(1, 4, 'Polaroid Sun 600', 'Vintage Camera', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80', false, false, NULL, 'Fully tested 1980s retro instant film camera.', 'Good (7/10)'),
(1, 5, 'Greetings from Tokyo', 'Vintage Postcard', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80', true, false, 120.00, 'Authentic 1970s handwritten and stamped postcard.', 'Fair (6/10)'),
(1, 6, 'Signed Star Wars Script', 'George Lucas', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&q=80', false, true, NULL, 'Original New Hope script copy with authentic signature.', 'Mint (10/10)');