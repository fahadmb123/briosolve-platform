import { Router } from "express";
import validate from "../middlewares/validate-request.js";
import { customerRegistrationSchema } from "../validators/auth/registerCustomer.schema.js";
import { customerAuthController } from "../../../composition/customer/customer-auth.dependencies.js";


const router = Router();




// authentication parts
router.post("/register",validate(customerRegistrationSchema),customerAuthController.register)






export default router;