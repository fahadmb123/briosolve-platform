import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { customerRegistrationSchema, profileSchema } from "../../../auth/presentation/validators/registerCustomer.schema";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { upload } from "../../../../shared/infrastructure/utils/multer";
import { validateFile } from "../../../../shared/presentation/http/middlewares/validate-file";
import { imageFileSchema } from "../../../../shared/presentation/http/validators/imageFile.schema";
import { CustomerRouteDependencies } from "../types/customer.route.dependencies";

export function buildCustomerRoute(controller: CustomerRouteDependencies): Router {
    const router = Router();

    router.post("/register", validate(customerRegistrationSchema), controller.customer.register);
    router.post("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), upload.single("image"), validateFile(imageFileSchema), controller.customer.uploadProfileImage);
    router.post("/become-provider/send-otp", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.sendBecomeProviderOtp);
    router.post("/become-provider", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.becomeProvider);

    router.get("/nearby-providers", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.getNearbyProviders);
    router.patch("/profile", validate(profileSchema), authMiddleware, requireRole(["CUSTOMER"]), controller.customer.updateProfile);
    router.delete("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.deleteProfileImage);

    return router;
}