import Driver from "../models/driver.model.js";
import { validateDriver, validateDriverUpdate } from "../validators/driver.validator.js";

class DriverController {

    static async create(req, res) {
        try {
            const errors = validateDriver(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const existingEmail = await Driver.findByEmail(req.body.email);
            if (existingEmail) return res.status(409).json({ success: false, message: "Email already exists", errors: [] });

            const existingLicense = await Driver.findByLicense(req.body.license_number);
            if (existingLicense) return res.status(409).json({ success: false, message: "License number already exists", errors: [] });

            const driver = await Driver.create(req.body);
            return res.status(201).json({ success: true, message: "Driver created", data: { driver } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findAll(req, res) {
        try {
            const drivers = await Driver.findAll();
            return res.status(200).json({ success: true, message: "Drivers retrieved", data: { drivers } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findById(req, res) {
        try {
            const driver = await Driver.findById(req.params.id);
            if (!driver) return res.status(404).json({ success: false, message: "Driver not found", errors: [] });
            return res.status(200).json({ success: true, message: "Driver retrieved", data: { driver } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async update(req, res) {
        try {
            const errors = validateDriverUpdate(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const existing = await Driver.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: "Driver not found", errors: [] });

            if (req.body.email && req.body.email !== existing.email) {
                const dup = await Driver.findByEmail(req.body.email);
                if (dup) return res.status(409).json({ success: false, message: "Email already exists", errors: [] });
            }
            if (req.body.license_number && req.body.license_number !== existing.license_number) {
                const dup = await Driver.findByLicense(req.body.license_number);
                if (dup) return res.status(409).json({ success: false, message: "License number already exists", errors: [] });
            }

            const driver = await Driver.update(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Driver updated", data: { driver } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async delete(req, res) {
        try {
            const driver = await Driver.findById(req.params.id);
            if (!driver) return res.status(404).json({ success: false, message: "Driver not found", errors: [] });
            await Driver.delete(req.params.id);
            return res.status(200).json({ success: true, message: "Driver deleted", data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}

export default DriverController;
