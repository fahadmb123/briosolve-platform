import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { customerRegistrationSchema, profileSchema } from "../validators/registerCustomer.schema.js";
import { authController, customerAuthController } from "../../container/container.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { emailSchema, updatePasswordSchema } from "../validators/auth.schema.js";

const router = Router();


router.post("/register",validate(customerRegistrationSchema),customerAuthController.register)

router.post("/update-profile",validate(profileSchema),authMiddleware,customerAuthController.updateProfile)

router.post("/email-verify",validate(emailSchema),authMiddleware,authController.emailVerify)

router.post("/update-password",validate(updatePasswordSchema),authMiddleware,customerAuthController.updatePassword)

export default router