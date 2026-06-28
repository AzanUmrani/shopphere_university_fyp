-- Migration script to fix product images
-- This script updates the database schema to handle product images correctly

USE ecom_db;

-- First, update the column name if it exists as 'url'
SET @column_exists = (SELECT COUNT(*)
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_name = 'product_images' 
AND table_schema = DATABASE()
AND column_name = 'url');

SET @sql = IF(@column_exists > 0,
    'ALTER TABLE product_images CHANGE COLUMN url image_url VARCHAR(500) NOT NULL;',
    'SELECT "Column url does not exist, skipping rename" as result;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ensure the table structure is correct
-- Add missing columns if they don't exist
SET @column_exists = (SELECT COUNT(*)
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_name = 'product_images' 
AND table_schema = DATABASE()
AND column_name = 'image_url');

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE product_images ADD COLUMN image_url VARCHAR(500) NOT NULL AFTER product_id;',
    'SELECT "Column image_url already exists" as result;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add a primary image field to products table for easier access
SET @column_exists = (SELECT COUNT(*)
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_name = 'products' 
AND table_schema = DATABASE()
AND column_name = 'primary_image_url');

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE products ADD COLUMN primary_image_url VARCHAR(500) NULL AFTER description;',
    'SELECT "Column primary_image_url already exists" as result;'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create trigger to update primary_image_url when a primary image is set
DELIMITER $$

DROP TRIGGER IF EXISTS update_product_primary_image$$

CREATE TRIGGER update_product_primary_image
AFTER INSERT ON product_images
FOR EACH ROW
BEGIN
    IF NEW.is_primary = 1 THEN
        UPDATE products 
        SET primary_image_url = NEW.image_url 
        WHERE id = NEW.product_id;
    END IF;
END$$

DROP TRIGGER IF EXISTS update_product_primary_image_on_update$$

CREATE TRIGGER update_product_primary_image_on_update
AFTER UPDATE ON product_images
FOR EACH ROW
BEGIN
    IF NEW.is_primary = 1 THEN
        UPDATE products 
        SET primary_image_url = NEW.image_url 
        WHERE id = NEW.product_id;
    ELSEIF OLD.is_primary = 1 AND NEW.is_primary = 0 THEN
        -- If the primary image is being changed to non-primary
        -- Find the next image with the lowest sort_order
        UPDATE products p
        SET primary_image_url = (
            SELECT pi.image_url 
            FROM product_images pi 
            WHERE pi.product_id = p.id 
            ORDER BY pi.sort_order ASC 
            LIMIT 1
        )
        WHERE p.id = NEW.product_id;
    END IF;
END$$

DELIMITER ;

-- Insert some sample product images if products exist but have no images
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT 
    p.id as product_id,
    '/uploads/sample-product.jpg' as image_url,
    CONCAT(p.name, ' - Main Image') as alt_text,
    TRUE as is_primary,
    0 as sort_order
FROM products p 
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE pi.id IS NULL
LIMIT 10;

SELECT 'Product image migration completed successfully!' as result;