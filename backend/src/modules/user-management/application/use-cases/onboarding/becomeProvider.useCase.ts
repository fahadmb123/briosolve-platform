import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRespository";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import type { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { BecomeProviderInput } from "../../dtos/request/onboading/become-provider.dto";



export class BecomeProviderUseCase implements IUseCase<BecomeProviderInput,void>{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _customerRepository: ICustomerRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _providerAvailabilityRepository: IProviderAvailabilityRepository,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore
    ) {}

    async execute(input: BecomeProviderInput): Promise<void> {
        const session = await this._pendingRegistrationStore.get(input.registrationId);
        if (!session || session.for !== "BECOME_PROVIDER" || !(session as any).isVerified) {
            throw new ApplicationError("UNAUTHORIZED", "Please verify your email before proceeding", "AUTHENTICATION");
        }
        const userId = (session as any).userId;
        const user = await this._userRepository.findById(userId);
        if (!user) throw new ApplicationError("NOT_FOUND", "User not found", "NOT_FOUND");
        if (user.role !== "CUSTOMER") {
            throw new ApplicationError("BAD_REQUEST", "Only customers can become providers", "CONFLICT");
        }
        await this._customerRepository.deleteByUserId(userId);
        await this._userRepository.update(userId, { role: "PROVIDER" });
        const providerProfile = await this._providerRepository.createProviderProfile({
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
        await this._providerAvailabilityRepository.setAvailability(providerProfile.id, availabilitySlots);
        await this._pendingRegistrationStore.delete(input.registrationId);
    }
}
