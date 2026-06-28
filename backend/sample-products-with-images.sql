-- Script to add sample product data with images
-- This will help test the image functionality

USE ecom_db;

-- Insert some sample categories first if they don't exist
INSERT IGNORE INTO categories (id, name, slug, description, sort_order) VALUES
('cat-electronics', 'Electronics', 'electronics', 'Electronic devices and gadgets', 1),
('cat-clothing', 'Clothing', 'clothing', 'Fashion and apparel', 2),
('cat-home', 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', 3),
('cat-sports', 'Sports', 'sports', 'Sports and outdoor equipment', 4);

-- Insert sample products if they don't exist
INSERT IGNORE INTO products (
    id, name, description, price, original_price, sku, category_id, brand, 
    rating, review_count, in_stock, stock_quantity, tags, features, 
    is_new, is_featured, is_active, is_digital, view_count, sales_count,
    primary_image_url
) VALUES 
(
    'prod-smartphone-001',
    'Premium Smartphone X1',
    'Latest flagship smartphone with advanced camera system and long-lasting battery.',
    899.99,
    999.99,
    'PHONE-X1-001',
    'cat-electronics',
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
    '/uploads/products/smartphone-x1.svg'
),
(
    'prod-laptop-002',
    'ProBook Elite 15',
    'High-performance laptop perfect for professionals and creators.',
    1299.99,
    1499.99,
    'LAPTOP-PE15-002',
    'cat-electronics',
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
    '/uploads/products/laptop-elite.svg'
),
(
    'prod-headphones-003',
    'Wireless Noise-Canceling Headphones',
    'Premium wireless headphones with active noise cancellation.',
    249.99,
    299.99,
    'AUDIO-WNC-003',
    'cat-electronics',
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
    '/uploads/products/headphones-wireless.svg'
),
(
    'prod-tshirt-004',
    'Premium Cotton T-Shirt',
    'Comfortable premium cotton t-shirt available in multiple colors.',
    29.99,
    39.99,
    'CLOTH-TSHIRT-004',
    'cat-clothing',
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
    '/uploads/products/tshirt-cotton.svg'
);

-- Insert product images for the sample products
INSERT IGNORE INTO product_images (id, product_id, image_url, alt_text, is_primary, sort_order) VALUES
-- Smartphone images
('img-phone-001-1', 'prod-smartphone-001', '/uploads/products/smartphone-x1.svg', 'Premium Smartphone X1 - Front View', TRUE, 0),
('img-phone-001-2', 'prod-smartphone-001', '/uploads/products/smartphone-x1-back.svg', 'Premium Smartphone X1 - Back View', FALSE, 1),
('img-phone-001-3', 'prod-smartphone-001', '/uploads/products/smartphone-x1-side.svg', 'Premium Smartphone X1 - Side View', FALSE, 2),

-- Laptop images
('img-laptop-002-1', 'prod-laptop-002', '/uploads/products/laptop-elite.svg', 'ProBook Elite 15 - Main View', TRUE, 0),
('img-laptop-002-2', 'prod-laptop-002', '/uploads/products/laptop-elite-open.svg', 'ProBook Elite 15 - Open View', FALSE, 1),

-- Headphones images
('img-headphones-003-1', 'prod-headphones-003', '/uploads/products/headphones-wireless.svg', 'Wireless Noise-Canceling Headphones', TRUE, 0),
('img-headphones-003-2', 'prod-headphones-003', '/uploads/products/headphones-wireless-case.svg', 'Headphones with Case', FALSE, 1),

-- T-shirt images
('img-tshirt-004-1', 'prod-tshirt-004', '/uploads/products/tshirt-cotton.svg', 'Premium Cotton T-Shirt - Blue', TRUE, 0),
('img-tshirt-004-2', 'prod-tshirt-004', '/uploads/products/tshirt-cotton-red.svg', 'Premium Cotton T-Shirt - Red', FALSE, 1),
('img-tshirt-004-3', 'prod-tshirt-004', '/uploads/products/tshirt-cotton-black.svg', 'Premium Cotton T-Shirt - Black', FALSE, 2);

-- Update products table to set primary image URLs
UPDATE products p 
SET primary_image_url = (
    SELECT pi.image_url 
    FROM product_images pi 
    WHERE pi.product_id = p.id AND pi.is_primary = TRUE 
    LIMIT 1
) 
WHERE p.id IN ('prod-smartphone-001', 'prod-laptop-002', 'prod-headphones-003', 'prod-tshirt-004');

SELECT 'Sample products and images inserted successfully!' as result;