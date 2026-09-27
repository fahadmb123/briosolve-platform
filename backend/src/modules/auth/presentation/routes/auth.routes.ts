import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { otpSchema } from "../validators/registerCustomer.schema.js";
import { otpVarificationController ,authController} from "../../../../app/container/container.js";
import { emailSchema, loginSchema, resetPasswordSchema } from "../validators/auth.schema.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";

const router = Router()





router.get("/otp-status",otpVarificationController.getStatus)
router.get("/me",authMiddleware,authController.getMe)
router.get("/logout",authController.logout)



router.post("/login",validate(loginSchema),authController.login)


router.post("/email-verify",validate(emailSchema),authController.emailVerify)
router.post("/reset-password",validate(resetPasswordSchema),authController.resetPassword)

router.post("/otp-varify",validate(otpSchema),otpVarificationController.validate)
router.post("/resend-otp",otpVarificationController.resend)



export default router;