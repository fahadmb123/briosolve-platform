import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { customerController } from "../../infrastructure/composition/index.js";
import { customerRegistrationSchema, profileSchema } from "../../../auth/presentation/validators/registerCustomer.schema.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";
import { upload } from "../../../../shared/infrastructure/utils/multer.js";
import { validateFile } from "../../../../shared/presentation/http/middlewares/validate-file.js";
import { imageFileSchema } from "../../../../shared/presentation/http/validators/imageFile.schema.js";

const router = Router()

router.post("/register",validate(customerRegistrationSchema),customerController.register)
router.post("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), upload.single("image"), validateFile(imageFileSchema),customerController.uploadProfileImage)
router.patch("/profile",validate(profileSchema),authMiddleware,requireRole(["CUSTOMER"]),customerController.updateProfile)
router.delete("/profile/image", authMiddleware, requireRole(["CUSTOMER"]), customerController.deleteProfileImage)

export default router