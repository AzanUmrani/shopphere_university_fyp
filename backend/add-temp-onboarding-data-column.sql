-- Add temp_onboarding_data column to users table
-- This column will store temporary onboarding data during the creator application process

ALTER TABLE users 
ADD COLUMN temp_onboarding_data JSON NULL 
AFTER stripe_customer_id;

-- Add comment to describe the column
ALTER TABLE users 
MODIFY COLUMN temp_onboarding_data JSON NULL 
COMMENT 'Temporary storage for creator onboarding data during multi-step application process';
