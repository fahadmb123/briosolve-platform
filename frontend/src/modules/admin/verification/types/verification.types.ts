export interface AdminKycDocumentFile {
  id: string;
  file_url: string;
}

export interface AdminKycDocument {
  id: string;
  document_type: string;
  document_name: string;
  status: string;
  rejection_reason: string | null;
  created_at: string | Date;
  files: AdminKycDocumentFile[];
}

export interface AdminKycService {
  id: string;
  name: string;
}

export interface AdminKycUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface AdminKycDossier {
  id: string;
  user_id: string;
  business_name: string;
  experience: string;
  bio: string;
  profile_image: string | null;
  kyc_status: string;
  created_at: string | Date;
  updated_at: string | Date;
  user: AdminKycUser;
  services?: AdminKycService[];
  documents: AdminKycDocument[];
}

export interface AdminKycStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface GetAdminVerificationsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sort?: "asc" | "desc";
}

export interface AdminVerificationsResponseData {
  dossiers: AdminKycDossier[];
  total: number;
  totalPages: number;
  stats: AdminKycStats;
}

export interface UpdateKycStatusPayload {
  providerId: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: string;
  documentId?: string;
}
