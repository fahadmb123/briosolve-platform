import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./presentation/http/routes/index.js";
import { errorHandler } from "./presentation/http/middlewares/error-handler.js"; 

const app = express()

app.use(cors({origin:"http://localhost:5173"}))
app.use(express.json())
app.use(cookieParser())

app.use("/api", router)
app.use(errorHandler)



export default app