# Map Pins Not Showing - Investigation Report

**Date:** December 2, 2025  
**Issue:** Map pins not visible even though locations are being reported by users

## 🔍 Root Cause Analysis

After thorough investigation of the entire codebase, I identified the **root cause**:

### Missing Database Columns

The `resources` and `needs` tables in the database **do NOT have a `coordinates` column**, while the application code assumes these columns exist.

#### Database Schema Status:

- ✅ **waste_reports** table HAS `coordinates TEXT` column
- ✅ **jobs** table HAS `coordinates TEXT` column  
- ❌ **resources** table is MISSING `coordinates` column
- ❌ **needs** table is MISSING `coordinates` column
- ❌ **needs** table is also MISSING: `special_requirements`, `beneficiary_count`, `vulnerability_level`

### Impact

1. When resources or needs are created, the `coordinates` data cannot be saved to the database
2. When the map tries to load data, `resource.coordinates` and `need.coordinates` are always `null`
3. The Map component has fallback logic to generate demo pins, but these don't represent actual reported locations
4. Users see either no pins or random fallback pins that don't match real data

### Code Locations Affected

1. **`src/app/actions/resources.ts`** (lines 56, 90)
   - Tries to parse `row.coordinates` but column doesn't exist
   
2. **`src/store/resourceStore.ts`**
   - Expects `coordinates` in Resource and ResourceNeed interfaces
   
3. **`src/app/map/page.tsx`** (lines 116, 130)
   - Expects `resource.coordinates` and `need.coordinates`
   
4. **`src/components/Map.tsx`** (lines 169-178)
   - Tries to parse coordinates, falls back to demo data when missing

## ✅ Solution Implemented

### 1. Updated Database Schema (`db/schema.sql`)

Added the missing columns to both tables:

**Resources table:**
```sql
coordinates TEXT, -- JSON {lat, lng}
```

**Needs table:**
```sql
coordinates TEXT, -- JSON {lat, lng}
special_requirements TEXT,
beneficiary_count INTEGER DEFAULT 1,
vulnerability_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
```

### 2. Created Migration Script

Created `db/migrations/add_coordinates_to_resources_and_needs.sql` with ALTER TABLE commands to add the missing columns to the existing database.

## 📋 Steps to Fix

### Step 1: Apply Database Migration

You need to add the columns to your Turso database. You have two options:

**Option A: Via Turso CLI (Recommended)**

```bash
# Login to Turso if not already logged in
turso auth login

# Apply migration for resources table
turso db shell hatyai-restart-db "ALTER TABLE resources ADD COLUMN coordinates TEXT;"

# Apply migrations for needs table (run each separately)
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN coordinates TEXT;"
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN special_requirements TEXT;"
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN beneficiary_count INTEGER DEFAULT 1;"
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN vulnerability_level TEXT DEFAULT 'medium';"
```

**Option B: Via Turso Dashboard**

1. Go to your Turso dashboard
2. Select the `hatyai-restart-db` database
3. Run each ALTER TABLE command one by one in the SQL console

### Step 2: Verify the Migration

Check that the columns were added successfully:

```bash
turso db shell hatyai-restart-db "PRAGMA table_info(resources);"
turso db shell hatyai-restart-db "PRAGMA table_info(needs);"
```

You should see the `coordinates` column listed for both tables.

### Step 3: Test the Map

1. Clear your browser cache or do a hard refresh (Cmd+Shift+R)
2. Create new resources or needs with location data
3. Open the map page at `/map`
4. Verify that pins appear for all items with coordinates

## 🎯 Expected Behavior After Fix

1. ✅ When users create new resources or needs, their location coordinates will be saved
2. ✅ The map will display pins for all items that have coordinates:
   - Red pins for waste reports
   - Blue pins for repair jobs
   - Green pins for resources/donations
   - Orange pins for needs/requests
3. ✅ Existing items without coordinates won't show (as expected)
4. ✅ Filter buttons will correctly show/hide pins by type

## 🔄 For Existing Data

**Important:** Existing resources and needs in your database do not have coordinates because the column didn't exist when they were created. 

Options:
1. **Recommended:** Ask users to submit new entries with location data
2. **Advanced:** Create a data migration script to populate coordinates for existing entries (if you have location data in another format)

## ⚠️ Prevention

To prevent similar issues in the future:

1. ✅ **Schema file is now updated** as the source of truth
2. ✅ **Migration script created** for reference
3. 💡 Consider adding database schema validation tests
4. 💡 Consider using an ORM like Drizzle or Prisma for type-safe schema management

## 📊 Summary

| Component | Status | Action Required |
|-----------|--------|----------------|
| Database Schema File | ✅ Fixed | None |
| Migration Script | ✅ Created | Apply to database |
| Application Code | ✅ Working | None (already expects coordinates) |
| Database | ⚠️ Needs Update | Run migration commands |

---

**Next Steps:** Apply the database migration and test the map functionality with new data entries.
