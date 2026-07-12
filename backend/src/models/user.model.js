import pool from "../config/db.js";

class User {

    static async create({ name, email, password, role_id }) {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role_id)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role_id, is_active, created_at, updated_at`,
            [name, email, password, role_id]
        );
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email, u.role_id, r.name AS role_name,
                    u.is_active, u.created_at, u.updated_at
             FROM users u
             INNER JOIN roles r ON u.role_id = r.id
             WHERE u.id = $1`,
            [id]
        );
        return result.rows[0];
    }
}

export default User;
