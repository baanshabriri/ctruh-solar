import express from "express";
import hostRoutes from "./host.routes.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";

const router = express.Router();
router.use("/hosts", tenantMiddleware, hostRoutes);

export default router;