import pool from "../config/db.js";

class ReportService {

    static async fuelEfficiency() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number, v.make, v.model,
                    COALESCE(SUM(f.liters), 0)::numeric AS total_liters,
                    COALESCE(SUM(t.distance_travelled), 0)::numeric AS total_distance,
                    CASE WHEN COALESCE(SUM(f.liters), 0) > 0
                         THEN ROUND(COALESCE(SUM(t.distance_travelled), 0) / SUM(f.liters), 2)
                         ELSE 0 END AS efficiency_km_per_liter
             FROM vehicles v
             LEFT JOIN fuel_logs f ON v.id = f.vehicle_id
             LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
             GROUP BY v.id, v.registration_number, v.make, v.model
             ORDER BY efficiency_km_per_liter DESC`
        );
        return result.rows;
    }

    static async fleetUtilization() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number, v.status,
                    COUNT(t.id)::int AS total_trips,
                    COUNT(t.id) FILTER (WHERE t.status = 'Completed')::int AS completed_trips,
                    COALESCE(SUM(t.distance_travelled), 0)::numeric AS total_distance
             FROM vehicles v
             LEFT JOIN trips t ON v.id = t.vehicle_id
             GROUP BY v.id, v.registration_number, v.status
             ORDER BY total_trips DESC`
        );
        return result.rows;
    }

    static async vehicleROI() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number,
                    COALESCE(SUM(t.revenue), 0)::numeric AS total_revenue,
                    COALESCE(SUM(e.amount), 0)::numeric AS total_expense,
                    (COALESCE(SUM(t.revenue), 0) - COALESCE(SUM(e.amount), 0))::numeric AS net_profit
             FROM vehicles v
             LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
             LEFT JOIN expenses e ON v.id = e.vehicle_id
             GROUP BY v.id, v.registration_number
             ORDER BY net_profit DESC`
        );
        return result.rows;
    }

    static async revenue() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number,
                    COUNT(t.id)::int AS trip_count,
                    COALESCE(SUM(t.revenue), 0)::numeric AS total_revenue
             FROM vehicles v
             LEFT JOIN trips t ON v.id = t.vehicle_id AND t.status = 'Completed'
             GROUP BY v.id, v.registration_number
             ORDER BY total_revenue DESC`
        );
        return result.rows;
    }

    static async operationalCost() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number,
                    COALESCE(SUM(e.amount), 0)::numeric AS total_cost
             FROM vehicles v
             LEFT JOIN expenses e ON v.id = e.vehicle_id
             GROUP BY v.id, v.registration_number
             ORDER BY total_cost DESC`
        );
        return result.rows;
    }

    static async maintenanceCost() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number,
                    COUNT(m.id)::int AS maintenance_count,
                    COALESCE(SUM(m.cost), 0)::numeric AS total_cost
             FROM vehicles v
             LEFT JOIN maintenance_logs m ON v.id = m.vehicle_id
             GROUP BY v.id, v.registration_number
             ORDER BY total_cost DESC`
        );
        return result.rows;
    }

    static async expenseSummary() {
        const result = await pool.query(
            `SELECT category, COUNT(*)::int AS count, COALESCE(SUM(amount), 0)::numeric AS total
             FROM expenses GROUP BY category ORDER BY total DESC`
        );
        return result.rows;
    }

    static async vehiclePerformance() {
        const result = await pool.query(
            `SELECT v.id, v.registration_number, v.make, v.model, v.status, v.odometer,
                    COUNT(t.id)::int AS total_trips,
                    COUNT(t.id) FILTER (WHERE t.status = 'Completed')::int AS completed_trips,
                    COALESCE(SUM(t.distance_travelled), 0)::numeric AS total_distance,
                    COALESCE(SUM(t.revenue), 0)::numeric AS total_revenue,
                    COALESCE((SELECT SUM(amount) FROM expenses WHERE vehicle_id = v.id), 0)::numeric AS total_expense
             FROM vehicles v
             LEFT JOIN trips t ON v.id = t.vehicle_id
             GROUP BY v.id, v.registration_number, v.make, v.model, v.status, v.odometer
             ORDER BY total_revenue DESC`
        );
        return result.rows;
    }
}

export default ReportService;
