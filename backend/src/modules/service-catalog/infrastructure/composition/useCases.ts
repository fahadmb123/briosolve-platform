import { AddCategoryUseCase } from "../../application/use-cases/addCategory.useCase";
import { UpdateCategoryUseCase } from "../../application/use-cases/updateCategory.useCase";
import { GetCategoriesUseCase } from "../../application/use-cases/getCategories.useCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/deleteCategory.useCase";
import { AddServiceUseCase } from "../../application/use-cases/addService.useCase";
import { UpdateServiceUseCase } from "../../application/use-cases/updateService.useCase";
import { GetServicesUseCase } from "../../application/use-cases/getServices.useCase";
import { DeleteServiceUseCase } from "../../application/use-cases/deleteService.useCase";
import { GetProviderServicesUseCase } from "../../application/use-cases/getProviderServices.useCase";
import { AddProviderServicesUseCase } from "../../application/use-cases/addProviderServices.useCase";
import { DeleteProviderServiceUseCase } from "../../application/use-cases/deleteProviderService.useCase";
import { DeleteProviderCategoryUseCase } from "../../application/use-cases/deleteProviderCategory.useCase";
import { categoryRepository, serviceRepository, providerServiceRepository } from "./respositories";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories";

import { ImageService } from "./services";

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