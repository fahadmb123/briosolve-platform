import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { customerController } from "../../container/container.js";
import { customerRegistrationSchema, profileSchema } from "../../../auth/presentation/validators/registerCustomer.schema.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";


const router = Router()


router.get("/customers",authMiddleware,customerController.getCustomers)

router.post("/register",validate(customerRegistrationSchema),customerController.register)

router.patch("/profile",validate(profileSchema),authMiddleware,customerController.updateProfile)



export default router