import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { upload } from "../../../../shared/utils/multer";
import validate from "../../../../shared/middlewares/validate-request";
import { createCategorySchema } from "../schemas/create-category.schema";
import { CategoryRouteDependencies } from "../types/category.route.dependencies";

export function buildCategoryRoute(controller:CategoryRouteDependencies):Router{
    const router = Router()

    router.get("/",controller.category.getCategories)
    router.post("/",authMiddleware,requireRole(["ADMIN"]),upload.single("image"),validate(createCategorySchema),controller.category.addCategory)
    router.patch("/:id",authMiddleware,requireRole(["ADMIN"]),upload.single("image"),validate(createCategorySchema),controller.category.updateCategory)
    router.delete("/:id",authMiddleware,requireRole(["ADMIN"]),controller.category.deleteCategory)

    return router
}