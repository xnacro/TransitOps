const VALID_FUEL_TYPES = ["Diesel", "Petrol", "CNG", "Electric", "Hybrid"];
const VALID_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];

export const validateVehicle = ({ registration_number, make, model, year, type, capacity, fuel_type }) => {
    const errors = [];
    if (!registration_number || !registration_number.trim()) errors.push("Registration number is required");
    if (!make || !make.trim()) errors.push("Make is required");
    if (!model || !model.trim()) errors.push("Model is required");
    if (!year || !Number.isInteger(Number(year))) errors.push("Year must be a valid integer");
    if (!type || !type.trim()) errors.push("Vehicle type is required");
    if (capacity === undefined || capacity === null || Number(capacity) < 0) errors.push("Capacity must be a non-negative number");
    if (fuel_type && !VALID_FUEL_TYPES.includes(fuel_type)) errors.push("Fuel type must be one of: " + VALID_FUEL_TYPES.join(", "));
    return errors;
};

export const validateVehicleUpdate = (body) => {
    const errors = [];
    if (body.fuel_type && !VALID_FUEL_TYPES.includes(body.fuel_type)) errors.push("Invalid fuel type");
    if (body.status && !VALID_STATUSES.includes(body.status)) errors.push("Invalid status");
    if (body.capacity !== undefined && Number(body.capacity) < 0) errors.push("Capacity must be non-negative");
    if (body.year && !Number.isInteger(Number(body.year))) errors.push("Year must be a valid integer");
    return errors;
};
