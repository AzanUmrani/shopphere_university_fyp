-- Migration to allow null userId in carts table for guest cart functionality
-- Run this on your database

ALTER TABLE `carts` MODIFY COLUMN `userId` char(36) DEFAULT NULL;