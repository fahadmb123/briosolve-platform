import { User } from "../../../../user-management/domain/entities/user.entity";

export interface IProviderSelectionService {
    getNearbyProviderIds(providers: User[],customerId: string,customerLat: number,customerLng: number): string[]
}