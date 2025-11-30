const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkFK() {
    try {
        console.log("Checking foreign keys for table 'jobs'...");
        const result = await turso.execute("PRAGMA foreign_key_list(jobs)");
        console.log(result.rows);
    } catch (error) {
        console.error("Error checking FK:", error);
    }
}

checkFK();
