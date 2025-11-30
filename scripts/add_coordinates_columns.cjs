const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
    console.log("Adding coordinates columns...");

    const tables = ["resources", "needs", "jobs"];

    for (const table of tables) {
        try {
            await turso.execute(`ALTER TABLE ${table} ADD COLUMN coordinates TEXT`);
            console.log(`Added coordinates to ${table}`);
        } catch (e) {
            if (e.message.includes("duplicate column name")) {
                console.log(`Column coordinates already exists in ${table}`);
            } else {
                console.error(`Error adding coordinates to ${table}:`, e.message);
            }
        }
    }

    console.log("Done.");
}

main();
