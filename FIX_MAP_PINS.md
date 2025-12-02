# Quick Fix Commands for Map Pins Issue

## TL;DR
The `resources` and `needs` tables are missing the `coordinates` column in your database.
Run these commands to add them.

## Login to Turso First
```bash
turso auth login
```

## Apply Migration (Run Each Command One by One)

### Add coordinates to resources table
```bash
turso db shell hatyai-restart-db "ALTER TABLE resources ADD COLUMN coordinates TEXT;"
```

### Add coordinates to needs table
```bash
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN coordinates TEXT;"
```

### Add other missing fields to needs table
```bash
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN special_requirements TEXT;"
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN beneficiary_count INTEGER DEFAULT 1;"
turso db shell hatyai-restart-db "ALTER TABLE needs ADD COLUMN vulnerability_level TEXT DEFAULT 'medium';"
```

## Verify It Worked

Check resources table:
```bash
turso db shell hatyai-restart-db "PRAGMA table_info(resources);"
```

Check needs table:
```bash
turso db shell hatyai-restart-db "PRAGMA table_info(needs);"
```

Look for `coordinates` in the output!

## Test the Map

1. Refresh the map page at http://localhost:3000/map
2. Create new resources or needs with location data
3. Pins should now appear on the map! 🎉

---

**Note:** Existing data won't have coordinates since the column didn't exist.
Only newly created items will show on the map.
