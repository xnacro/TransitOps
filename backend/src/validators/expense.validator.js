const VALID_CATEGORIES = ["Fuel", "Maintenance", "Parking", "Insurance", "Repair", "Toll", "Other"];

export const validateExpense = ({ vehicle_id, category, amount }) => {
    const errors = [];
    if (!vehicle_id) errors.push("Vehicle ID is required");
    if (!category) errors.push("Category is required");
    else if (!VALID_CATEGORIES.includes(category)) errors.push("Category must be one of: " + VALID_CATEGORIES.join(", "));
    if (amount === undefined || Number(amount) < 0) errors.push("Amount must be non-negative");
    return errors;
};
