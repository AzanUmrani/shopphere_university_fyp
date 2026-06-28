-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ecom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a user for the application (optional, you can use root)
-- CREATE USER IF NOT EXISTS 'ecom_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON ecom_db.* TO 'ecom_user'@'localhost';
-- FLUSH PRIVILEGES;

USE ecom_db;
