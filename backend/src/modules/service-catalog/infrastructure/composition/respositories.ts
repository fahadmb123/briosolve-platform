import { CategoryRepository } from "../repositories/prismaCategory.repository.js";
import { ServiceRepository } from "../repositories/prismaService.repository.js";

export const categoryRepository = new CategoryRepository();
export const serviceRepository = new ServiceRepository();