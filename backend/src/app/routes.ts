import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes/auth.routes.js"
import userRoutes from "../modules/user-management/presentation/routes/user.routes.js"
import customerRoute from "../modules/user-management/presentation/routes/customer.routes.js"
import categoryRouter from "../modules/service-catalog/presentation/routes/category.routes.js"
import serviceRouter from "../modules/service-catalog/presentation/routes/service.routes.js"

const router = Router();




router.use("/auth",authRoutes)
router.use("/user",userRoutes)
router.use("/customer",customerRoute)
router.use("/category",categoryRouter)
router.use("/service",serviceRouter)




export default router;