import { Router } from "express";
import authRoutes from "./customer.routes";

const router = Router();

router.use("/auth", authRoutes);

export default router;