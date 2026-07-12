import Role from "../models/role.model.js";

/**
 * Role-based access control middleware factory.
 *
 * Usage:
 *   authorize("Fleet Manager")
 *   authorize("Fleet Manager", "Safety Officer")
 *
 * Must be used AFTER the authenticate middleware so that
 * req.user.role_id is available.
 *
 * @param  {...string} allowedRoles - Role names that are permitted
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { role_id } = req.user;

            // Fetch the role name from the database
            const role = await Role.findById(role_id);

            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied — role not found",
                    errors: [],
                });
            }

            if (!allowedRoles.includes(role.name)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied — requires one of: ${allowedRoles.join(", ")}`,
                    errors: [],
                });
            }

            // Attach role name for downstream convenience
            req.user.role_name = role.name;

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error during authorization",
                errors: [],
            });
        }
    };
};

export default authorize;
