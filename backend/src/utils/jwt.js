import jwt from "jsonwebtoken";

const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

/**
 * Generate a signed JWT.
 * @param {object} payload - Data to encode (e.g. { id, role_id })
 * @returns {string} Signed token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT.
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
