import pool from "../config/db.js";

class Driver {

    static async create({ name, phone, email, license_number, license_expiry }) {
        const result = await pool.query(
            `INSERT INTO drivers (name, phone, email, license_number, license_expiry)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, phone, email, license_number, license_expiry]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query("SELECT * FROM drivers WHERE email = $1", [email]);
        return result.rows[0];
    }

    static async findByLicense(license_number) {
        const result = await pool.query("SELECT * FROM drivers WHERE license_number = $1", [license_number]);
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query("SELECT * FROM drivers ORDER BY created_at DESC");
        return result.rows;
    }

    static async update(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return null;
        const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
        const vals = keys.map(k => fields[k]);
        vals.push(id);
        const result = await pool.query(
            `UPDATE drivers SET ${sets}, updated_at = NOW() WHERE id = $${vals.length} RETURNING *`,
            vals
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM drivers WHERE id = $1 RETURNING id", [id]);
        return result.rows[0];
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            "UPDATE drivers SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [status, id]
        );
        return result.rows[0];
    }

    static async countByStatus() {
        const result = await pool.query(
            `SELECT
                COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'Available')::int  AS available,
                COUNT(*) FILTER (WHERE status = 'On Trip')::int    AS on_trip,
                COUNT(*) FILTER (WHERE status = 'Suspended')::int  AS suspended
             FROM drivers`
        );
        return result.rows[0];
    }
}

export default Driver;
