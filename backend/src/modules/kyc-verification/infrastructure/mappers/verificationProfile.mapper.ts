import { VerificationProfile } from "../../domain/entities/verificationProfile.entity.js";
import { AdminKycDossier } from "../../domain/repositories/IVerificationDocumentRepository.js";
import { VerificationDocumentMapper } from "./verificationDocument.mapper.js";

export class VerificationProfileMapper {
    static toDomain(raw: any): VerificationProfile {
        const documents = (raw.verification_documents || []).map((doc: any) =>
            VerificationDocumentMapper.toDomain(doc)
        );

        const createdAt = raw.created_at && typeof raw.created_at === "object" && "epochMilliseconds" in raw.created_at
            ? new Date(raw.created_at.epochMilliseconds)
            : new Date(raw.created_at);

        const updatedAt = raw.updated_at && typeof raw.updated_at === "object" && "epochMilliseconds" in raw.updated_at
            ? new Date(raw.updated_at.epochMilliseconds)
            : new Date(raw.updated_at);

        return new VerificationProfile(
            raw.id,
            raw.user_id,
            raw.business_name || "",
            raw.experience || "",
            raw.bio || "",
            raw.profile_image ?? null,
            raw.kyc_status || "NOT_SUBMITTED",
            createdAt,
            updatedAt,
            {
                id: raw.user?.id || "",
                name: raw.user?.name || "",
                email: raw.user?.email || "",
                phone: raw.user?.phone ?? null,
            },
            (raw.services || []).map((s: any) => ({
                id: s.service?.id || s.id,
                name: s.service?.name || "Service",
            })),
            documents
        );
    }

    static toDossier(profile: VerificationProfile): AdminKycDossier {
        return {
            id: profile.id,
            user_id: profile.user_id,
            business_name: profile.business_name,
            experience: profile.experience,
            bio: profile.bio,
            profile_image: profile.profile_image,
            kyc_status: profile.getEffectiveKycStatus(),
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            user: {
                id: profile.user.id,
                name: profile.user.name,
                email: profile.user.email,
                phone: profile.user.phone,
            },
            services: profile.services.map((s) => ({
                id: s.id,
                name: s.name,
            })),
            documents: profile.documents.map((doc) => ({
                id: doc.id,
                document_type: doc.document_type,
                document_name: doc.document_name,
                status: doc.status,
                rejection_reason: doc.rejection_reason,
                created_at: doc.created_at,
                files: (doc.files || []).map((f) => ({
                    id: f.id,
                    file_url: f.file_url,
                })),
            })),
        };
    }
}
