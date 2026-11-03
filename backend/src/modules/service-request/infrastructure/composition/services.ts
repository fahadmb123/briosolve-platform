import { CloudinaryService } from "../../../../shared/infrastructure/services/cloudinary.service";
import { providerServiceRepository } from "../../../service-catalog/infrastructure/composition/respositories";
import { ProviderSelectionService } from "../../application/services/provider-selection.service";

export const imageUploadService = new CloudinaryService();
export const ImageService = imageUploadService;
export const providerSelectionService = new ProviderSelectionService(providerServiceRepository);
