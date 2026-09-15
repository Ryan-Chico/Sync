-- Add building dimension columns to existing buildings table
-- Run this BEFORE the sti-calooocan-seed.sql

ALTER TABLE buildings ADD COLUMN IF NOT EXISTS wing_width REAL DEFAULT 6;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS wing_depth REAL DEFAULT 4;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS side_width REAL DEFAULT 2.5;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS side_depth REAL DEFAULT 3;
ALTER TABLE buildings ADD COLUMN IF NOT EXISTS floor_height REAL DEFAULT 0.1;
