import { Router } from "express";
import authRoutes from "../modules/auth/presentation/routes/auth.routes"
import userRoutes from "../modules/user-management/presentation/routes/user.routes"
import customerRoute from "../modules/user-management/presentation/routes/customer.routes"
import categoryRouter from "../modules/service-catalog/presentation/routes/category.routes"
import serviceRouter from "../modules/service-catalog/presentation/routes/service.routes"
import providerRoute from "../modules/user-management/presentation/routes/provider.routes"
import providerServiceRoute from "../modules/service-catalog/presentation/routes/providerService.routes"
import verificationRoutes from "../modules/kyc-verification/presentation/routes/verification.routes"
import reactivationRoutes from "../modules/user-management/presentation/routes/reactivation.routes"
import notificationRoutes from "../modules/notification/presentation/routes/notification.routes"

const router = Router();

router.use("/auth",authRoutes)
router.use("/user",userRoutes)
router.use("/customer",customerRoute)
router.use("/provider/service",providerServiceRoute)
router.use("/provider/verification",verificationRoutes)
router.use("/provider",providerRoute)
router.use("/verification",verificationRoutes)
router.use("/service",serviceRouter)
router.use("/category",categoryRouter)
router.use("/reactivation",reactivationRoutes)
router.use("/notification",notificationRoutes)

export default router;