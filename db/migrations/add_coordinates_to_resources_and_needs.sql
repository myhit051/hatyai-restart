-- Migration: Add coordinates and missing fields to resources and needs tables
-- Date: 2025-12-02

-- Add coordinates column to resources table
ALTER TABLE resources ADD COLUMN coordinates TEXT;

-- Add coordinates column to needs table
ALTER TABLE needs ADD COLUMN coordinates TEXT;

-- Add special_requirements column to needs table
ALTER TABLE needs ADD COLUMN special_requirements TEXT;

-- Add beneficiary_count column to needs table
ALTER TABLE needs ADD COLUMN beneficiary_count INTEGER DEFAULT 1;

-- Add vulnerability_level column to needs table
ALTER TABLE needs ADD COLUMN vulnerability_level TEXT DEFAULT 'medium';
