import http from "http";
import express from "express";
import compression from "compression";
import cors from "cors";
import { v4 as uuid } from "uuid";
import { bodyParserErrorHandler } from "./middleware/bodyParserErrorHandler.middleware.js";
import { systemLogger } from "./logger/index.js";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";


export default function getHttpServer() {
    const app = express();
    app.use(
        express.json({
            limit: "100kb",
        })
    );
    app.use(
        bodyParserErrorHandler({
            onError: (err, req, res) => {
                systemLogger.error({
                    message: "Error parsing request body",
                    error: err.message,
                    requestId: req.id,
                });
            },
        })
    );
    app.use((err, req, res, next) => {
        systemLogger.error({
            message: "Unhandled error",
            error: err.message,
            requestId: req.id,
        });

        res.status(500).json({ error: "Internal Server Error" });
    });

    app.use((req, res, next) => {
        req.id = uuid();
        next();
    });
    app.get("/health", (req, res) => {
        res.status(200).json({
            message: "App is healthy",
            status: "ok",
        });
    });
    app.use(compression());
    app.use(cors());
    app.use("/api/auth", authRoutes);
    app.use("/api", authMiddleware, routes);
    const httpServer = http.createServer(app);

    return { app, httpServer };
}