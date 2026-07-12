import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";
import Trip from "../models/trip.model.js";

class DashboardService {

    static async getStats() {
        const [vehicles, drivers, trips, allTrips] = await Promise.all([
            Vehicle.countByStatus(),
            Driver.countByStatus(),
            Trip.countByStatus(),
            Trip.findAll()
        ]);

        const totalVehicles = vehicles.total || 0;
        const onTrip = vehicles.on_trip || 0;
        const fleetUtilization = totalVehicles > 0 ? Math.round((onTrip / totalVehicles) * 100) : 0;

        const recentTrips = allTrips.slice(0, 5).map(t => ({
            id: t.id,
            route: `${t.source} - ${t.destination}`,
            vehicle: t.vehicle_reg || 'Unassigned',
            driver: t.driver_name || 'Unassigned',
            status: t.status === 'Dispatched' ? 'In Transit' : (t.status === 'Completed' ? 'Completed' : 'Cancelled'),
            statusColor: t.status === 'Dispatched' ? 'text-blue-500 bg-blue-500/10' : (t.status === 'Completed' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10')
        }));

        const vehicleStatus = [
            { name: "Available", value: vehicles.available || 0, color: "#10b981" },
            { name: "In Transit", value: vehicles.on_trip || 0, color: "#3b82f6" },
            { name: "Maintenance", value: vehicles.in_shop || 0, color: "#f59e0b" }
        ];

        return {
            activeVehicles: vehicles.on_trip || 0,
            availableVehicles: vehicles.available || 0,
            inMaintenance: vehicles.in_shop || 0,
            activeTrips: trips.active || 0,
            problemTrips: trips.cancelled || 0,
            driversOnDuty: (drivers.total - drivers.available) || 0,
            fleetUtilization,
            vehicleStatus,
            recentTrips
        };
    }
}

export default DashboardService;
