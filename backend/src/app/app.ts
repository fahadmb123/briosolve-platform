import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import { envConfig } from "../shared/infrastructure/config/env.config";
import { errorHandler } from "../shared/presentation/http/middlewares/error-handler";
import helmet from "helmet";

const app = express()

app.use(helmet())
app.use(cors({
  origin: envConfig.CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.use("/api", router)
app.use(errorHandler)



export default app