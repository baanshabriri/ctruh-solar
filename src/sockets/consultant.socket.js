import { updateConsultantLocation } from "../services/consultant.service.js";
import { activeConnections, consultantLocationUpdates } from "../metrics/index.js";
export function initSocket(io, redisClient, { systemLogger }) {
    io.use((socket, next) => {
        const tenantId = socket.handshake.auth?.tenantId;
        if (!tenantId) {
            return next(new Error("Missing tenantId in handshake"));
        }
        socket.tenantId = tenantId;
        socket.join(`tenant:${tenantId}`);

        next();
    });
    io.on("connection", (socket) => {
        activeConnections.inc();
        systemLogger.info({
            message: "Socket connected",
            socketId: socket.id,
        });
        socket.on("location_update", async (data) => {
            consultantLocationUpdates.inc();
            await updateConsultantLocation({ ...data, tenantId: socket.tenantId });
        });

        socket.on("disconnect", () => {
            systemLogger.info({
                message: "Socket disconnected",
                socketId: socket.id,
            });
            activeConnections.dec();
        });
    });

    systemLogger.info("Socket.io initialized");
}