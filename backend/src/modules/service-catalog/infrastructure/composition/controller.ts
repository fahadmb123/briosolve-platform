import { CategoryController } from "../../presentation/controller/category.controller.js";
import { ServiceController } from "../../presentation/controller/service.controller.js";
import { ImageService } from "./services.js";
import { 
    addCategoryUseCase, 
    updateCategoryUseCase, 
    getCategoriesUseCase, 
    deleteCategoryUseCase,
    addServiceUseCase,
    updateServiceUseCase,
    getServicesUseCase,
    deleteServiceUseCase
} from "./useCases.js";

export const categoryController = new CategoryController(addCategoryUseCase,ImageService,updateCategoryUseCase,getCategoriesUseCase,deleteCategoryUseCase);
export const serviceController = new ServiceController(addServiceUseCase,ImageService,updateServiceUseCase,getServicesUseCase,deleteServiceUseCase);