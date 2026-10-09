import { AddCategoryUseCase } from "../../application/use-cases/addCategory.useCase.js";
import { UpdateCategoryUseCase } from "../../application/use-cases/updateCategory.useCase.js";
import { GetCategoriesUseCase } from "../../application/use-cases/getCategories.useCase.js";
import { DeleteCategoryUseCase } from "../../application/use-cases/deleteCategory.useCase.js";
import { categoryRepository } from "./respositories.js";
import { ImageService } from "./services.js";

export const addCategoryUseCase = new AddCategoryUseCase(categoryRepository)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository,ImageService)
export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository)
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository)