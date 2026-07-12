import pg from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
const hash = async (pw) => bcrypt.hash(pw, 10);

async function seedUsers() {
    const pw = await hash("admin123");
    
    const users = [
        ['Priya Sharma', 'driver@transitops.in', pw, 2],
        ['Ravi Patel', 'safety@transitops.in', pw, 3],
        ['Neha Gupta', 'analyst@transitops.in', pw, 4],
    ];
    
    for (const [name, email, password, role_id] of users) {
        await pool.query(
            `INSERT INTO users (name, email, password, role_id, is_active) VALUES ($1, $2, $3, $4, true) ON CONFLICT (email) DO UPDATE SET password = $3, role_id = $4`,
            [name, email, password, role_id]
        );
    }
    
    const u = await pool.query(`SELECT id, name, email, role_id FROM users ORDER BY id`);
    console.log("All users:", JSON.stringify(u.rows, null, 2));
    await pool.end();
}
seedUsers();
