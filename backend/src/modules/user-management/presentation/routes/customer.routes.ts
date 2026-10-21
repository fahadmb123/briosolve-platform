import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { customerController } from "../../infrastructure/composition/index";
import { customerRegistrationSchema, profileSchema } from "../../../auth/presentation/validators/registerCustomer.schema";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { upload } from "../../../../shared/infrastructure/utils/multer";
import { validateFile } from "../../../../shared/presentation/http/middlewares/validate-file";
import { imageFileSchema } from "../../../../shared/presentation/http/validators/imageFile.schema";

const router = Router()

router.post("/register",validate(customerRegistrationSchema),customerController.register)
router.post("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), upload.single("image"), validateFile(imageFileSchema),customerController.uploadProfileImage)
router.post("/become-provider/send-otp", authMiddleware, requireRole(["CUSTOMER"]), customerController.sendBecomeProviderOtp)
router.post("/become-provider", authMiddleware, requireRole(["CUSTOMER"]), customerController.becomeProvider)

router.get("/nearby-providers", authMiddleware, requireRole(["CUSTOMER"]), customerController.getNearbyProviders)
router.patch("/profile",validate(profileSchema),authMiddleware,requireRole(["CUSTOMER"]),customerController.updateProfile)
router.delete("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), customerController.deleteProfileImage)

export default router