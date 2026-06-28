-- Migration script to fix product images functionality
-- Run this script to add sample data and test the image functionality

USE ecom_db;

-- First, let's insert some sample categories if they don't exist
INSERT IGNORE INTO categories (id, name, slug, description, sort_order, is_active, created_at, updated_at) VALUES
('cat-electronics-001', 'Electronics', 'electronics', 'Electronic devices and gadgets', 1, TRUE, NOW(), NOW()),
('cat-clothing-001', 'Clothing', 'clothing', 'Fashion and apparel', 2, TRUE, NOW(), NOW()),
('cat-home-001', 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', 3, TRUE, NOW(), NOW()),
('cat-sports-001', 'Sports', 'sports', 'Sports and outdoor equipment', 4, TRUE, NOW(), NOW());

-- Insert sample products if they don't exist
INSERT IGNORE INTO products (
    id, name, description, price, original_price, sku, category_id, brand, 
    rating, review_count, in_stock, stock_quantity, tags, features, 
    is_new, is_featured, is_active, is_digital, view_count, sales_count,
    created_at, updated_at
) VALUES 
(
    'prod-smartphone-001',
    'Premium Smartphone X1',
    'Latest flagship smartphone with advanced camera system and long-lasting battery. Features cutting-edge technology and sleek design.',
    899.99,
    999.99,
    'PHONE-X1-001',
    'cat-electronics-001',
    'TechBrand',
    4.5,
    150,
    TRUE,
    25,
    '["smartphone", "electronics", "camera", "5G"]',
    '["6.7 inch display", "108MP camera", "5000mAh battery", "5G ready"]',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    1250,
    45,
    NOW(),
    NOW()
),
(
    'prod-laptop-002',
    'ProBook Elite 15',
    'High-performance laptop perfect for professionals and creators. Powerful processing and stunning display.',
    1299.99,
    1499.99,
    'LAPTOP-PE15-002',
    'cat-electronics-001',
    'CompuBrand',
    4.7,
    89,
    TRUE,
    12,
    '["laptop", "computer", "professional", "performance"]',
    '["Intel i7 processor", "16GB RAM", "512GB SSD", "15.6 inch 4K display"]',
    FALSE,
    TRUE,
    TRUE,
    FALSE,
    890,
    23,
    NOW(),
    NOW()
),
(
    'prod-headphones-003',
    'Wireless Noise-Canceling Headphones',
    'Premium wireless headphones with active noise cancellation. Perfect for music lovers and professionals.',
    249.99,
    299.99,
    'AUDIO-WNC-003',
    'cat-electronics-001',
    'AudioPro',
    4.3,
    324,
    TRUE,
    45,
    '["headphones", "wireless", "noise-canceling", "audio"]',
    '["30-hour battery", "Active noise cancellation", "Bluetooth 5.0", "Quick charge"]',
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    2150,
    120,
    NOW(),
    NOW()
),
(
    'prod-tshirt-004',
    'Premium Cotton T-Shirt',
    'Comfortable premium cotton t-shirt available in multiple colors. Perfect for casual wear.',
    29.99,
    39.99,
    'CLOTH-TSHIRT-004',
    'cat-clothing-001',
    'FashionCo',
    4.2,
    67,
    TRUE,
    200,
    '["t-shirt", "cotton", "casual", "clothing"]',
    '["100% cotton", "Pre-shrunk", "Multiple colors", "Comfortable fit"]',
    FALSE,
    FALSE,
    TRUE,
    FALSE,
    445,
    78,
    NOW(),
    NOW()
),
(
    'prod-smartwatch-005',
    'Fitness Smart Watch',
    'Advanced fitness tracking smartwatch with health monitoring features.',
    199.99,
    249.99,
    'WATCH-FIT-005',
    'cat-electronics-001',
    'FitTech',
    4.4,
    256,
    TRUE,
    30,
    '["smartwatch", "fitness", "health", "wearable"]',
    '["Heart rate monitor", "GPS tracking", "Water resistant", "7-day battery"]',
    TRUE,
    TRUE,
    TRUE,
    FALSE,
    1890,
    89,
    NOW(),
    NOW()
);

-- Insert product images for the sample products
INSERT IGNORE INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order, created_at, updated_at) VALUES
-- Smartphone images
('img-phone-001-1', 'prod-smartphone-001', '/uploads/products/smartphone-x1.svg', 'Premium Smartphone X1 - Front View', TRUE, 0, NOW(), NOW()),
('img-phone-001-2', 'prod-smartphone-001', '/uploads/products/smartphone-x1-back.svg', 'Premium Smartphone X1 - Back View', FALSE, 1, NOW(), NOW()),
('img-phone-001-3', 'prod-smartphone-001', '/uploads/products/smartphone-x1-side.svg', 'Premium Smartphone X1 - Side View', FALSE, 2, NOW(), NOW()),

-- Laptop images
('img-laptop-002-1', 'prod-laptop-002', '/uploads/products/laptop-elite.svg', 'ProBook Elite 15 - Main View', TRUE, 0, NOW(), NOW()),
('img-laptop-002-2', 'prod-laptop-002', '/uploads/products/laptop-elite-open.svg', 'ProBook Elite 15 - Open View', FALSE, 1, NOW(), NOW()),

-- Headphones images
('img-headphones-003-1', 'prod-headphones-003', '/uploads/products/headphones-wireless.svg', 'Wireless Noise-Canceling Headphones', TRUE, 0, NOW(), NOW()),
('img-headphones-003-2', 'prod-headphones-003', '/uploads/products/headphones-wireless-case.svg', 'Headphones with Case', FALSE, 1, NOW(), NOW()),

-- T-shirt images
('img-tshirt-004-1', 'prod-tshirt-004', '/uploads/products/tshirt-cotton.svg', 'Premium Cotton T-Shirt - Blue', TRUE, 0, NOW(), NOW()),
('img-tshirt-004-2', 'prod-tshirt-004', '/uploads/products/tshirt-cotton-red.svg', 'Premium Cotton T-Shirt - Red', FALSE, 1, NOW(), NOW()),
('img-tshirt-004-3', 'prod-tshirt-004', '/uploads/products/tshirt-cotton-black.svg', 'Premium Cotton T-Shirt - Black', FALSE, 2, NOW(), NOW()),

-- Smartwatch images
('img-watch-005-1', 'prod-smartwatch-005', '/uploads/products/placeholder-product.svg', 'Fitness Smart Watch - Main View', TRUE, 0, NOW(), NOW());

-- Show the results
SELECT 'Sample products and images inserted successfully!' as result;

-- Display a summary of what was inserted
SELECT 
    'Categories' as type,
    COUNT(*) as count
FROM categories 
WHERE id IN ('cat-electronics-001', 'cat-clothing-001', 'cat-home-001', 'cat-sports-001')
UNION ALL
SELECT 
    'Products' as type,
    COUNT(*) as count
FROM products 
WHERE id IN ('prod-smartphone-001', 'prod-laptop-002', 'prod-headphones-003', 'prod-tshirt-004', 'prod-smartwatch-005')
UNION ALL
SELECT 
    'Product Images' as type,
    COUNT(*) as count
FROM product_images 
WHERE product_id IN ('prod-smartphone-001', 'prod-laptop-002', 'prod-headphones-003', 'prod-tshirt-004', 'prod-smartwatch-005');