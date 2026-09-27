import { Router } from "express";
import customerRoutes from "../modules/auth/presentation/routes/customer.routes.js";
import authRoutes from "../modules/auth/presentation/routes/auth.routes.js"
import userRoutes from "../modules/user-management/presentation/routes/user.routes.js"

const router = Router();

router.use("/customer", customerRoutes);
router.use("/auth",authRoutes)
router.use("/user",userRoutes)


export default router;