import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes";
import { errorHandler } from "../shared/presentation/http/middlewares/error-handler"; 

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.use("/api", router)
app.use(errorHandler)



export default app