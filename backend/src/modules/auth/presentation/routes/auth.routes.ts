import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { otpSchema } from "../validators/registerCustomer.schema.js";
import { otpVarificationController ,authController, securityController} from "../../container/container.js";
import { emailSchema, loginSchema, resetPasswordSchema, phoneSchema, updatePasswordSchema } from "../validators/auth.schema.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";



const router = Router()


router.get("/me",authMiddleware,authController.getMe)
router.get("/logout",authController.logout)
router.get("/otp-status",otpVarificationController.getStatus)

router.post("/login",validate(loginSchema),authController.login)
router.post("/email-verify",validate(emailSchema),authController.emailVerify)
router.post("/reset-password",validate(resetPasswordSchema),securityController.resetPassword)
router.post("/otp-varify",validate(otpSchema),otpVarificationController.validate)
router.post("/resend-otp",otpVarificationController.resend)

router.patch("/phone",authMiddleware,validate(phoneSchema),securityController.updatePhone)
router.patch("/email",authMiddleware,validate(emailSchema),authController.emailVerify)
router.patch("/password",validate(updatePasswordSchema),authMiddleware,securityController.updatePassword)




export default router