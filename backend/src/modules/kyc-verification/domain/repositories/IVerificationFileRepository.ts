import { VerificationFile } from "../entities/verificationFile.entity";

export interface IVerificationFileRepository {
    create(documentId: string, fileUrl: string): Promise<VerificationFile>;
    createMany(documentId: string, fileUrls: string[]): Promise<VerificationFile[]>;
    findByDocumentId(documentId: string): Promise<VerificationFile[]>;
    deleteByDocumentId(documentId: string): Promise<boolean>;
}
