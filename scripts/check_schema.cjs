const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkSchema() {
    try {
        console.log("Checking schema for table 'jobs'...");
        const result = await turso.execute("PRAGMA table_info(jobs)");
        console.log(result.rows);
    } catch (error) {
        console.error("Error checking schema:", error);
    }
}

checkSchema();
