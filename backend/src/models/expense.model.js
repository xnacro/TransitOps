import pool from "../config/db.js";

class Expense {

    static async create({ vehicle_id, category, description, amount, date }) {
        const result = await pool.query(
            `INSERT INTO expenses (vehicle_id, category, description, amount, date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [vehicle_id, category, description || null, amount, date || new Date()]
        );
        return result.rows[0];
    }

    static async findById(id) {
        const result = await pool.query(
            `SELECT e.*, v.registration_number AS vehicle_reg
             FROM expenses e
             JOIN vehicles v ON e.vehicle_id = v.id
             WHERE e.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async findAll() {
        const result = await pool.query(
            `SELECT e.*, v.registration_number AS vehicle_reg
             FROM expenses e
             JOIN vehicles v ON e.vehicle_id = v.id
             ORDER BY e.created_at DESC`
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
            `UPDATE expenses SET ${sets} WHERE id = $${vals.length} RETURNING *`,
            vals
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await pool.query("DELETE FROM expenses WHERE id = $1 RETURNING id", [id]);
        return result.rows[0];
    }

    static async findByVehicle(vehicle_id) {
        const result = await pool.query(
            "SELECT * FROM expenses WHERE vehicle_id = $1 ORDER BY date DESC",
            [vehicle_id]
        );
        return result.rows;
    }

    static async sumByVehicle() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number, COALESCE(SUM(e.amount), 0)::numeric AS total_cost
             FROM vehicles v
             LEFT JOIN expenses e ON v.id = e.vehicle_id
             GROUP BY v.id, v.registration_number
             ORDER BY total_cost DESC`
        );
        return result.rows;
    }

    static async sumByCategory() {
        const result = await pool.query(
            `SELECT category, COALESCE(SUM(amount), 0)::numeric AS total
             FROM expenses
             GROUP BY category
             ORDER BY total DESC`
        );
        return result.rows;
    }
}

export default Expense;
