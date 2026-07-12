export const validateTrip = ({ source, destination, vehicle_id, driver_id, cargo_weight, planned_distance }) => {
    const errors = [];
    if (!source || !source.trim()) errors.push("Source is required");
    if (!destination || !destination.trim()) errors.push("Destination is required");
    if (!vehicle_id) errors.push("Vehicle ID is required");
    if (!driver_id) errors.push("Driver ID is required");
    if (cargo_weight === undefined || Number(cargo_weight) < 0) errors.push("Cargo weight must be non-negative");
    if (planned_distance === undefined || Number(planned_distance) <= 0) errors.push("Planned distance must be positive");
    return errors;
};

export const validateTripComplete = ({ end_odometer }) => {
    const errors = [];
    if (end_odometer === undefined || end_odometer === null) errors.push("End odometer is required");
    if (Number(end_odometer) < 0) errors.push("End odometer must be non-negative");
    return errors;
};