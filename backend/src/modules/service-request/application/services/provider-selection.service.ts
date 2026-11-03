import { CalculateDistance } from "../../../../shared/presentation/http/utils/calculate-distance";
import { Address } from "../../../user-management/domain/entities/address.entity";
import { User } from "../../../user-management/domain/entities/user.entity";
import { IProviderSelectionService } from "../interfaces/services/IProviderSelectionService";


export class ProviderSelectionService implements IProviderSelectionService{
    getNearbyProviderIds(providers: User[],customerId: string,customerLat: number,customerLng: number): string[] {
        const nearbyProviderIds: string[] = [];

        for(const provider of providers){
            if (provider.id === customerId) continue
            if (provider.status !== "ACTIVE") continue
            if (provider.provider_profile?.kyc_status !== "APPROVED") continue

            const providerAddress = provider.current_address_id as Address | null

            if (!providerAddress || providerAddress.latitude == null || providerAddress.longitude == null) continue

            const providerLat = Number(providerAddress.latitude)
            const providerLng = Number(providerAddress.longitude)

            const distance = CalculateDistance(customerLat, customerLng, providerLat, providerLng);
            const providerRadius = provider.provider_profile?.service_radius_km ?? 20

            if (distance <= providerRadius) nearbyProviderIds.push(provider.id)
        }

        return nearbyProviderIds
    }
}