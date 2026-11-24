import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { createReviewSchema, replyReviewSchema, moderateReviewSchema } from "../validators/review.validator";
import { ReviewRouteDependencies } from "../types/review.route.dependencies";

export function buildReviewRoute(controller: ReviewRouteDependencies): Router {
  const router = Router();

  router.post("/", authMiddleware, requireRole(["CUSTOMER"]), validate(createReviewSchema), controller.review.createReview);
  router.get("/provider/:providerId", controller.review.getProviderReviews);
  router.get("/my", authMiddleware, controller.review.getMyReviews);
  router.post("/:id/reply", authMiddleware, requireRole(["PROVIDER"]), validate(replyReviewSchema), controller.review.replyToReview);
  router.get("/admin", authMiddleware, requireRole(["ADMIN"]), controller.review.getAdminReviews);
  router.patch("/:id/moderate", authMiddleware, requireRole(["ADMIN"]), validate(moderateReviewSchema), controller.review.moderateReview);
  router.patch("/:id/report", authMiddleware, controller.review.reportReview);

  return router;
}
