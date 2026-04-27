import * as geoService from "../services/geo.service.js";
import { systemLogger } from "../logger/index.js";
import Host from "../models/host.model.js";
import { count } from "node:console";

export async function getNearbyHosts(req, res, next) {
    try {
        const { lat, lng, radius = 5000, limit = 20 } = req.query;
        const tenantId = req.tenantId;
        if (!lat || !lng || !tenantId) {
            return res.status(400).json({
                error: "lat, lng and tenantId are required",
            });
        }
        const start = Date.now();
        const results = await geoService.getNearbyHosts({
            tenantId,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            radius: parseInt(radius),
            count: parseInt(limit),
        });
        const duration = Date.now() - start;
        systemLogger.info({ message: "Geo query latency", duration });
        res.json({
            nearbyHosts: results,
            count: results.length,
        });

    } catch (err) {
        systemLogger.error({
            message: "Error in getNearbyHosts controller",
            error: err.message,
            requestId: req.id,
        });
        next(err);
    }
}