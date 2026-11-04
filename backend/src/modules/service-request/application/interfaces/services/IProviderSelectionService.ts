import { User } from "../../../../user-management/domain/entities/user.entity";


export interface ProviderSelectionServiceInputType {
    providers: User[],
    customerId: string,
    customerLat: number,
    customerLng: number,
    subServiceId:string
}

export interface IProviderSelectionService {
    getNearbyProviderIds(input:ProviderSelectionServiceInputType): Promise<string[]>
}