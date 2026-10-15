import { Router } from "express";
import { providerController } from "../../infrastructure/composition/controllers";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { providerRegistrationSchema, providerProfileSchema } from "../../../auth/presentation/validators/registerProvider.schema";
import { completeProviderRegistrationSchema } from "../../../auth/presentation/validators/completeProviderRegistration.schema";
import { setProviderAvailabilitySchema, createAvailabilityOverrideSchema } from "../validators/availability";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { upload } from "../../../../shared/infrastructure/utils/multer";
import { validateFile } from "../../../../shared/presentation/http/middlewares/validate-file";
import { imageFileSchema } from "../../../../shared/presentation/http/validators/imageFile.schema";

const router = Router();

router.get("/availability", authMiddleware, requireRole(["PROVIDER"]), providerController.getAvailability)
router.get("/availability/overrides", authMiddleware, requireRole(["PROVIDER"]), providerController.getAvailabilityOverrides)

router.post("/pre-register", validate(providerRegistrationSchema), providerController.preRegister)
router.post("/register", validate(completeProviderRegistrationSchema), providerController.register)
router.post("/profile/image", authMiddleware, requireRole(["PROVIDER"]), upload.single("image"), validateFile(imageFileSchema), providerController.uploadProfileImage)
router.post("/availability", validate(setProviderAvailabilitySchema), authMiddleware, requireRole(["PROVIDER"]), providerController.setAvailability)
router.post("/availability/overrides", validate(createAvailabilityOverrideSchema), authMiddleware, requireRole(["PROVIDER"]), providerController.createAvailabilityOverride)

router.put("/availability", validate(setProviderAvailabilitySchema), authMiddleware, requireRole(["PROVIDER"]), providerController.setAvailability)
router.patch("/profile", validate(providerProfileSchema), authMiddleware, requireRole(["PROVIDER"]), providerController.updateProfile)
router.delete("/profile/image", authMiddleware, requireRole(["PROVIDER"]), providerController.deleteProfileImage)

router.delete("/availability/overrides/:id", authMiddleware, requireRole(["PROVIDER"]), providerController.deleteAvailabilityOverride)

export default router;
