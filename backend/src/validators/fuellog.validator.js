export const validateFuelLog = ({ vehicle_id, liters, fuel_cost, fuel_station }) => {
    const errors = [];
    if (!vehicle_id) errors.push("Vehicle ID is required");
    if (liters === undefined || Number(liters) <= 0) errors.push("Liters must be positive");
    if (fuel_cost === undefined || Number(fuel_cost) < 0) errors.push("Fuel cost must be non-negative");
    if (!fuel_station || !fuel_station.trim()) errors.push("Fuel station is required");
    return errors;
};
