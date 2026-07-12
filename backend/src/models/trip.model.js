import pool from "../config/db.js";

class Trip {
    static async create({ source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, start_odometer, revenue }) {
        const result = await pool.query(
            `INSERT INTO trips (source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, start_odometer, revenue)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, start_odometer || 0, revenue || 0]
        );
        return result.rows[0];
    }
    static async findById(id) {
        const result = await pool.query(
            `SELECT t.*, v.registration_number AS vehicle_reg, v.make AS vehicle_make, v.model AS vehicle_model,
                    d.name AS driver_name, d.phone AS driver_phone
             FROM trips t
             JOIN vehicles v ON t.vehicle_id = v.id
             JOIN drivers d ON t.driver_id = d.id
             WHERE t.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(
            `SELECT t.*, v.registration_number AS vehicle_reg, d.name AS driver_name
             FROM trips t
             JOIN vehicles v ON t.vehicle_id = v.id
             JOIN drivers d ON t.driver_id = d.id
             ORDER BY t.created_at DESC`
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
            `UPDATE trips SET ${sets}, updated_at = NOW() WHERE id = $${vals.length} RETURNING *`,
            vals
        );
        return result.rows[0];
    }

    static async countByStatus() {
        const result = await pool.query(
            `SELECT
                COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'Draft')::int      AS draft,
                COUNT(*) FILTER (WHERE status = 'Dispatched')::int AS active,
                COUNT(*) FILTER (WHERE status = 'Completed')::int  AS completed,
                COUNT(*) FILTER (WHERE status = 'Cancelled')::int  AS cancelled
             FROM trips`
        );
        return result.rows[0];
    }

    static async findByVehicle(vehicle_id) {
        const result = await pool.query("SELECT * FROM trips WHERE vehicle_id = $1 ORDER BY created_at DESC", [vehicle_id]);
        return result.rows;
    }

    static async findByDriver(driver_id) {
        const result = await pool.query("SELECT * FROM trips WHERE driver_id = $1 ORDER BY created_at DESC", [driver_id]);
        return result.rows;
    }
}

export default Trip;