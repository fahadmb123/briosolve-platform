import dotenv from "dotenv";
dotenv.config();
import app from "./app/app";
import { connectRedis } from "./shared/infrastructure/cache/redis/redis.client";
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectRedis()
    console.log("Redis connected")

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })

    server.on("error", (error) => {
      console.error("Server failed to start:", error)
    })
  } catch (error) {
    console.error("Failed to start application:", error)
  }
}

startServer()