import jwt from "jsonwebtoken";
import config from "../config/config.js"
const SECRET = config.JWT_SECRET;

export function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: "6h" });
}

export function verifyToken(token) {
    return jwt.verify(token, SECRET);
}