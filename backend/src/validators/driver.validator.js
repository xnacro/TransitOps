export const validateDriver = ({ name, phone, email, license_number, license_expiry }) => {
    const errors = [];
    if (!name || !name.trim()) errors.push("Name is required");
    if (!phone || !phone.trim()) errors.push("Phone is required");
    if (!email || !email.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Email is not valid");
    if (!license_number || !license_number.trim()) errors.push("License number is required");
    if (!license_expiry) errors.push("License expiry date is required");
    return errors;
};

export const validateDriverUpdate = (body) => {
    const errors = [];
    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("Email is not valid");
    if (body.status && !["Available", "On Trip", "Suspended"].includes(body.status)) errors.push("Invalid status");
    return errors;
};
