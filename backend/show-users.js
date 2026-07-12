import pool from "./src/config/db.js";

async function showUsers() {
    try {
        const res = await pool.query("SELECT id, name, email, role_id FROM users;");
        console.log("Users in database:");
        console.log(res.rows);
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await pool.end();
    }
}
showUsers();
