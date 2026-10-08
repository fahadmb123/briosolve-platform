import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { customerController } from "../../infrastructure/composition/index.js";
import { customerRegistrationSchema, profileSchema } from "../../../auth/presentation/validators/registerCustomer.schema.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";


const router = Router()

import { upload } from "../../../../shared/infrastructure/utils/multer.js";
import { validateFile } from "../../../../shared/presentation/http/middlewares/validate-file.js";
import { imageFileSchema } from "../../../../shared/presentation/http/validators/imageFile.schema.js";

router.post("/register",validate(customerRegistrationSchema),customerController.register)

router.patch("/profile",validate(profileSchema),authMiddleware,requireRole(["CUSTOMER", "PROVIDER", "ADMIN"]),customerController.updateProfile)

router.post("/profile/image", authMiddleware, requireRole(["CUSTOMER", "PROVIDER", "ADMIN"]), upload.single("image"), validateFile(imageFileSchema),customerController.uploadProfileImage)

router.delete("/profile/image", authMiddleware, requireRole(["CUSTOMER", "PROVIDER", "ADMIN"]), customerController.deleteProfileImage)

export default router