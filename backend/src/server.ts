import dotenv from "dotenv";
dotenv.config();
import app from "./app/app";
import { connectRedis } from "./shared/infrastructure/cache/redis/redis.client";
import { logger } from "./shared/infrastructure/logger/logger";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();
    logger.info("Redis connected");

    const server = app.listen(PORT, () => {
      logger.info({ port: PORT }, "Server started");
    });

    server.on("error", (error) => {
      logger.error({ err: error }, "Server failed to start");
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start application");
    process.exit(1);
  }
};

startServer();