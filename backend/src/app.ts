import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./presentation/http/routes";

const app = express()

app.use(cors({origin:"http://localhost:5173"}))
app.use(express.json())
app.use(cookieParser())

app.use("/api", routes)

export default app;