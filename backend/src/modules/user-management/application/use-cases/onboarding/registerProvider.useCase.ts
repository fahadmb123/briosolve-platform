import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import { UserMapper } from "../../../infrastructure/mappers/user.mapper";
import { UserResponseDto } from "../../dtos/response/user/user-dto";
import { CompleteProviderRegistrationInput } from "../../dtos/request/provider/complete-provider-registration.dto";

export default class RegisterProviderUseCase implements IUseCase<CompleteProviderRegistrationInput, UserResponseDto> {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _providerAvailabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: CompleteProviderRegistrationInput): Promise<UserResponseDto> {
        const pendingData = await this._pendingRegistrationStore.get(input.registrationId);
        
        if (!pendingData)  throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION")

        if (pendingData.for !== "CREATE_PROVIDER") throw new ApplicationError("INVALID_REGISTRATION", "Invalid registration type", "AUTHENTICATION")

        const user = await this._providerRepository.createProvider({
            name: pendingData.name,
            email: pendingData.email,
            password: pendingData.passwordHash!,
            businessName: pendingData.businessName!,
            experience: input.experience,
            bio: input.bio,
            services: input.services
        })

        const availabilitySlots = [
            { day_of_week: 'MONDAY' as const, start_time: '09:00', end_time: '17:00' },
            { day_of_week: 'TUESDAY' as const, start_time: '09:00', end_time: '17:00' },
            { day_of_week: 'WEDNESDAY' as const, start_time: '09:00', end_time: '17:00' },
            { day_of_week: 'THURSDAY' as const, start_time: '09:00', end_time: '17:00' },
            { day_of_week: 'FRIDAY' as const, start_time: '09:00', end_time: '17:00' },
            { day_of_week: 'SATURDAY' as const, start_time: '09:00', end_time: '17:00' }
        ];

        const profile = await this._providerRepository.findById(user.id)
        
        if (profile) await this._providerAvailabilityRepository.setAvailability(profile.id, availabilitySlots)

        await this._pendingRegistrationStore.delete(input.registrationId);

        return UserMapper.toDto(user)
    }
}
