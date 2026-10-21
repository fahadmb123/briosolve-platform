import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRespository";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import type { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { BecomeCustomerInputDto } from "../../dtos/request/onboading/become-customer.dto";
import { IProviderServiceRepository } from "../../../../service-catalog/domain/repositories/IProviderServiceRepository";
import { IVerificationDocumentRepository } from "../../../../kyc-verification/domain/repositories/IVerificationDocumentRepository";
import { IVerificationFileRepository } from "../../../../kyc-verification/domain/repositories/IVerificationFileRepository";



export class BecomeCustomerUseCase implements IUseCase<BecomeCustomerInputDto,void>{
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly customerRepository: ICustomerRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly providerAvailabilityRepository: IProviderAvailabilityRepository,
        private readonly pendingRegistrationStore: IPendingRegistrationStore,
        private readonly providerServiceRepository: IProviderServiceRepository,
        private readonly providerVerificationDocumentsRepository: IVerificationDocumentRepository,
        private readonly providerVerificationFilesRepository: IVerificationFileRepository
    ) {}

    async execute(input: BecomeCustomerInputDto): Promise<void> {
        const session = await this.pendingRegistrationStore.get(input.registrationId);

        if (!session || session.for !== "BECOME_CUSTOMER" || !(session as any).isVerified) throw new ApplicationError("UNAUTHORIZED", "Please verify your email before proceeding", "AUTHENTICATION")

        const userId = (session as any).userId;

        const user = await this.userRepository.findById(userId);
        
        const providerProfile = await this.providerRepository.findProfileByUserId(userId)

        if (!user) throw new ApplicationError("NOT_FOUND", "User not found", "NOT_FOUND");

        if (!providerProfile) throw new ApplicationError("NOT_FOUND", "Profile not found", "NOT_FOUND")

        if (user.role !== "PROVIDER") throw new ApplicationError("BAD_REQUEST", "Only providers can become customers", "CONFLICT")

        const documents = await this.providerVerificationDocumentsRepository.findByProviderId(providerProfile.id);

        if (documents.length !== 0) {
            for (let doc of documents) {
                await this.providerVerificationFilesRepository.deleteByDocumentId(doc.id);
            }
        }

        await this.providerVerificationDocumentsRepository.deleteByProviderId(providerProfile.id);

        await this.providerAvailabilityRepository.deleteOverrideByProviderId(providerProfile.id);

        await this.providerAvailabilityRepository.deleteByProviderId(providerProfile.id);

        await this.providerServiceRepository.deleteByProviderId(providerProfile.id);

        await this.providerRepository.deleteByUserId(userId);

        await this.userRepository.update(userId, { role: "CUSTOMER" });

        await this.customerRepository.createCustomerProfile(userId);
        
        await this.pendingRegistrationStore.delete(input.registrationId);
    }
}
