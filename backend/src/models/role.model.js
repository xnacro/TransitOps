import pool from "../config/db.js";

class Role {

    /**
     * Find a role by its primary key.
     * @param {number} id
     * @returns {Promise<object|undefined>}
     */
    static async findById(id) {
        const result = await pool.query(
            "SELECT id, name, description, created_at FROM roles WHERE id = $1",
            [id]
        );
        return result.rows[0];
    }

    /**
     * Find a role by its name.
     * @param {string} name
     * @returns {Promise<object|undefined>}
     */
    static async findByName(name) {
        const result = await pool.query(
            "SELECT id, name, description, created_at FROM roles WHERE name = $1",
            [name]
        );
        return result.rows[0];
    }

    /**
     * Return all roles.
     * @returns {Promise<object[]>}
     */
    static async findAll() {
        const result = await pool.query(
            "SELECT id, name, description, created_at FROM roles ORDER BY id"
        );
        return result.rows;
    }
}

export default Role;
