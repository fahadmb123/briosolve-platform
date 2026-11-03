import { CalculateDistance } from "../../../../shared/presentation/http/utils/calculate-distance";
import { IProviderServiceRepository } from "../../../service-catalog/domain/repositories/IProviderServiceRepository";
import { Address } from "../../../user-management/domain/entities/address.entity";
import { User } from "../../../user-management/domain/entities/user.entity";
import { IProviderSelectionService, ProviderSelectionServiceInputType } from "../interfaces/services/IProviderSelectionService";


export class ProviderSelectionService implements IProviderSelectionService{
    constructor(
            private readonly _providerServiceRepository : IProviderServiceRepository
    ){}
    async getNearbyProviderIds(input:ProviderSelectionServiceInputType): Promise<string[] >{
        const nearbyProviderIds: string[] = [];

        for(const provider of input.providers){
            if (provider.id === input.customerId) continue
            if (provider.status !== "ACTIVE") continue
            if (provider.provider_profile?.kyc_status !== "APPROVED") continue
            if (!provider.email_verified || !provider.phone_verified) continue

            const providerAddress = provider.current_address_id as Address | null

            if (!providerAddress || providerAddress.latitude == null || providerAddress.longitude == null) continue

            const providerLat = Number(providerAddress.latitude)
            const providerLng = Number(providerAddress.longitude)

            const distance = CalculateDistance(input.customerLat, input.customerLng, providerLat, providerLng);
            const providerRadius = provider.provider_profile?.service_radius_km ?? 20

            const providerServices = await this._providerServiceRepository.getProviderServices(provider.provider_profile.id)

            const equalService = providerServices.filter((service)=>{
                return service.service_id === input.subServiceId
            })

            if (distance <= providerRadius && equalService) nearbyProviderIds.push(provider.id)
        }

        return nearbyProviderIds
    }
}