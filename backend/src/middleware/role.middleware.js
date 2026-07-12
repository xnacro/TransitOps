import Role from "../models/role.model.js";

const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { role_id } = req.user;

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
