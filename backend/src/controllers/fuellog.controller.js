import FuelLog from "../models/fuellog.model.js";
import Trip from "../models/trip.model.js";
import Vehicle from "../models/vehicle.model.js";
import { validateFuelLog } from "../validators/fuellog.validator.js";

class FuelLogController {

    static async create(req, res) {
        try {
            const errors = validateFuelLog(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const vehicle = await Vehicle.findById(req.body.vehicle_id);
            if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found", errors: [] });

            let fuel_efficiency = null;
            if (req.body.trip_id) {
                const trip = await Trip.findById(req.body.trip_id);
                if (!trip) return res.status(404).json({ success: false, message: "Trip not found", errors: [] });
                if (trip.distance_travelled && Number(req.body.liters) > 0) {
                    fuel_efficiency = Math.round((Number(trip.distance_travelled) / Number(req.body.liters)) * 100) / 100;
                }
            }

            const fuelLog = await FuelLog.create({ ...req.body, fuel_efficiency });
            return res.status(201).json({ success: true, message: "Fuel log created", data: { fuel_log: fuelLog } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findAll(req, res) {
        try {
            const fuelLogs = await FuelLog.findAll();
            return res.status(200).json({ success: true, message: "Fuel logs retrieved", data: { fuel_logs: fuelLogs } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findById(req, res) {
        try {
            const fuelLog = await FuelLog.findById(req.params.id);
            if (!fuelLog) return res.status(404).json({ success: false, message: "Fuel log not found", errors: [] });
            return res.status(200).json({ success: true, message: "Fuel log retrieved", data: { fuel_log: fuelLog } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async delete(req, res) {
        try {
            const fuelLog = await FuelLog.findById(req.params.id);
            if (!fuelLog) return res.status(404).json({ success: false, message: "Fuel log not found", errors: [] });
            await FuelLog.delete(req.params.id);
            return res.status(200).json({ success: true, message: "Fuel log deleted", data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}

export default FuelLogController;
