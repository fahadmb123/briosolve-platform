import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { customerRegistrationSchema, profileSchema } from "../../../auth/presentation/validators/registerCustomer.schema";
import validate from "../../../../shared/middlewares/validate-request";
import { rateLimiter } from "../../../../shared/middlewares/rate-limiter";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { upload } from "../../../../shared/utils/multer";
import { validateFile } from "../../../../shared/middlewares/validate-file";
import { imageFileSchema } from "../../../../shared/validators/imageFile.schema";
import { CustomerRouteDependencies } from "../types/customer.route.dependencies";

export function buildCustomerRoute(controller: CustomerRouteDependencies): Router {
    const router = Router();

    router.post("/register", rateLimiter({ windowSeconds: 300, maxRequests: 5, prefix: "customer-reg" }), validate(customerRegistrationSchema), controller.customer.register);
    router.post("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), upload.single("image"), validateFile(imageFileSchema), controller.customer.uploadProfileImage);
    router.post("/become-provider/send-otp", authMiddleware, requireRole(["CUSTOMER"]), rateLimiter({ windowSeconds: 300, maxRequests: 3, prefix: "customer-otp" }), controller.customer.sendBecomeProviderOtp);
    router.post("/become-provider", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.becomeProvider);

    router.get("/nearby-providers", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.getNearbyProviders);
    router.patch("/profile", validate(profileSchema), authMiddleware, requireRole(["CUSTOMER"]), controller.customer.updateProfile);
    router.delete("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), controller.customer.deleteProfileImage);

    return router;
}
