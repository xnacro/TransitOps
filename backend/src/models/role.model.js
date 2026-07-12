import pool from "../config/db.js";

class Role {

    static async findById(id) {
        const result = await pool.query(
            "SELECT id, name, description, created_at FROM roles WHERE id = $1",
            [id]
        );
        return result.rows[0];
    }

    static async findByName(name) {
        const result = await pool.query(
            "SELECT id, name, description, created_at FROM roles WHERE name = $1",
            [name]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(
            "SELECT id, name, description, created_at FROM roles ORDER BY id"
        );
        return result.rows;
    }
}

export default Role;
