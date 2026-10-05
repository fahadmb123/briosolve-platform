import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes/auth.routes.js"
import userRoutes from "../modules/user-management/presentation/routes/user.routes.js"
import customerRoute from "../modules/user-management/presentation/routes/customer.routes.js"
const router = Router();




router.use("/auth",authRoutes)
router.use("/user",userRoutes)
router.use("/customer",customerRoute)



export default router;