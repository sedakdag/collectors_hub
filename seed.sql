-- Tabloları Oluşturma
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- JWT için gerekli [cite: 23, 24]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL -- Vinyl, CD, Photocard
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100),
    image_url TEXT,
    is_for_sale BOOLEAN DEFAULT FALSE,
    is_for_swap BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2), -- Satış opsiyonu için [cite: 20]
    description TEXT
);

-- Başlangıç Verileri (Seed Data)
INSERT INTO categories (name) VALUES ('Vinyl'), ('CD'), ('K-pop Photocard');

INSERT INTO users (username, email, password) VALUES 
('koleksiyoner1', 'user1@email.com', 'hashed_password');

INSERT INTO items (user_id, category_id, title, artist, is_for_sale, price) VALUES 
(1, 1, 'Abbey Road', 'The Beatles', true, 1250.00),
(1, 3, 'Love Yourself Answer - V', 'BTS', false, NULL);