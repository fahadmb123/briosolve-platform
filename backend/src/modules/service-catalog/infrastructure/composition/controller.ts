import { CategoryController } from "../../presentation/controller/category.controller.js";
import { ImageService } from "./services.js";
import { addCategoryUseCase, updateCategoryUseCase, getCategoriesUseCase, deleteCategoryUseCase } from "./useCases.js";

export const categoryController = new CategoryController(addCategoryUseCase,ImageService,updateCategoryUseCase,getCategoriesUseCase,deleteCategoryUseCase)