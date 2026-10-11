import { AddCategoryUseCase } from "../../application/use-cases/addCategory.useCase.js";
import { UpdateCategoryUseCase } from "../../application/use-cases/updateCategory.useCase.js";
import { GetCategoriesUseCase } from "../../application/use-cases/getCategories.useCase.js";
import { DeleteCategoryUseCase } from "../../application/use-cases/deleteCategory.useCase.js";
import { AddServiceUseCase } from "../../application/use-cases/addService.useCase.js";
import { UpdateServiceUseCase } from "../../application/use-cases/updateService.useCase.js";
import { GetServicesUseCase } from "../../application/use-cases/getServices.useCase.js";
import { DeleteServiceUseCase } from "../../application/use-cases/deleteService.useCase.js";
import { GetProviderServicesUseCase } from "../../application/use-cases/getProviderServices.useCase.js";
import { AddProviderServicesUseCase } from "../../application/use-cases/addProviderServices.useCase.js";
import { DeleteProviderServiceUseCase } from "../../application/use-cases/deleteProviderService.useCase.js";
import { DeleteProviderCategoryUseCase } from "../../application/use-cases/deleteProviderCategory.useCase.js";
import { categoryRepository, serviceRepository, providerServiceRepository } from "./respositories.js";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories.js";

import { ImageService } from "./services.js";

export const addCategoryUseCase = new AddCategoryUseCase(categoryRepository)
export const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository,ImageService)
export const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository)
export const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository, ImageService)

export const addServiceUseCase = new AddServiceUseCase(serviceRepository)
export const updateServiceUseCase = new UpdateServiceUseCase(serviceRepository, ImageService)
export const getServicesUseCase = new GetServicesUseCase(serviceRepository)
export const deleteServiceUseCase = new DeleteServiceUseCase(serviceRepository, ImageService)

export const getProviderServicesUseCase = new GetProviderServicesUseCase(providerServiceRepository, providerRepository)
export const addProviderServicesUseCase = new AddProviderServicesUseCase(providerServiceRepository, providerRepository)
export const deleteProviderServiceUseCase = new DeleteProviderServiceUseCase(providerServiceRepository, providerRepository)
export const deleteProviderCategoryUseCase = new DeleteProviderCategoryUseCase(providerServiceRepository, providerRepository)