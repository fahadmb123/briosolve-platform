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
        private readonly _userRepository: IUserRepository,
        private readonly _customerRepository: ICustomerRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _providerAvailabilityRepository: IProviderAvailabilityRepository,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _providerServiceRepository: IProviderServiceRepository,
        private readonly _providerVerificationDocumentsRepository: IVerificationDocumentRepository,
        private readonly _providerVerificationFilesRepository: IVerificationFileRepository
    ) {}

    async execute(input: BecomeCustomerInputDto): Promise<void> {
        const session = await this._pendingRegistrationStore.get(input.registrationId);

        if (!session || session.for !== "BECOME_CUSTOMER" || !(session as any).isVerified) throw new ApplicationError("UNAUTHORIZED", "Please verify your email before proceeding", "AUTHENTICATION")

        const userId = (session as any).userId;

        const user = await this._userRepository.findById(userId);
        
        const providerProfile = await this._providerRepository.findProfileByUserId(userId)

        if (!user) throw new ApplicationError("NOT_FOUND", "User not found", "NOT_FOUND");

        if (!providerProfile) throw new ApplicationError("NOT_FOUND", "Profile not found", "NOT_FOUND")

        if (user.role !== "PROVIDER") throw new ApplicationError("BAD_REQUEST", "Only providers can become customers", "CONFLICT")

        const documents = await this._providerVerificationDocumentsRepository.findByProviderId(providerProfile.id);

        if (documents.length !== 0) {
            for (let doc of documents) {
                await this._providerVerificationFilesRepository.deleteByDocumentId(doc.id);
            }
        }

        await this._providerVerificationDocumentsRepository.deleteByProviderId(providerProfile.id);

        await this._providerAvailabilityRepository.deleteOverrideByProviderId(providerProfile.id);

        await this._providerAvailabilityRepository.deleteByProviderId(providerProfile.id);

        await this._providerServiceRepository.deleteByProviderId(providerProfile.id);

        await this._providerRepository.deleteByUserId(userId);

        await this._userRepository.update(userId, { role: "CUSTOMER" });

        await this._customerRepository.createCustomerProfile(userId);
        
        await this._pendingRegistrationStore.delete(input.registrationId);
    }
}
