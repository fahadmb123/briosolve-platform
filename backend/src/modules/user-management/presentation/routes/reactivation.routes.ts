import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";
import { reactivationController } from "../../infrastructure/composition/index.js";

const router = Router();

router.get("/", authMiddleware, requireRole(["ADMIN"]), reactivationController.getReactivations);
router.post("/send-otp", reactivationController.sendOtp);
router.post("/request", reactivationController.requestReactivation);

export default router;
