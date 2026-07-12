export const validateMaintenance = ({ vehicle_id, description, garage, cost }) => {
    const errors = [];
    if (!vehicle_id) errors.push("Vehicle ID is required");
    if (!description || !description.trim()) errors.push("Description is required");
    if (!garage || !garage.trim()) errors.push("Garage is required");
    if (cost === undefined || Number(cost) < 0) errors.push("Cost must be non-negative");
    return errors;
};
