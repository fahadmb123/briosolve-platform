import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { otpSchema } from "../validators/registerCustomer.schema.js";
import { otpVarificationController } from "../../../../app/container.js";

const router = Router()

router.get("/otp-status",otpVarificationController.getStatus)


router.post("/otp-varify",validate(otpSchema),otpVarificationController.validate)






export default router;