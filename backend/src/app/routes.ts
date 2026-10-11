import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes/auth.routes.js"
import userRoutes from "../modules/user-management/presentation/routes/user.routes.js"
import customerRoute from "../modules/user-management/presentation/routes/customer.routes.js"
import categoryRouter from "../modules/service-catalog/presentation/routes/category.routes.js"
import serviceRouter from "../modules/service-catalog/presentation/routes/service.routes.js"
import providerRoute from "../modules/user-management/presentation/routes/provider.routes.js"
import providerServiceRoute from "../modules/service-catalog/presentation/routes/providerService.routes.js"

const router = Router();

router.use("/auth",authRoutes)
router.use("/user",userRoutes)
router.use("/customer",customerRoute)
router.use("/provider/service",providerServiceRoute)
router.use("/provider",providerRoute)
router.use("/service",serviceRouter)
router.use("/category",categoryRouter)

export default router;