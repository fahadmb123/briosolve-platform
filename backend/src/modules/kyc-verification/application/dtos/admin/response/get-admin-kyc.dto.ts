export interface AdminKycDossier {
    id: string;
    user_id: string;
    business_name: string;
    experience: string;
    bio: string;
    profile_image: string | null;
    kyc_status: string;
    created_at: Date | string;
    updated_at: Date | string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
    };
    services?: Array<{
        id: string;
        name: string;
    }>;
    documents: Array<{
        id: string;
        document_type: string;
        document_name: string;
        status: string;
        rejection_reason: string | null;
        created_at: Date | string;
        files: Array<{
            id: string;
            file_url: string;
        }>;
    }>;
}

export interface AdminKycStats {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
}

export interface GetAdminKycResponse {
    dossiers: AdminKycDossier[];
    total: number;
    totalPages: number;
    stats: AdminKycStats;
}
