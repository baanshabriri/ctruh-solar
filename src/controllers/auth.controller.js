
import { createUser, verifyUser } from "../services/auth.service.js";

export async function signup(req, res) {
    try {
        const { username, password, tenantId } = req.body;
        if (!username || !password || !tenantId) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const user = await createUser({ username, password, tenantId });
        res.json({ message: "User created", userId: user._id.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const { token } = await verifyUser({ username, password });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
