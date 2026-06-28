-- Emergency Database Creation Script
-- Run this if your database was lost

-- Create database
CREATE DATABASE IF NOT EXISTS ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE ecom_db;

-- Show status
SELECT 'Database created successfully!' as Status;
SHOW DATABASES LIKE 'ecom%';

-- Note: Tables will be auto-created by Sequelize
-- Run: npm run db:setup