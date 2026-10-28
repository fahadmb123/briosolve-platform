import { Router } from "express";
import { RootRouterDependencies } from "./types/root-router-dependencies";

export function createRootRouter(route: RootRouterDependencies) {
    const router = Router();

    router.use("/auth", route.authRoutes);
    router.use("/user", route.userRoutes);
    router.use("/customer", route.customerRoutes);
    router.use("/provider/service", route.providerServiceRoutes);
    router.use("/provider/verification", route.verificationRoutes);
    router.use("/provider", route.providerRoutes);
    router.use("/verification", route.verificationRoutes);
    router.use("/service", route.serviceRoutes);
    router.use("/category", route.categoryRoutes);
    router.use("/reactivation", route.reactivationRoutes);
    router.use("/notification", route.notificationRoutes);

    return router;
}
