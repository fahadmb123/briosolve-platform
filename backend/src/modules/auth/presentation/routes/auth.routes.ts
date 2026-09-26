import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { otpSchema } from "../validators/registerCustomer.schema.js";
import { otpVarificationController ,authController} from "../../../../app/container.js";
import { loginSchema } from "../validators/auth.schema.js";

const router = Router()





router.get("/otp-status",otpVarificationController.getStatus)


router.post("/login",validate(loginSchema),authController.login)

router.post("/otp-varify",validate(otpSchema),otpVarificationController.validate)
router.post("/resend-otp",otpVarificationController.resend)



export default router;