import { AddCategoryUseCase } from "../../application/use-cases/addCategory.useCase.js";
import { UpdateCategoryUseCase } from "../../application/use-cases/updateCategory.useCase.js";
import { categoryRepository } from "./respositories.js";
import { ImageService } from "./services.js";

export const addCategoryUseCase = new AddCategoryUseCase(categoryRepository)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository,ImageService)