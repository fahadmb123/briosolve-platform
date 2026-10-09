import { Router } from "express";
import { upload } from "../../../../shared/infrastructure/utils/multer.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { createServiceSchema } from "../schemas/create-service.schema.js";
import { serviceController } from "../../infrastructure/composition/controller.js";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";

const router = Router();

router.get("/", authMiddleware, requireRole(["ADMIN", "PROVIDER", "CUSTOMER"]), serviceController.getServices)
router.post("/", authMiddleware, requireRole(["ADMIN"]), upload.single('image'), validate(createServiceSchema), serviceController.addService)
router.patch("/:id", authMiddleware, requireRole(["ADMIN"]), upload.single('image'), validate(createServiceSchema), serviceController.updateService)
router.delete("/:id", authMiddleware, requireRole(["ADMIN"]), serviceController.deleteService)

export default router;
