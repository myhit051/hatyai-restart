const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error('Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

async function addMissingColumns() {
    try {
        console.log('Checking for missing columns in jobs table...');

        // List of columns to check and add if missing
        const columnsToAdd = [
            { name: 'category_id', type: 'TEXT' },
            { name: 'subcategory', type: 'TEXT' },
            { name: 'posting_type', type: 'TEXT', default: "'hiring'" },
            { name: 'employer_id', type: 'TEXT' },
            { name: 'seeker_id', type: 'TEXT' },
            { name: 'contact_person', type: 'TEXT' },
            { name: 'contact_phone', type: 'TEXT' },
            { name: 'contact_email', type: 'TEXT' },
            { name: 'work_location_type', type: 'TEXT', default: "'onsite'" },
            { name: 'wage_type', type: 'TEXT' },
            { name: 'wage_amount', type: 'DECIMAL(10, 2)' },
            { name: 'wage_currency', type: 'TEXT', default: "'THB'" },
            { name: 'work_duration', type: 'TEXT' },
            { name: 'skills_required', type: 'TEXT' },
            { name: 'requirements', type: 'TEXT' },
            { name: 'view_count', type: 'INTEGER', default: '0' },
            { name: 'contact_count', type: 'INTEGER', default: '0' },
            { name: 'expires_at', type: 'DATETIME' }
        ];

        for (const col of columnsToAdd) {
            try {
                // Try to add the column. If it exists, this will fail, which is fine.
                let sql = `ALTER TABLE jobs ADD COLUMN ${col.name} ${col.type}`;
                if (col.default) {
                    sql += ` DEFAULT ${col.default}`;
                }

                console.log(`Attempting to add column: ${col.name}`);
                await client.execute(sql);
                console.log(`Successfully added column: ${col.name}`);
            } catch (error) {
                // Check if error is because column already exists
                if (error.message && error.message.includes('duplicate column name')) {
                    console.log(`Column ${col.name} already exists.`);
                } else {
                    console.error(`Failed to add column ${col.name}:`, error.message);
                }
            }
        }

        console.log('Column check/addition completed.');
    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

addMissingColumns();
