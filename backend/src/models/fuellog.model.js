import pool from "../config/db.js";

class FuelLog {

    static async create({ vehicle_id, trip_id, liters, fuel_cost, fuel_station, date, fuel_efficiency }) {
        const result = await pool.query(
            `INSERT INTO fuel_logs (vehicle_id, trip_id, liters, fuel_cost, fuel_station, date, fuel_efficiency)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [vehicle_id, trip_id || null, liters, fuel_cost, fuel_station, date || new Date(), fuel_efficiency || null]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT f.*, v.registration_number AS vehicle_reg
             FROM fuel_logs f
             JOIN vehicles v ON f.vehicle_id = v.id
             WHERE f.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(
            `SELECT f.*, v.registration_number AS vehicle_reg
             FROM fuel_logs f
             JOIN vehicles v ON f.vehicle_id = v.id
             ORDER BY f.created_at DESC`
        );
        return result.rows;
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM fuel_logs WHERE id = $1 RETURNING id", [id]);
        return result.rows[0];
    }

    static async findByVehicle(vehicle_id) {
        const result = await pool.query(
            "SELECT * FROM fuel_logs WHERE vehicle_id = $1 ORDER BY date DESC",
            [vehicle_id]
        );
        return result.rows;
    }

    static async findByTrip(trip_id) {
        const result = await pool.query(
            "SELECT * FROM fuel_logs WHERE trip_id = $1 ORDER BY date DESC",
            [trip_id]
        );
        return result.rows;
    }
}

export default FuelLog;
