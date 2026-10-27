import { Buffer } from "node:buffer";

export interface UpdateVerificationInputDto {
    id: string;
    userId: string;
    document_name?: string;
    kept_file_ids?: string[];
    new_files?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }[];
}
