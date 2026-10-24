import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import {
    IVerificationDocumentRepository
} from "../../domain/repositories/IVerificationDocumentRepository";
import { VerificationProfileMapper } from "../../infrastructure/mappers/verificationProfile.mapper";
import { GetAdminKycRequestsInput } from "../dtos/admin/request/get-admin-kyc.dto";
import { AdminKycStats, GetAdminKycResponse } from "../dtos/admin/response/get-admin-kyc.dto";

export class GetAdminVerificationsUseCase implements IUseCase<GetAdminKycRequestsInput, GetAdminKycResponse> {
    constructor(
        private readonly _verificationDocumentRepository: IVerificationDocumentRepository,

    ) {}

    async execute(input: GetAdminKycRequestsInput): Promise<GetAdminKycResponse> {
        const page = input.page || 1;
        const limit = input.limit || 10;
        const skip = (page - 1) * limit;

        const allProfiles = await this._verificationDocumentRepository.getAllProfilesWithVerifications();
        const submittedProfiles = allProfiles.filter((p) => p.hasUploadedDocuments());

        const stats: AdminKycStats = {
            pending: submittedProfiles.filter((p) => p.hasPendingDocuments()).length,
            approved: submittedProfiles.filter((p) => p.areAllDocumentsApproved()).length,
            rejected: submittedProfiles.filter((p) => p.hasRejectedDocuments()).length,
            total: submittedProfiles.length,
        };

        let filtered = submittedProfiles;

        if (input.status && input.status !== "ALL") {
            if (input.status === "PENDING") {
                filtered = filtered.filter((p) => p.hasPendingDocuments());
            } else if (input.status === "APPROVED") {
                filtered = filtered.filter((p) => p.areAllDocumentsApproved());
            } else if (input.status === "REJECTED") {
                filtered = filtered.filter((p) => p.hasRejectedDocuments());
            }
        }

        if (input.search) {
            filtered = filtered.filter((p) => p.matchesSearch(input.search!));
        }

        if (input.sort === "asc") {
            filtered.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
        } else {
            filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        }
       filtered = filtered.filter((verification)=>{
            if (verification.kyc_status === "APROVED"){
                return verification
            }
        })

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const paginated = filtered.slice(skip, skip + limit);

        const dossiers = paginated.map((profile) => VerificationProfileMapper.toDossier(profile));

        return { dossiers, total, totalPages, stats };
    }
}
