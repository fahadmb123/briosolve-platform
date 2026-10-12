export type VerificationDocumentType = 'IDENTITY' | 'CERTIFICATE';

export type VerificationStatus = 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface VerificationFile {
  id: string;
  document_id?: string;
  file_url: string;
  file_name?: string;
  file_size?: string;
  mime_type?: string;
  created_at?: string | Date;
}

export interface VerificationDocument {
  id: string;
  provider_id?: string;
  document_type: VerificationDocumentType;
  document_name: string;
  status: VerificationStatus;
  rejection_reason?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  files: VerificationFile[];
}

export interface KycSubmissionPayload {
  document_type: VerificationDocumentType;
  document_name: string;
  files: {
    name: string;
    size: string;
    url: string;
    file?: File;
  }[];
}

export interface KycEditSubmissionPayload {
  id: string;
  document_type: VerificationDocumentType;
  document_name: string;
  kept_file_ids: string[];
  new_files: {
    name: string;
    size: string;
    url: string;
    file?: File;
  }[];
}
