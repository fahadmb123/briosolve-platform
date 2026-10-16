import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { otpSchema } from "../validators/registerCustomer.schema";
import { otpVarificationController, authController, securityController } from "../../infrastructure/composition/index";
import { emailSchema, loginSchema, resetPasswordSchema, phoneSchema, updatePasswordSchema } from "../validators/auth.schema";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";

const router = Router();

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/logout", authController.logout);
router.get("/otp-status", otpVarificationController.getStatus);
router.get("/me", authMiddleware, requireRole(["CUSTOMER", "PROVIDER", "ADMIN"]), authController.getMe);

router.post("/login", validate(loginSchema), authController.login);
router.post("/email-verify", validate(emailSchema), authController.emailVerify);
router.post("/reset-password", validate(resetPasswordSchema), securityController.resetPassword);
router.post("/otp-varify", validate(otpSchema), otpVarificationController.validate);
router.post("/resend-otp", otpVarificationController.resend);

router.patch("/email", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(emailSchema), authController.emailVerify);
router.patch("/password", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(updatePasswordSchema), authMiddleware, securityController.updatePassword);
router.patch("/phone", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(phoneSchema), securityController.updatePhone);

router.delete("/phone", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), securityController.deletePhone);

export default router;