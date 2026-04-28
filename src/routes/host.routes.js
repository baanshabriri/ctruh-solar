import express from "express";
import { getNearbyHosts } from "../controllers/host.controller.js";
import { rateLimiter } from "../middleware/ratelimiter.middleware.js";
import { nearbyHostsSchema } from "../validators/host.validator.js";
import { validateRequest } from "../middleware/validator.middleware.js";

const router = express.Router();
router.get("/nearby", validateRequest(nearbyHostsSchema), rateLimiter({ window: 30, limit: 100 }), getNearbyHosts);

export default router;