import { Router } from "express";
import validate from "../middlewares/validat-request";
import { customerRegistrationSchema } from "../validators/auth/registerCustomer.schema";

const router = Router();




// authentication parts
router.post("/register",validate(customerRegistrationSchema))






export default router;