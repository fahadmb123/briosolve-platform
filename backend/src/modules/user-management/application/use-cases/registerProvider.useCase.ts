import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { User } from "../../domain/entities/user.entity.js";

export type CompleteProviderRegistrationInput = {
    registrationId: string;
    services: string[];
    experience: string;
    skills: string;
    bio: string;
};

export default class RegisterProviderUseCase implements IUseCase<CompleteProviderRegistrationInput, User> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(input: CompleteProviderRegistrationInput): Promise<User> {
        const pendingData = await this.pendingRegistrationStore.get(input.registrationId);
        
        if (!pendingData) {
            throw new ApplicationError("REGISTRATION_EXPIRED", "Registration session expired", "AUTHENTICATION");
        }

        if (pendingData.for !== "CREATE_PROVIDER") {
            throw new ApplicationError("INVALID_REGISTRATION", "Invalid registration type", "AUTHENTICATION");
        }

        // Create provider
        const user = await this.providerRepository.createProvider({
            name: pendingData.name,
            email: pendingData.email,
            password: pendingData.passwordHash!,
            businessName: pendingData.businessName!,
            experience: input.experience,
            skills: input.skills,
            bio: input.bio,
            services: input.services
        });

        // Delete pending registration after successful creation
        await this.pendingRegistrationStore.delete(input.registrationId);

        return user;
    }
}
