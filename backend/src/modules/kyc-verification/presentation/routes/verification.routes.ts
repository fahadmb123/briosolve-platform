import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { upload } from "../../../../shared/infrastructure/utils/multer";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { uploadVerificationSchema } from "../schemas/uploadVerification.schema";
import { verificationController } from "../../infrastructure/composition/controller";

const router = Router();

router.get("/admin", authMiddleware, requireRole(["ADMIN"]), verificationController.getAdminVerifications);
router.patch("/admin/:id/status", authMiddleware, requireRole(["ADMIN"]), verificationController.updateKycStatus);

router.get("/", authMiddleware, requireRole(["PROVIDER"]), verificationController.getProviderVerifications);
router.post("/", authMiddleware, requireRole(["PROVIDER"]), upload.array("files"), validate(uploadVerificationSchema), verificationController.uploadVerification);
router.patch("/:id", authMiddleware, requireRole(["PROVIDER"]), upload.array("files"), verificationController.updateVerification);
router.delete("/:id", authMiddleware, requireRole(["PROVIDER"]), verificationController.deleteVerification);

export default router;
