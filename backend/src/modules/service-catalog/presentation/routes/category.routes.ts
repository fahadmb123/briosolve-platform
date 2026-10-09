import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";
import { upload } from "../../../../shared/infrastructure/utils/multer.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { createCategorySchema } from "../schemas/create-category.schema.js";
import { categoryController } from "../../infrastructure/composition/controller.js";

const router = Router()



router.get("/category",authMiddleware,requireRole(["ADMIN","PROVIDER","CUSTOMER"]),categoryController.addCategory)

router.post("/category",authMiddleware,requireRole(["ADMIN"]),upload.single("image"),validate(createCategorySchema),categoryController.addCategory)

router.patch("/category/:id",authMiddleware,requireRole(["ADMIN"]),upload.single("image"),validate(createCategorySchema),categoryController.updateCategory)




export default router;