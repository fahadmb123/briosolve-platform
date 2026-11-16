import { IUseCase } from "../../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../../shared/errors/applicationError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderServiceRepository } from "../../../../service-catalog/domain/repositories/IProviderServiceRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import { CalculateDistance } from "../../../../../shared/utils/calculate-distance";
import { Address } from "../../../domain/entities/address.entity";
import { UserMapper } from "../../../infrastructure/mappers/user.mapper";
import { GetProviderPublicProfileDto } from "../../dtos/request/customer/get-provider-public-profile.dto";
import { GetProviderPublicProfileOutputDto } from "../../dtos/response/customer/get-provider-public-profile-output.dto";

export class GetProviderPublicProfileUseCase implements IUseCase<GetProviderPublicProfileDto, GetProviderPublicProfileOutputDto> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _providerServiceRepository: IProviderServiceRepository,
        private readonly _providerAvailabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: GetProviderPublicProfileDto): Promise<GetProviderPublicProfileOutputDto> {
        const user = await this._userRepository.findById(input.providerId);
        if (!user || user.role !== "PROVIDER") {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider not found", "NOT_FOUND");
        }

        const profile = await this._providerRepository.findById(user.id);
        if (!profile) {
            throw new ApplicationError("PROFILE_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const [servicesList, availabilityList] = await Promise.all([
            this._providerServiceRepository.getProviderServices(profile.id),
            this._providerAvailabilityRepository.findByProviderId(profile.id)
        ]);

        let calculatedDistance: number | null = null;
        if (input.customerId) {
            const customer = await this._userRepository.findById(input.customerId);
            const customerAddress = customer?.current_address_id as Address | null;
            const providerAddress = user.current_address_id as Address | null;

            if (
                customerAddress?.latitude != null &&
                customerAddress?.longitude != null &&
                providerAddress?.latitude != null &&
                providerAddress?.longitude != null
            ) {
                calculatedDistance = CalculateDistance(
                    Number(customerAddress.latitude),
                    Number(customerAddress.longitude),
                    Number(providerAddress.latitude),
                    Number(providerAddress.longitude)
                );
            }
        }

        const weekdayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
        const sortedAvailability = [...availabilityList].sort((a, b) => {
            return weekdayOrder.indexOf(a.day_of_week) - weekdayOrder.indexOf(b.day_of_week);
        });

        const userDto = UserMapper.toDto(user);

        return {
            ...userDto,
            provider_profile: profile || userDto.provider_profile,
            distance: calculatedDistance,
            services: servicesList,
            availability: sortedAvailability
        };
    }
}
