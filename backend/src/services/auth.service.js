import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

class AuthService {

    static async register({ name, email, password, role_id }) {

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw { status: 409, message: "Email is already registered" };
        }

        const role = await Role.findById(role_id);
        if (!role) {
            throw { status: 400, message: "Invalid role ID — role does not exist" };
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name:     name.trim(),
            email:    email.trim().toLowerCase(),
            password: hashedPassword,
            role_id,
        });

        return { user };
    }

    static async login({ email, password }) {

        const user = await User.findByEmail(email.trim().toLowerCase());
        if (!user) {
            throw { status: 401, message: "Invalid email or password" };
        }

        if (!user.is_active) {
            throw { status: 403, message: "Account is deactivated. Contact an administrator" };
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw { status: 401, message: "Invalid email or password" };
        }

        const token = generateToken({ id: user.id, role_id: user.role_id });

        const { password: _pw, ...safeUser } = user;

        return { user: safeUser, token };
    }

    static async getProfile(userId) {

        const user = await User.findById(userId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return { user };
    }
}

export default AuthService;
