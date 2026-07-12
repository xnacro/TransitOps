import Vehicle from "../models/vehicle.model.js";
import { validateVehicle, validateVehicleUpdate } from "../validators/vehicle.validator.js";

class VehicleController {

    static async create(req, res) {
        try {
            const errors = validateVehicle(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const existing = await Vehicle.findByRegNumber(req.body.registration_number);
            if (existing) return res.status(409).json({ success: false, message: "Registration number already exists", errors: [] });

            const vehicle = await Vehicle.create(req.body);
            return res.status(201).json({ success: true, message: "Vehicle created", data: { vehicle } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findAll(req, res) {
        try {
            const vehicles = await Vehicle.findAll();
            return res.status(200).json({ success: true, message: "Vehicles retrieved", data: { vehicles } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findById(req, res) {
        try {
            const vehicle = await Vehicle.findById(req.params.id);
            if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found", errors: [] });
            return res.status(200).json({ success: true, message: "Vehicle retrieved", data: { vehicle } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async update(req, res) {
        try {
            const errors = validateVehicleUpdate(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const existing = await Vehicle.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: "Vehicle not found", errors: [] });

            if (req.body.registration_number && req.body.registration_number !== existing.registration_number) {
                const dup = await Vehicle.findByRegNumber(req.body.registration_number);
                if (dup) return res.status(409).json({ success: false, message: "Registration number already exists", errors: [] });
            }

            const vehicle = await Vehicle.update(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Vehicle updated", data: { vehicle } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async delete(req, res) {
        try {
            const vehicle = await Vehicle.findById(req.params.id);
            if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found", errors: [] });
            await Vehicle.delete(req.params.id);
            return res.status(200).json({ success: true, message: "Vehicle deleted", data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}

export default VehicleController;
