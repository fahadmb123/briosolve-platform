import dotenv from "dotenv";
dotenv.config();
import app from "./app/app";
import { connectRedis } from "./shared/infrastructure/cache/redis/redis.client";
import { logger } from "./shared/infrastructure/logger/logger";
import { createServer } from "node:http";
import { createSocketServer } from "./shared/infrastructure/realtime/server/socket-server";
import { jwtService } from "./modules/auth/infrastructure/composition/services";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();
    logger.info("Redis connected")

    const httpServer = createServer(app)

    createSocketServer(httpServer,jwtService)

    httpServer.on("error", (error) => {
      logger.error({ err: error }, "Server failed to start");
    })

    httpServer.listen(PORT, () => {
        logger.info({ port: PORT }, "HTTP and WebSocket server started");
    })
    
  } catch (error) {
    logger.error({ err: error }, "Failed to start application");
    process.exit(1);
  }
};

startServer();






