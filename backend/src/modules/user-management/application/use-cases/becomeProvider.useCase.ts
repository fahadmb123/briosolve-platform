import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository.js";
import type { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";

export type BecomeProviderInput = {
    registrationId: string;
    businessName: string;
    experience: string;
    bio: string;
    services: string[];
};

export class BecomeProviderUseCase implements IUseCase<BecomeProviderInput,void>{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly customerRepository: ICustomerRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly providerAvailabilityRepository: IProviderAvailabilityRepository,
        private readonly pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(input: BecomeProviderInput): Promise<void> {
        const session = await this.pendingRegistrationStore.get(input.registrationId);
        if (!session || session.for !== "BECOME_PROVIDER" || !(session as any).isVerified) {
            throw new ApplicationError("UNAUTHORIZED", "Please verify your email before proceeding", "AUTHENTICATION");
        }
        const userId = (session as any).userId;
        const user = await this.userRepository.findById(userId);
        if (!user) throw new ApplicationError("NOT_FOUND", "User not found", "NOT_FOUND");
        if (user.role !== "CUSTOMER") {
            throw new ApplicationError("BAD_REQUEST", "Only customers can become providers", "CONFLICT");
        }
        await this.customerRepository.deleteByUserId(userId);
        await this.userRepository.update(userId, { role: "PROVIDER" });
        const providerProfile = await this.providerRepository.createProviderProfile({
            userId,
            businessName: input.businessName,
            experience: input.experience,
            bio: input.bio,
            services: input.services
        });
        const availabilitySlots = [
            { day_of_week: "MONDAY" as const, start_time: "09:00", end_time: "17:00" },
            { day_of_week: "TUESDAY" as const, start_time: "09:00", end_time: "17:00" },
            { day_of_week: "WEDNESDAY" as const, start_time: "09:00", end_time: "17:00" },
            { day_of_week: "THURSDAY" as const, start_time: "09:00", end_time: "17:00" },
            { day_of_week: "FRIDAY" as const, start_time: "09:00", end_time: "17:00" },
            { day_of_week: "SATURDAY" as const, start_time: "09:00", end_time: "17:00" }
        ];
        await this.providerAvailabilityRepository.setAvailability(providerProfile.id, availabilitySlots);
        await this.pendingRegistrationStore.delete(input.registrationId);
    }
}
