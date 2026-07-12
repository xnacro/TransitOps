import Maintenance from "../models/maintenance.model.js";
import MaintenanceService from "../services/maintenance.service.js";
import { validateMaintenance } from "../validators/maintenance.validator.js";

class MaintenanceController {

    static async create(req, res) {
        try {
            const errors = validateMaintenance(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const record = await MaintenanceService.create(req.body);
            return res.status(201).json({ success: true, message: "Maintenance created", data: { maintenance: record } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findAll(req, res) {
        try {
            const records = await Maintenance.findAll();
            return res.status(200).json({ success: true, message: "Maintenance records retrieved", data: { maintenance: records } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findById(req, res) {
        try {
            const record = await Maintenance.findById(req.params.id);
            if (!record) return res.status(404).json({ success: false, message: "Maintenance record not found", errors: [] });
            return res.status(200).json({ success: true, message: "Maintenance record retrieved", data: { maintenance: record } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async update(req, res) {
        try {
            const existing = await Maintenance.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: "Maintenance record not found", errors: [] });
            if (existing.status === "Closed") return res.status(400).json({ success: false, message: "Cannot update a closed maintenance record", errors: [] });

            const record = await Maintenance.update(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Maintenance updated", data: { maintenance: record } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async close(req, res) {
        try {
            const record = await MaintenanceService.close(req.params.id);
            return res.status(200).json({ success: true, message: "Maintenance closed", data: { maintenance: record } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async delete(req, res) {
        try {
            const existing = await Maintenance.findById(req.params.id);
            if (!existing) return res.status(404).json({ success: false, message: "Maintenance record not found", errors: [] });
            await Maintenance.delete(req.params.id);
            return res.status(200).json({ success: true, message: "Maintenance deleted", data: null });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}

export default MaintenanceController;
