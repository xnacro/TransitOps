import pool from "./src/config/db.js";

async function showRoles() {
    try {
        const res = await pool.query("SELECT * FROM roles;");
        console.log("Roles in database:");
        console.log(res.rows);
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await pool.end();
    }
}
showRoles();
