import { CategoryRepository } from "../repositories/prismaCategory.repository.js";
import { ServiceRepository } from "../repositories/prismaService.repository.js";
import { ProviderServiceRepository } from "../repositories/prismaProviderService.repository.js";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories.js";

export const categoryRepository = new CategoryRepository();
export const serviceRepository = new ServiceRepository();
export const providerServiceRepository = new ProviderServiceRepository(providerRepository);