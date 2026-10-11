import { Router } from "express";
import { providerController } from "../../infrastructure/composition/controllers.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { providerRegistrationSchema, providerProfileSchema } from "../../../auth/presentation/validators/registerProvider.schema.js";
import { completeProviderRegistrationSchema } from "../../../auth/presentation/validators/completeProviderRegistration.schema.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";

const router = Router();

router.post("/pre-register", validate(providerRegistrationSchema), providerController.preRegister);
router.post("/register", validate(completeProviderRegistrationSchema), providerController.register);
router.patch("/profile", validate(providerProfileSchema), authMiddleware, requireRole(["PROVIDER"]), providerController.updateProfile);

export default router;
