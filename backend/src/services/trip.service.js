import Vehicle from "../models/vehicle.model.js";
import Driver from "../models/driver.model.js";
import Trip from "../models/trip.model.js";

class TripService {

    static async createDraft({ source, destination, vehicle_id, driver_id, cargo_weight, planned_distance, revenue }) {
        const vehicle = await Vehicle.findById(vehicle_id);
        if (!vehicle) throw { status: 404, message: "Vehicle not found" };
        if (vehicle.status === "Retired") throw { status: 400, message: "Cannot assign a retired vehicle" };
        if (vehicle.status === "In Shop") throw { status: 400, message: "Cannot assign a vehicle in maintenance" };
        if (vehicle.status === "On Trip") throw { status: 400, message: "Vehicle is already on a trip" };
        if (Number(cargo_weight) > Number(vehicle.capacity)) throw { status: 400, message: "Cargo weight exceeds vehicle capacity (" + vehicle.capacity + ")" };

        const driver = await Driver.findById(driver_id);
        if (!driver) throw { status: 404, message: "Driver not found" };
        if (driver.status === "Suspended") throw { status: 400, message: "Cannot assign a suspended driver" };
        if (driver.status === "On Trip") throw { status: 400, message: "Driver is already on a trip" };
        if (new Date(driver.license_expiry) < new Date()) throw { status: 400, message: "Driver license has expired" };

        const trip = await Trip.create({
            source, destination, vehicle_id, driver_id,
            cargo_weight, planned_distance,
            start_odometer: vehicle.odometer,
            revenue: revenue || 0,
        });

        return trip;
    }

    static async dispatch(tripId) {
        const trip = await Trip.findById(tripId);
        if (!trip) throw { status: 404, message: "Trip not found" };
        if (trip.status !== "Draft") throw { status: 400, message: "Only draft trips can be dispatched" };

        await Vehicle.updateStatus(trip.vehicle_id, "On Trip");
        await Driver.updateStatus(trip.driver_id, "On Trip");

        const updated = await Trip.update(tripId, { status: "Dispatched" });
        return updated;
    }

    static async complete(tripId, end_odometer) {
        const trip = await Trip.findById(tripId);
        if (!trip) throw { status: 404, message: "Trip not found" };
        if (trip.status !== "Dispatched") throw { status: 400, message: "Only dispatched trips can be completed" };
        if (Number(end_odometer) < Number(trip.start_odometer)) throw { status: 400, message: "End odometer cannot be less than start odometer" };

        const distance_travelled = Number(end_odometer) - Number(trip.start_odometer);

        await Vehicle.updateStatus(trip.vehicle_id, "Available");
        await Vehicle.updateOdometer(trip.vehicle_id, end_odometer);
        await Driver.updateStatus(trip.driver_id, "Available");

        const updated = await Trip.update(tripId, {
            status: "Completed",
            end_odometer,
            distance_travelled,
        });
        return updated;
    }

    static async cancel(tripId) {
        const trip = await Trip.findById(tripId);
        if (!trip) throw { status: 404, message: "Trip not found" };
        if (trip.status === "Completed") throw { status: 400, message: "Cannot cancel a completed trip" };
        if (trip.status === "Cancelled") throw { status: 400, message: "Trip is already cancelled" };

        if (trip.status === "Dispatched") {
            await Vehicle.updateStatus(trip.vehicle_id, "Available");
            await Driver.updateStatus(trip.driver_id, "Available");
        }

        const updated = await Trip.update(tripId, { status: "Cancelled" });
        return updated;
    }
}

export default TripService;