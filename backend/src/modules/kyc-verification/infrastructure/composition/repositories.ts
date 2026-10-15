import { VerificationDocumentRepository } from "../repositories/prismaVerificationDocuments.repository";
import { VerificationFileRepository } from "../repositories/prismaVerificationFiles.repository";

export const verificationDocumentRepository = new VerificationDocumentRepository();
export const verificationFileRepository = new VerificationFileRepository();
