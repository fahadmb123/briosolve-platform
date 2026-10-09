import { AddCategoryUseCase } from "../../application/use-cases/addCategory.useCase.js";
import { categoryRepository } from "./respositories.js";

export const addCategoryUseCase = new AddCategoryUseCase(categoryRepository)