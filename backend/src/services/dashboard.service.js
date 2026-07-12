import pool from "../config/db.js";

class DashboardService {
    static async getStats() {
        // Run parallel counts
        const [
            activeVehiclesReq,
            availableVehiclesReq,
            inMaintenanceReq,
            activeTripsReq,
            problemTripsReq,
            driversOnDutyReq,
            totalVehiclesReq,
            recentTripsReq
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'active' OR status = 'available'"), // 'active' is not actually a status, 'in-transit' is? Let's just count total - maintenance for active? Wait, 'available', 'in-transit', 'maintenance'
            pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'available'"),
            pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'maintenance'"),
            pool.query("SELECT COUNT(*) FROM trips WHERE status = 'in-progress'"),
            pool.query("SELECT COUNT(*) FROM trips WHERE status = 'cancelled'"), // Or some other problem status
            pool.query("SELECT COUNT(*) FROM drivers WHERE status = 'on-duty' OR status = 'driving'"),
            pool.query("SELECT COUNT(*) FROM vehicles"),
            pool.query(`
                SELECT t.id, t.origin, t.destination, t.status, v.registration_number as vehicle_reg, d.name as driver_name 
                FROM trips t 
                LEFT JOIN vehicles v ON t.vehicle_id = v.id 
                LEFT JOIN drivers d ON t.driver_id = d.id
                ORDER BY t.created_at DESC 
                LIMIT 5
            `)
        ]);

        const totalVehicles = parseInt(totalVehiclesReq.rows[0].count) || 0;
        const inMaintenance = parseInt(inMaintenanceReq.rows[0].count) || 0;
        const availableVehicles = parseInt(availableVehiclesReq.rows[0].count) || 0;
        // active can be total - maintenance, or just vehicles in-transit
        const inTransitReq = await pool.query("SELECT COUNT(*) FROM vehicles WHERE status = 'in-transit'");
        const activeVehicles = parseInt(inTransitReq.rows[0].count) || 0;

        const fleetUtilization = totalVehicles > 0 ? Math.round(((totalVehicles - inMaintenance) / totalVehicles) * 100) : 0;

        // format recent trips for frontend
        const recentTrips = recentTripsReq.rows.map(t => ({
            id: t.id,
            route: `${t.origin} - ${t.destination}`,
            vehicle: t.vehicle_reg || 'Unassigned',
            driver: t.driver_name || 'Unassigned',
            status: t.status === 'in-progress' ? 'In Transit' : (t.status === 'completed' ? 'Completed' : 'Cancelled'),
            statusColor: t.status === 'in-progress' ? 'text-blue-500 bg-blue-500/10' : (t.status === 'completed' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10')
        }));

        const vehicleStatus = [
            { name: "Available", value: availableVehicles, color: "#10b981" },
            { name: "In Transit", value: activeVehicles, color: "#3b82f6" },
            { name: "Maintenance", value: inMaintenance, color: "#f59e0b" }
        ];

        return {
            activeVehicles,
            availableVehicles,
            inMaintenance,
            activeTrips: parseInt(activeTripsReq.rows[0].count) || 0,
            problemTrips: parseInt(problemTripsReq.rows[0].count) || 0,
            driversOnDuty: parseInt(driversOnDutyReq.rows[0].count) || 0,
            fleetUtilization,
            vehicleStatus,
            recentTrips
        };
    }
}

export default DashboardService;
