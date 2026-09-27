import { Router } from "express";
import customerRoutes from "../modules/auth/presentation/routes/customer.routes.js";
import authRoutes from "../modules/auth/presentation/routes/auth.routes.js"

const router = Router();

router.use("/customer", customerRoutes);
router.use("/auth",authRoutes)



export default router;