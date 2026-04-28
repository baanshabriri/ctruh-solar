export function tenantMiddleware(req, res, next) {
    const tenantId = req.headers["x-tenant-id"];
    if (!tenantId) {
        return res.status(400).json({
            error: "Missing tenant ID in request headers",
        });
    }
    req.tenantId = tenantId;
    next();
}