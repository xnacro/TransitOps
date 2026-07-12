import pg from "pg";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const run = async () => {
    try {
        const sql = readFileSync(join(__dirname, "src", "sql", "schema.sql"), "utf-8");
        await pool.query(sql);
        console.log("Schema migration complete");
        const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
        r.rows.forEach(t => console.log(" -", t.table_name));
    } catch (err) {
        console.error("Migration failed:", err.message);
    } finally {
        await pool.end();
    }
};

run();
