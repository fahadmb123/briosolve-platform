import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";
import { VerificationDocument } from "../../domain/entities/verificationDocument.entity";
import { UploadVerificationInputDto, UpdateVerificationInputDto } from "../../application/Dto/verificationDto";
import { GetAdminKycRequestsInput, GetAdminKycResponse } from "../../domain/repositories/IVerificationDocumentRepository";
import { UpdateKycStatusInput } from "../../application/use-cases/updateKycStatus.useCase";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export class VerificationController extends BaseController {
    constructor(
        private readonly uploadVerificationDocumentUseCase: IUseCase<UploadVerificationInputDto, VerificationDocument>,
        private readonly getProviderVerificationsUseCase: IUseCase<string, VerificationDocument[]>,
        private readonly updateVerificationDocumentUseCase: IUseCase<UpdateVerificationInputDto, VerificationDocument>,
        private readonly deleteVerificationDocumentUseCase: IUseCase<{ id: string; userId: string }, boolean>,
        private readonly getAdminVerificationsUseCase: IUseCase<GetAdminKycRequestsInput, GetAdminKycResponse>,
        private readonly updateKycStatusUseCase: IUseCase<UpdateKycStatusInput, void>
    ) {
        super();
    }

    uploadVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);

            const uploadedFiles: Express.Multer.File[] = [];
            if (Array.isArray(req.files)) {
                uploadedFiles.push(...req.files);
            } else if (req.file) {
                uploadedFiles.push(req.file);
            }

            if (uploadedFiles.length === 0) {
                throw new ApplicationError("BAD_REQUEST", "At least one verification document file is required", "VALIDATION");
            }

            const input: UploadVerificationInputDto = {
                userId: user.userId,
                document_type: req.body.document_type,
                document_name: req.body.document_name,
                files: uploadedFiles.map((file) => ({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                }))
            };

            const result = await this.uploadVerificationDocumentUseCase.execute(input);
            return sendSuccess(res, "Submitted!", result);
        } catch (error) {
            next(error);
        }
    };

    updateVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const id = req.params.id;
            if (!id) {
                throw new ApplicationError("BAD_REQUEST", "Document ID is required", "VALIDATION");
            }

            const uploadedFiles: Express.Multer.File[] = [];
            if (Array.isArray(req.files)) {
                uploadedFiles.push(...req.files);
            } else if (req.file) {
                uploadedFiles.push(req.file);
            }

            let keptFileIds: string[] | undefined = undefined;
            if (req.body.kept_file_ids !== undefined) {
                try {
                    keptFileIds = typeof req.body.kept_file_ids === "string"
                        ? JSON.parse(req.body.kept_file_ids)
                        : req.body.kept_file_ids;
                } catch {
                    keptFileIds = Array.isArray(req.body.kept_file_ids)
                        ? req.body.kept_file_ids
                        : [req.body.kept_file_ids];
                }
            }

            const input: UpdateVerificationInputDto = {
                id: id as string,
                userId: user.userId,
                document_name: req.body.document_name,
                kept_file_ids: keptFileIds,
                new_files: uploadedFiles.map((file) => ({
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                }))
            };

            const result = await this.updateVerificationDocumentUseCase.execute(input);
            return sendSuccess(res, "Updated!", result);
        } catch (error) {
            next(error);
        }
    };

    deleteVerification = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const id = req.params.id;
            if (!id) {
                throw new ApplicationError("BAD_REQUEST", "Document ID is required", "VALIDATION");
            }

            await this.deleteVerificationDocumentUseCase.execute({
                id: id as string,
                userId: user.userId
            });
            return sendSuccess(res, "Deleted!", null);
        } catch (error) {
            next(error);
        }
    };

    getProviderVerifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const documents = await this.getProviderVerificationsUseCase.execute(user.userId);
            return sendSuccess(res, "Verification documents retrieved successfully", documents);
        } catch (error) {
            next(error);
        }
    };

    getAdminVerifications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;
            const sort = req.query.sort as "asc" | "desc" | undefined;

            const result = await this.getAdminVerificationsUseCase.execute({
                page,
                limit,
                search,
                status,
                sort
            });
            return sendSuccess(res, "Admin verification requests retrieved successfully", result);
        } catch (error) {
            next(error);
        }
    };

    updateKycStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerId = req.params.id || req.body.providerId;
            const status = req.body.status;
            const rejectionReason = req.body.rejectionReason || req.body.rejection_reason;
            const documentId = req.body.documentId;

            await this.updateKycStatusUseCase.execute({
                providerId,
                status,
                rejectionReason,
                documentId
            });
            return sendSuccess(res, `KYC status updated to ${status}!`, null);
        } catch (error) {
            next(error);
        }
    };
}
