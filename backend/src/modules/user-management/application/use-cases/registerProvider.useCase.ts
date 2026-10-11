import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { User } from "../../domain/entities/user.entity.js";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository.js";

export type CompleteProviderRegistrationInput = {
    registrationId: string;
    services: string[];
    experience: string;
    bio: string;
};

export default class RegisterProviderUseCase implements IUseCase<CompleteProviderRegistrationInput, User> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly pendingRegistrationStore: IPendingRegistrationStore,
        private readonly providerAvailabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: CompleteProviderRegistrationInput): Promise<User> {
        const pendingData = await this.pendingRegistrationStore.get(input.registrationId);
        
        if (!pendingData)  throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION")

        if (pendingData.for !== "CREATE_PROVIDER") throw new ApplicationError("INVALID_REGISTRATION", "Invalid registration type", "AUTHENTICATION")

        const user = await this.providerRepository.createProvider({
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

        const profile = await this.providerRepository.findById(user.id)
        
        if (profile) await this.providerAvailabilityRepository.setAvailability(profile.id, availabilitySlots)

        await this.pendingRegistrationStore.delete(input.registrationId);

        return user;
    }
}
