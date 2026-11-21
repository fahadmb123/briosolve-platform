import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { submitQuotationSchema } from "../schemas/submit-quotation.schema";
import { updateQuotationSchema } from "../schemas/update-quotation.schema";
import { QuotationRouteDependencies } from "../types/quotation.route.dependencies";

export function buildQuotationRoute(controller: QuotationRouteDependencies): Router {
    const router = Router()

    router.get("/my", authMiddleware, requireRole(["PROVIDER"]), controller.quotation.getMyQuotations);
    router.get("/request/:serviceRequestId", authMiddleware, requireRole(["CUSTOMER", "PROVIDER", "ADMIN"]), controller.quotation.getRequestQuotations)
    
    router.post("/", authMiddleware, requireRole(["PROVIDER"]), validate(submitQuotationSchema), controller.quotation.submitQuotation)
    router.patch("/:id/accept", authMiddleware, requireRole(["CUSTOMER"]), controller.quotation.acceptQuotation)
    router.patch("/:id/reject", authMiddleware, requireRole(["CUSTOMER"]), controller.quotation.rejectQuotation)
    router.put("/:id", authMiddleware, requireRole(["PROVIDER"]), validate(updateQuotationSchema), controller.quotation.updateQuotation)

    return router;
}
