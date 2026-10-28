import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { providerRegistrationSchema, providerProfileSchema } from "../../../auth/presentation/validators/registerProvider.schema";
import { completeProviderRegistrationSchema } from "../../../auth/presentation/validators/completeProviderRegistration.schema";
import { setProviderAvailabilitySchema, createAvailabilityOverrideSchema } from "../validators/availability";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { upload } from "../../../../shared/infrastructure/utils/multer";
import { validateFile } from "../../../../shared/presentation/http/middlewares/validate-file";
import { imageFileSchema } from "../../../../shared/presentation/http/validators/imageFile.schema";
import { ProviderRouteDependencies } from "../types/provider.route.dependencies";

export function buildProviderRoute(controller: ProviderRouteDependencies): Router {
    const router = Router();

    router.get("/availability", authMiddleware, requireRole(["PROVIDER"]), controller.provider.getAvailability);
    router.get("/availability/overrides", authMiddleware, requireRole(["PROVIDER"]), controller.provider.getAvailabilityOverrides);

    router.post("/pre-register", validate(providerRegistrationSchema), controller.provider.preRegister);
    router.post("/register", validate(completeProviderRegistrationSchema), controller.provider.register);
    router.post("/profile/image", authMiddleware, requireRole(["PROVIDER"]), upload.single("image"), validateFile(imageFileSchema), controller.provider.uploadProfileImage);
    router.post("/availability", validate(setProviderAvailabilitySchema), authMiddleware, requireRole(["PROVIDER"]), controller.provider.setAvailability);
    router.post("/availability/overrides", validate(createAvailabilityOverrideSchema), authMiddleware, requireRole(["PROVIDER"]), controller.provider.createAvailabilityOverride);
    router.post("/become-customer/send-otp", authMiddleware, requireRole(["PROVIDER"]), controller.provider.sendBecomeCustomerOtp);
    router.post("/become-customer", authMiddleware, requireRole(["PROVIDER"]), controller.provider.becomeCustomer);

    router.put("/availability", validate(setProviderAvailabilitySchema), authMiddleware, requireRole(["PROVIDER"]), controller.provider.setAvailability);
    router.patch("/profile", validate(providerProfileSchema), authMiddleware, requireRole(["PROVIDER"]), controller.provider.updateProfile);
    router.delete("/profile/image", authMiddleware, requireRole(["PROVIDER"]), controller.provider.deleteProfileImage);
    router.delete("/availability/overrides/:id", authMiddleware, requireRole(["PROVIDER"]), controller.provider.deleteAvailabilityOverride);

    return router;
}
