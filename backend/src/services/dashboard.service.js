import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";
import Trip from "../models/trip.model.js";

class DashboardService {

    static async getStats() {
        const [vehicles, drivers, trips] = await Promise.all([
            Vehicle.countByStatus(),
            Driver.countByStatus(),
            Trip.countByStatus(),
        ]);

        const totalVehicles = vehicles.total || 0;
        const onTrip = vehicles.on_trip || 0;
        const fleetUtilization = totalVehicles > 0 ? Math.round((onTrip / totalVehicles) * 100) : 0;

        return {
            vehicles,
            drivers,
            trips,
            fleet_utilization: fleetUtilization,
        };
    }
}

export default DashboardService;
