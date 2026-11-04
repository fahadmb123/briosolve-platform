import "dotenv/config";
import { createServer } from "node:http";
import { connectRedis } from "./shared/database/redis.client";
import { logger } from "./shared/logger/logger";
import { createSocketServer } from "./shared/realtime/server/socket-server";
import { jwtService } from "./modules/auth/infrastructure/composition/services";
import { createApp } from "./app/app";
import { createRootRouter } from "./app/routes";
import { createNotificationRouter } from "./modules/notification/presentation/routes/notification.routes";
import { createNotificationController } from "./modules/notification/infrastructure/composition/constrollers";
import { errorHandler } from "./shared/middlewares/error-handler";
import { authRoutes } from "./modules/auth/infrastructure/composition";
import { createVerificationRoutes } from "./modules/kyc-verification/infrastructure/composition";
import { 
    categoryRoutes,
    serviceRoutes,
    providerServiceRoutes
} from "./modules/service-catalog/infrastructure/composition";
import {
    createUserRoutes,
    customerRoutes,
    providerRoutes,
    reactivationRoutes
} from "./modules/user-management/infrastructure/composition";
import { createBulkNotificationUseCase, createNotificationUseCase } from "./modules/notification/infrastructure/composition/useCases";
import { createServiceRequestRoutes } from "./modules/service-request/infrastructure/composition";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await connectRedis();
        logger.info("Redis connected");

        const app = createApp();
        const httpServer = createServer(app);

        const io = createSocketServer(httpServer, jwtService);

        const notificationUseCase = createNotificationUseCase(io)
        const bulkNotificationUseCase = createBulkNotificationUseCase(io)
        const notificationController = createNotificationController(io, notificationUseCase)
        const notificationRoutes = createNotificationRouter(notificationController)
        const userRoutes = createUserRoutes(notificationUseCase)
        const verificationRoutes = createVerificationRoutes(notificationUseCase)
        const serviceRequestRoutes = createServiceRequestRoutes(bulkNotificationUseCase, notificationUseCase)
        
        const rootRouter = createRootRouter({
            authRoutes,
            userRoutes,
            customerRoutes,
            providerServiceRoutes,
            verificationRoutes,
            providerRoutes,
            serviceRoutes,
            categoryRoutes,
            reactivationRoutes,
            notificationRoutes,
            serviceRequestRoutes
        })

        app.use("/api", rootRouter);
        app.use(errorHandler);

        httpServer.on("error", (error) => {
            logger.error({ err: error }, "HTTP server error");
        });

        httpServer.listen(PORT, () => {
            logger.info({ port: PORT }, "HTTP and WebSocket server started");
        });
    } catch (error) {
        logger.error({ err: error }, "Failed to start application");
        process.exit(1);
    }
};

startServer();
