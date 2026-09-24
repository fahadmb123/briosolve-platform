import { Router } from "express";
import authRoutes from "./customer.routes.js";

const router = Router();

router.use("/auth", authRoutes);

export default router;