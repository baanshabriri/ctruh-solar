import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        if (req.user.tenantId !== req.headers["x-tenant-id"]) {
            return res.status(403).json({
                error: "Tenant mismatch",
            });
        }
        next()
    } catch (err) {
        return res.status(401).json({ error: "Invalid Token" });
    }
}
