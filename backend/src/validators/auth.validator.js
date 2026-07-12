export const validateRegister = ({ name, email, password, role_id }) => {
    const errors = [];

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        errors.push("Name is required");
    }

    if (!email || typeof email !== "string" || email.trim().length === 0) {
        errors.push("Email is required");
    } else if (!isValidEmail(email)) {
        errors.push("Email is not valid");
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required");
    } else if (password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }

    if (role_id === undefined || role_id === null) {
        errors.push("Role ID is required");
    } else if (!Number.isInteger(Number(role_id)) || Number(role_id) < 1) {
        errors.push("Role ID must be a positive integer");
    }

    return errors;
};

export const validateLogin = ({ email, password }) => {
    const errors = [];

    if (!email || typeof email !== "string" || email.trim().length === 0) {
        errors.push("Email is required");
    } else if (!isValidEmail(email)) {
        errors.push("Email is not valid");
    }

    if (!password || typeof password !== "string" || password.trim().length === 0) {
        errors.push("Password is required");
    }

    return errors;
};

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
