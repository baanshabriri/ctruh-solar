import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";

const SALT_ROUNDS = 10;
export async function createUser({ username, password, tenantId }) {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({
            username,
            password: hashedPassword,
            tenantId,
        });
        return user;
    } catch (err) {
        throw new Error("User creation failed: " + err.message);
    }
}

export async function verifyUser({ username, password }) {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error("User not found. Please sign up.");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Username or password is incorrect");
        }
        const token = signToken({
            userId: user._id.toString(),
            tenantId: user.tenantId,
        });
        return { token };
    } catch (err) {
        throw new Error("User verification failed: " + err.message);
    }

}