import { Router } from "express";
import validate from "../middlewares/validat-request";
import { customerRegistrationSchema } from "../validators/auth/registerCustomer.schema";
import { customerAuthController } from "../../../composition/customer/customer-auth.dependencies";


const router = Router();




// authentication parts
router.post("/register",validate(customerRegistrationSchema),customerAuthController.register)






export default router;