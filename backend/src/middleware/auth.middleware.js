import { verifyToken } from "../utils/jwt.js";

/**
 * Authentication middleware.
 * Reads the Authorization header, verifies the JWT,
 * and attaches the decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied — no token provided",
                errors: [],
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token);

        // Attach decoded payload (id, role_id) to the request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Access denied — invalid or expired token",
            errors: [],
        });
    }
};

export default authenticate;
