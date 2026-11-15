import { S3Service } from "../../../../shared/services/s3.service";
import { providerServiceRepository } from "../../../service-catalog/infrastructure/composition/respositories";
import { ProviderSelectionService } from "../../application/services/provider-selection.service";

export const imageUploadService = new S3Service();
export const ImageService = imageUploadService;
export const providerSelectionService = new ProviderSelectionService(providerServiceRepository);
