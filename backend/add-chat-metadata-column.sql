-- Add metadata column to chat_participants table
-- This column stores additional JSON data for chat participants

USE ecommerce_db;

-- Add metadata column to chat_participants
ALTER TABLE chat_participants 
ADD COLUMN metadata JSON NULL AFTER is_blocked;

-- Verify the change
DESCRIBE chat_participants;
