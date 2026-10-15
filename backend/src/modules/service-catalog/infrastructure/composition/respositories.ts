import { CategoryRepository } from "../repositories/prismaCategory.repository";
import { ServiceRepository } from "../repositories/prismaService.repository";
import { ProviderServiceRepository } from "../repositories/prismaProviderService.repository";

export const categoryRepository = new CategoryRepository();
export const serviceRepository = new ServiceRepository();
export const providerServiceRepository = new ProviderServiceRepository();