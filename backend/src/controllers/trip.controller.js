import Trip from "../models/trip.model.js";
import TripService from "../services/trip.service.js";
import { validateTrip, validateTripComplete } from "../validators/trip.validator.js";

class TripController {
    static async create(req, res) {
        try {
            const errors = validateTrip(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const trip = await TripService.createDraft(req.body);
            return res.status(201).json({ success: true, message: "Trip created as draft", data: { trip } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
    static async findAll(req, res) {
        try {
            const trips = await Trip.findAll();
            return res.status(200).json({ success: true, message: "Trips retrieved", data: { trips } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async findById(req, res) {
        try {
            const trip = await Trip.findById(req.params.id);
            if (!trip) return res.status(404).json({ success: false, message: "Trip not found", errors: [] });
            return res.status(200).json({ success: true, message: "Trip retrieved", data: { trip } });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async update(req, res) {
        try {
            const trip = await Trip.findById(req.params.id);
            if (!trip) return res.status(404).json({ success: false, message: "Trip not found", errors: [] });
            if (trip.status !== "Draft") return res.status(400).json({ success: false, message: "Only draft trips can be updated", errors: [] });

            const updated = await Trip.update(req.params.id, req.body);
            return res.status(200).json({ success: true, message: "Trip updated", data: { trip: updated } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async dispatch(req, res) {
        try {
            const trip = await TripService.dispatch(req.params.id);
            return res.status(200).json({ success: true, message: "Trip dispatched", data: { trip } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }

    static async complete(req, res) {
        try {
            const errors = validateTripComplete(req.body);
            if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation failed", errors });

            const trip = await TripService.complete(req.params.id, req.body.end_odometer);
            return res.status(200).json({ success: true, message: "Trip completed", data: { trip } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
    static async cancel(req, res) {
        try {
            const trip = await TripService.cancel(req.params.id);
            return res.status(200).json({ success: true, message: "Trip cancelled", data: { trip } });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error", errors: [] });
        }
    }
}
export default TripController;