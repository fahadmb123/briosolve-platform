import type { Router as ExpressRouter } from "express";

export interface RootRouterDependencies {
    authRoutes: ExpressRouter;
    /*userRoutes: ExpressRouter;
    customerRoutes: ExpressRouter;
    categoryRoutes: ExpressRouter;
    serviceRoutes: ExpressRouter;
    providerRoutes: ExpressRouter;
    providerServiceRoutes: ExpressRouter;
    verificationRoutes: ExpressRouter;
    reactivationRoutes: ExpressRouter;*/
    notificationRoutes: ExpressRouter;
}