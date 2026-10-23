import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRespository";
import { GetNearbyProvidersDto } from "../../dtos/request/customer/get-nearby-providers.dto";
import { GetNearbyProvidersOutputDto } from "../../dtos/response/customer/get-nearby-providers-output.dto";
import { User } from "../../../domain/entities/user.entity";
import { Address } from "../../../domain/entities/address.entity";
import { UserMapper } from "../../../infrastructure/mappers/user.mapper";
import { UserResponseDto } from "../../dtos/response/user/user-dto";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

export class GetNearbyProvidersUseCase implements IUseCase<GetNearbyProvidersDto, GetNearbyProvidersOutputDto> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _customerRepository: ICustomerRepository
    ) {}

    async execute(input: GetNearbyProvidersDto): Promise<GetNearbyProvidersOutputDto> {
        const customer = await this._userRepository.findById(input.userId);
        if (!customer) {
            throw new ApplicationError("NOT_FOUND", "Customer not found", "NOT_FOUND");
        }

        const customerProfile = await this._customerRepository.findById(input.userId);
        const customerRadius = input.radius ?? customerProfile?.service_radius_km ?? 20;

        const customerAddress = customer.current_address_id as Address | null;
        if (!customerAddress || customerAddress.latitude == null || customerAddress.longitude == null) {
            return {
                users: [],
                total: 0,
                totalPages: 0,
                customerRadius,
                hasCustomerLocation: false
            };
        }

        const customerLat = Number(customerAddress.latitude);
        const customerLng = Number(customerAddress.longitude);

        const providers = await this._userRepository.getActiveProviders();

        const searchLower = input.search?.trim().toLowerCase();

        const matched: { provider: User; distance: number }[] = [];

        for (const provider of providers) {
            if (provider.id === customer.id) continue;
            if (provider.status !== "ACTIVE") continue;
            if (provider.provider_profile?.kyc_status !== "APPROVED") continue;

            const providerAddress = provider.current_address_id as Address | null;
            if (!providerAddress || providerAddress.latitude == null || providerAddress.longitude == null) {
                continue;
            }

            const providerLat = Number(providerAddress.latitude);
            const providerLng = Number(providerAddress.longitude);

            const distance = calculateDistance(customerLat, customerLng, providerLat, providerLng);
            const providerRadius = provider.provider_profile?.service_radius_km ?? 20;

            if (distance <= providerRadius && distance <= customerRadius) {
                if (searchLower) {
                    const nameMatch = provider.name.toLowerCase().includes(searchLower);
                    const businessMatch = provider.provider_profile?.business_name?.toLowerCase().includes(searchLower);
                    const bioMatch = provider.provider_profile?.bio?.toLowerCase().includes(searchLower);
                    if (!nameMatch && !businessMatch && !bioMatch) {
                        continue;
                    }
                }

                matched.push({ provider, distance });
            }
        }

        matched.sort((a, b) => a.distance - b.distance);

        const page = input.page && input.page > 0 ? input.page : 1;
        const limit = input.limit && input.limit > 0 ? input.limit : 12;
        const total = matched.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = matched.slice((page - 1) * limit, page * limit);

        const users: UserResponseDto[] = paginated.map(item => ({
            ...UserMapper.toDto(item.provider),
            distance: item.distance
        }));

        return {
            users,
            total,
            totalPages,
            customerRadius,
            hasCustomerLocation: true
        };
    }
}
