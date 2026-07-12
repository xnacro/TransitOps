import Vehicle from "../models/vehicle.model.js";
import Maintenance from "../models/maintenance.model.js";

class MaintenanceService {

    static async create({ vehicle_id, description, garage, cost, start_date }) {
        const vehicle = await Vehicle.findById(vehicle_id);
        if (!vehicle) throw { status: 404, message: "Vehicle not found" };
        if (vehicle.status === "Retired") throw { status: 400, message: "Cannot create maintenance for a retired vehicle" };
        if (vehicle.status === "On Trip") throw { status: 400, message: "Cannot create maintenance for a vehicle on trip" };

        await Vehicle.updateStatus(vehicle_id, "In Shop");

        const record = await Maintenance.create({ vehicle_id, description, garage, cost, start_date });
        return record;
    }

    static async close(id) {
        const record = await Maintenance.findById(id);
        if (!record) throw { status: 404, message: "Maintenance record not found" };
        if (record.status === "Closed") throw { status: 400, message: "Maintenance is already closed" };

        const vehicle = await Vehicle.findById(record.vehicle_id);
        if (vehicle && vehicle.status !== "Retired") {
            await Vehicle.updateStatus(record.vehicle_id, "Available");
        }

        const updated = await Maintenance.close(id);
        return updated;
    }
}

export default MaintenanceService;
