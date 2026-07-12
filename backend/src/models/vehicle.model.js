import pool from "../config/db.js";

class Vehicle {

    static async create({ registration_number, make, model, year, type, capacity, fuel_type, odometer }) {
        const result = await pool.query(
            `INSERT INTO vehicles (registration_number, make, model, year, type, capacity, fuel_type, odometer)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [registration_number, make, model, year, type, capacity, fuel_type || "Diesel", odometer || 0]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
        return result.rows[0];
    }

    static async findByRegNumber(registration_number) {
        const result = await pool.query("SELECT * FROM vehicles WHERE registration_number = $1", [registration_number]);
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query("SELECT * FROM vehicles ORDER BY created_at DESC");
        return result.rows;
    }

    static async update(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return null;
        const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
        const vals = keys.map(k => fields[k]);
        vals.push(id);
        const result = await pool.query(
            `UPDATE vehicles SET ${sets}, updated_at = NOW() WHERE id = $${vals.length} RETURNING *`,
            vals
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM vehicles WHERE id = $1 RETURNING id", [id]);
        return result.rows[0];
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            "UPDATE vehicles SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [status, id]
        );
        return result.rows[0];
    }

    static async updateOdometer(id, odometer) {
        const result = await pool.query(
            "UPDATE vehicles SET odometer = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            [odometer, id]
        );
        return result.rows[0];
    }

    static async countByStatus() {
        const result = await pool.query(
            `SELECT
                COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'Available')::int AS available,
                COUNT(*) FILTER (WHERE status = 'On Trip')::int   AS on_trip,
                COUNT(*) FILTER (WHERE status = 'In Shop')::int   AS in_shop,
                COUNT(*) FILTER (WHERE status = 'Retired')::int   AS retired
             FROM vehicles`
        );
        return result.rows[0];
    }
}

export default Vehicle;
