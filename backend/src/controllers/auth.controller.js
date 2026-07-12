import AuthService from "../services/auth.service.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

class AuthController {

    static async register(req, res) {
        try {
            const errors = validateRegister(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }

            const { name, email, password, role_id } = req.body;

            const { user } = await AuthService.register({ name, email, password, role_id });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: { user },
            });

        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal server error",
                errors: [],
            });
        }
    }

    static async login(req, res) {
        try {
            const errors = validateLogin(req.body);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });
            }

            const { email, password } = req.body;

            const { user, token } = await AuthService.login({ email, password });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: { user, token },
            });

        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal server error",
                errors: [],
            });
        }
    }

    static async getMe(req, res) {
        try {
            const { user } = await AuthService.getProfile(req.user.id);

            return res.status(200).json({
                success: true,
                message: "User profile retrieved",
                data: { user },
            });

        } catch (error) {
            const status = error.status || 500;
            return res.status(status).json({
                success: false,
                message: error.message || "Internal server error",
                errors: [],
            });
        }
    }
}

export default AuthController;
