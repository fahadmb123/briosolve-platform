import { UserResponseDto } from "../user/user-dto";
import { ProviderService } from "../../../../../service-catalog/domain/entities/providerService.entity";
import { ProviderAvailability } from "../../../../domain/entities/providerAvailability.entity";

export interface GetProviderPublicProfileOutputDto extends Omit<UserResponseDto, "distance"> {
    distance?: number | null;
    services: ProviderService[];
    availability: ProviderAvailability[];
}
