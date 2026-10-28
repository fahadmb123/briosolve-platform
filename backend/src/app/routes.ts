import { Router} from "express";
import userRoutes from "../modules/user-management/presentation/routes/user.routes";
import customerRoute from "../modules/user-management/presentation/routes/customer.routes";
import providerRoute from "../modules/user-management/presentation/routes/provider.routes";
import reactivationRoutes from "../modules/user-management/presentation/routes/reactivation.routes";
import { RootRouterDependencies } from "./types/root-router-dependencies";

export function createRootRouter(root:RootRouterDependencies) {
    
    const router = Router()

    router.use("/auth", root.authRoutes);
    router.use("/user", userRoutes);
    router.use("/customer", customerRoute);
    router.use("/provider/service", root.providerServiceRoutes);
    router.use("/provider/verification", root.verificationRoutes);
    router.use("/provider", providerRoute);
    router.use("/verification", root.verificationRoutes);
    router.use("/service", root.serviceRoutes);
    router.use("/category", root.categoryRoutes);
    router.use("/reactivation", reactivationRoutes);
    router.use("/notification", root.notificationRoutes);

    return router;
}
