import pool from "../config/db.js";

class Maintenance {

    static async create({ vehicle_id, description, garage, cost, start_date }) {
        const result = await pool.query(
            `INSERT INTO maintenance_logs (vehicle_id, description, garage, cost, start_date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [vehicle_id, description, garage, cost, start_date || new Date()]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT m.*, v.registration_number AS vehicle_reg
             FROM maintenance_logs m
             JOIN vehicles v ON m.vehicle_id = v.id
             WHERE m.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(
            `SELECT m.*, v.registration_number AS vehicle_reg
             FROM maintenance_logs m
             JOIN vehicles v ON m.vehicle_id = v.id
             ORDER BY m.created_at DESC`
        );
        return result.rows;
    }

    static async update(id, fields) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return null;
        const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
        const vals = keys.map(k => fields[k]);
        vals.push(id);
        const result = await pool.query(
            `UPDATE maintenance_logs SET ${sets} WHERE id = $${vals.length} RETURNING *`,
            vals
        );
        return result.rows[0];
    }

    static async close(id, completion_date) {
        const result = await pool.query(
            `UPDATE maintenance_logs SET status = 'Closed', completion_date = $1 WHERE id = $2 RETURNING *`,
            [completion_date || new Date(), id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM maintenance_logs WHERE id = $1 RETURNING id", [id]);
        return result.rows[0];
    }

    static async findByVehicle(vehicle_id) {
        const result = await pool.query(
            "SELECT * FROM maintenance_logs WHERE vehicle_id = $1 ORDER BY created_at DESC",
            [vehicle_id]
        );
        return result.rows;
    }
}

export default Maintenance;
