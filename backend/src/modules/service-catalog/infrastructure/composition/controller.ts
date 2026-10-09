import { CategoryController } from "../../presentation/controller/category.controller.js";
import { ImageService } from "./services.js";
import { addCategoryUseCase, updateCategoryUseCase } from "./useCases.js";


export const categoryController = new CategoryController(addCategoryUseCase,ImageService,updateCategoryUseCase)