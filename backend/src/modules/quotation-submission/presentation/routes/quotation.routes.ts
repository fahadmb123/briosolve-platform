import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { submitQuotationSchema } from "../schemas/submit-quotation.schema";
import { QuotationRouteDependencies } from "../types/quotation.route.dependencies";

export function buildQuotationRoute(controller: QuotationRouteDependencies): Router {
    const router = Router()

    router.post("/",authMiddleware,requireRole(["PROVIDER"]),validate(submitQuotationSchema),controller.quotation.submitQuotation)

    return router
}
