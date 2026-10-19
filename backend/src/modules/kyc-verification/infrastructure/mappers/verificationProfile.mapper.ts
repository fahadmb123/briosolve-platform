import type { Prisma } from "@prisma/client";
import { VerificationProfile } from "../../domain/entities/verificationProfile.entity";
import { AdminKycDossier } from "../../domain/repositories/IVerificationDocumentRepository";
import { VerificationDocumentMapper, VerificationDocumentRecord } from "./verificationDocument.mapper";

export type VerificationProfileRecord = Prisma.ProviderProfileGetPayload<{}>;

export class VerificationProfileMapper {
    static toDomain(record: VerificationProfileRecord): VerificationProfile {
        const documents = (record.verification_documents || []).map((doc: any) =>
            VerificationDocumentMapper.toDomain(doc as VerificationDocumentRecord)
        );

        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        const createdAt = createdAtRaw && typeof createdAtRaw === "object" && "epochMilliseconds" in createdAtRaw
            ? new Date(Number(createdAtRaw.epochMilliseconds))
            : new Date(createdAtRaw);

        const updatedAt = updatedAtRaw && typeof updatedAtRaw === "object" && "epochMilliseconds" in updatedAtRaw
            ? new Date(Number(updatedAtRaw.epochMilliseconds))
            : new Date(updatedAtRaw);

        return new VerificationProfile(
            record.id,
            record.user_id,
            record.business_name || "",
            record.experience || "",
            record.bio || "",
            record.profile_image ?? null,
            record.kyc_status || "NOT_SUBMITTED",
            createdAt,
            updatedAt,
            {
                id: record.user?.id || "",
                name: record.user?.name || "",
                email: record.user?.email || "",
                phone: record.user?.phone ?? null,
            },
            (record.services || []).map((s: any) => ({
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
