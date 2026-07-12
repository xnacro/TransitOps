import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function addAdmin() {
    // Add admin role
    await pool.query(`INSERT INTO roles (id, name, description) VALUES (5, 'admin', 'Full system administrator with all permissions') ON CONFLICT (id) DO NOTHING`);
    // Update admin user to admin role
    await pool.query(`UPDATE users SET role_id = 5 WHERE email = 'admin@transitops.com'`);
    
    const r = await pool.query(`SELECT id, name FROM roles ORDER BY id`);
    console.log("Roles:", JSON.stringify(r.rows));
    const u = await pool.query(`SELECT id, name, email, role_id FROM users`);
    console.log("Users:", JSON.stringify(u.rows));
    
    // Verify data counts
    const counts = await pool.query(`
        SELECT 
            (SELECT COUNT(*) FROM vehicles)::int AS vehicles,
            (SELECT COUNT(*) FROM drivers)::int AS drivers,
            (SELECT COUNT(*) FROM trips)::int AS trips,
            (SELECT COUNT(*) FROM maintenance_logs)::int AS maintenance,
            (SELECT COUNT(*) FROM fuel_logs)::int AS fuel_logs,
            (SELECT COUNT(*) FROM expenses)::int AS expenses
    `);
    console.log("Data counts:", JSON.stringify(counts.rows[0]));
    
    await pool.end();
}
addAdmin();
