-- Quick Migration Script for ecom_db
-- Run this in MySQL Workbench or your MySQL client

USE ecom_db;

-- Add temp_onboarding_data column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS temp_onboarding_data JSON NULL 
AFTER stripe_customer_id;

-- Verify the column was added
DESCRIBE users;

-- Success message
SELECT 'Migration completed successfully! Column temp_onboarding_data added to users table.' AS Status;
