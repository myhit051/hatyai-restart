const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
    try {
        console.log('Adding missing columns to needs table...');

        // Check if columns exist or just try to add them (SQLite doesn't support IF NOT EXISTS for columns in standard way easily without checking)
        // We will just try to add them one by one. If they fail, it might be because they exist.

        const columns = [
            'ALTER TABLE needs ADD COLUMN special_requirements TEXT',
            'ALTER TABLE needs ADD COLUMN beneficiary_count INTEGER DEFAULT 1',
            'ALTER TABLE needs ADD COLUMN vulnerability_level TEXT DEFAULT \'medium\''
        ];

        for (const sql of columns) {
            try {
                await client.execute(sql);
                console.log(`Executed: ${sql}`);
            } catch (e) {
                console.log(`Skipping (might exist): ${sql}`);
            }
        }

        console.log('Schema update completed!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrate();
