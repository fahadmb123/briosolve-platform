import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { compareQuotationsSchema } from "../schemas/compare-quotations.validator";
import { AiRouteDependencies } from "../types/ai.route.dependencies";

export function buildAiRoute(deps: AiRouteDependencies): Router {
    const router = Router();

    router.post("/quotations/compare",authMiddleware,requireRole(["CUSTOMER"]),validate(compareQuotationsSchema),deps.ai.compareQuotations)

    return router;
}
