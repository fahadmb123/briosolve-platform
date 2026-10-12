import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";
import { upload } from "../../../../shared/infrastructure/utils/multer.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { uploadVerificationSchema } from "../schemas/uploadVerification.schema.js";
import { verificationController } from "../../infrastructure/composition/controller.js";

const router = Router();

router.get("/", authMiddleware, requireRole(["PROVIDER"]), verificationController.getProviderVerifications);
router.post("/", authMiddleware, requireRole(["PROVIDER"]), upload.array("files"), validate(uploadVerificationSchema), verificationController.uploadVerification);
router.patch("/:id", authMiddleware, requireRole(["PROVIDER"]), upload.array("files"), verificationController.updateVerification);
router.delete("/:id", authMiddleware, requireRole(["PROVIDER"]), verificationController.deleteVerification);

export default router;
