import { VerificationDocumentRepository } from "../repositories/prismaVerificationDocuments.repository.js";
import { VerificationFileRepository } from "../repositories/prismaVerificationFiles.repository.js";

export const verificationDocumentRepository = new VerificationDocumentRepository();
export const verificationFileRepository = new VerificationFileRepository();
