import { CategoryController } from "../../presentation/controller/category.controller";
import { ServiceController } from "../../presentation/controller/service.controller";
import { ProviderServiceController } from "../../presentation/controller/providerService.controller";
import { ImageService } from "./services";
import { 
    addCategoryUseCase, 
    updateCategoryUseCase, 
    getCategoriesUseCase, 
    deleteCategoryUseCase,
    addServiceUseCase,
    updateServiceUseCase,
    getServicesUseCase,
    deleteServiceUseCase,
    getProviderServicesUseCase,
    addProviderServicesUseCase,
    deleteProviderServiceUseCase,
    deleteProviderCategoryUseCase
} from "./useCases";

export const categoryController = new CategoryController(addCategoryUseCase,ImageService,updateCategoryUseCase,getCategoriesUseCase,deleteCategoryUseCase);
export const serviceController = new ServiceController(addServiceUseCase,ImageService,updateServiceUseCase,getServicesUseCase,deleteServiceUseCase);
export const providerServiceController = new ProviderServiceController(getProviderServicesUseCase, addProviderServicesUseCase, deleteProviderServiceUseCase, deleteProviderCategoryUseCase);