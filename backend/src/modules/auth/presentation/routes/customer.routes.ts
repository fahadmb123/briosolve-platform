import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { customerRegistrationSchema, profileSchema } from "../validators/registerCustomer.schema.js";
import {  customerAuthController } from "../../container/container.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";


const router = Router();


router.post("/register",validate(customerRegistrationSchema),customerAuthController.register)







router.patch("/prfoile",validate(profileSchema),authMiddleware,customerAuthController.updateProfile)


export default router 