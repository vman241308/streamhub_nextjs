-- Add badges column to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS badges JSON DEFAULT NULL;