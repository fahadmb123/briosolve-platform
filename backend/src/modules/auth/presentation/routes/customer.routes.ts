import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { customerRegistrationSchema } from "../validators/registerCustomer.schema.js";
import { customerAuthController } from "../../container/container.js";


const router = Router();




router.post("/register",validate(customerRegistrationSchema),customerAuthController.register)






export default router;