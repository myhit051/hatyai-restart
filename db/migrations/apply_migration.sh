#!/bin/bash

# Migration script to add coordinates and missing fields to database
# This script adds the missing columns to resources and needs tables

echo "🔧 Starting database migration..."
echo "📝 Adding coordinates column to resources table..."
echo "📝 Adding coordinates and other fields to needs table..."

# Create a temporary SQL file with the migration
cat &lt;&lt;EOF &gt; /tmp/hatyai_migration.sql
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
EOF

echo "✅ Migration SQL created"
echo ""
echo "To apply this migration, you need to run:"
echo ""
echo "  turso db shell hatyai-restart-db &lt; /tmp/hatyai_migration.sql"
echo ""
echo "OR manually execute each ALTER TABLE command in your Turso dashboard."
echo ""
echo "⚠️  Note: SQLite only allows adding columns one at a time."
echo "    You may need to run each ALTER TABLE command separately if batch execution fails."
