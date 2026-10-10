import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { providerController } from "../../infrastructure/composition/index.js";
import { providerRegistrationSchema } from "../../../auth/presentation/validators/registerProvider.schema.js";
import { completeProviderRegistrationSchema } from "../../../auth/presentation/validators/completeProviderRegistration.schema.js";

const router = Router();

router.post("/pre-register", validate(providerRegistrationSchema), providerController.preRegister);
router.post("/register", validate(completeProviderRegistrationSchema), providerController.register);

export default router;
