import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { upload } from "../../../../shared/infrastructure/utils/multer";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { createCategorySchema } from "../schemas/create-category.schema";
import { categoryController } from "../../infrastructure/composition/controller";

const router = Router()

router.get("/",categoryController.getCategories)
router.post("/",authMiddleware,requireRole(["ADMIN"]),upload.single("image"),validate(createCategorySchema),categoryController.addCategory)
router.patch("/:id",authMiddleware,requireRole(["ADMIN"]),upload.single("image"),validate(createCategorySchema),categoryController.updateCategory)
router.delete("/:id",authMiddleware,requireRole(["ADMIN"]),categoryController.deleteCategory)

export default router;