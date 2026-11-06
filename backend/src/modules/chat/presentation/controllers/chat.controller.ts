import { Request, Response, NextFunction } from "express";
import { BaseController } from "../../../../shared/base/controller/baseController";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { StartConversationRequestDto } from "../../application/dtos/request/conversation/start-conversation.dto";
import { ConversationResponseDto } from "../../application/dtos/response/conversation/conversation-response.dto";
import { GetConversationsRequestDto } from "../../application/dtos/request/conversation/get-conversations.dto";
import { GetMessagesRequestDto } from "../../application/dtos/request/message/get-messages.dto";
import { MessageResponseDto } from "../../application/dtos/response/message/message-response.dto";
import { SendMessageRequestDto } from "../../application/dtos/request/message/send-message.dto";
import { MarkMessagesAsReadRequestDto } from "../../application/dtos/request/message/mark-messages-as-read.dto";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class ChatController extends BaseController {
    constructor(
        private readonly _startConversationUseCase: IUseCase<StartConversationRequestDto, ConversationResponseDto>,
        private readonly _getConversationsUseCase: IUseCase<GetConversationsRequestDto, ConversationResponseDto[]>,
        private readonly _getMessagesUseCase: IUseCase<GetMessagesRequestDto, MessageResponseDto[]>,
        private readonly _sendMessageUseCase: IUseCase<SendMessageRequestDto, MessageResponseDto>,
        private readonly _markMessagesAsReadUseCase: IUseCase<MarkMessagesAsReadRequestDto, void>,
        private readonly _imageUploadService?: ImageUploadService
    ) {
        super();
    }

    startConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId as string;
            const conversation = await this._startConversationUseCase.execute({
                userId,
                recipientId: req.body.recipientId
            });

            this.sendSuccess(res, "Conversation started", conversation, 201);
        } catch (error) {
            next(error);
        }
    };

    getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId as string;
            const conversations = await this._getConversationsUseCase.execute({
                userId
            });

            this.sendSuccess(res, "Conversations fetched successfully", conversations);
        } catch (error) {
            next(error);
        }
    };

    getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId as string;
            const conversationId = req.params.conversationId as string;
            const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;

            const messages = await this._getMessagesUseCase.execute({
                conversationId,
                userId,
                cursor,
                limit
            });

            this.sendSuccess(res, "Messages fetched successfully", messages);
        } catch (error) {
            next(error);
        }
    };

    sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const senderId = req.user?.userId as string;
            const conversationId = req.params.conversationId as string;

            const message = await this._sendMessageUseCase.execute({
                conversationId,
                senderId,
                content: req.body.content,
                messageType: req.body.messageType ?? "TEXT"
            });

            this.sendSuccess(res, "Message sent successfully", message, 201);
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId as string;
            const conversationId = req.params.conversationId as string;

            await this._markMessagesAsReadUseCase.execute({
                conversationId,
                userId
            });

            this.sendSuccess(res, "Messages marked as read", null);
        } catch (error) {
            next(error);
        }
    };

    uploadAttachment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.file) {
                throw new ApplicationError("NO_FILE_PROVIDED", "No image file provided", "VALIDATION");
            }

            if (!this._imageUploadService) {
                throw new ApplicationError("UPLOAD_SERVICE_UNAVAILABLE", "Image upload service not available", "INTERNAL");
            }

            const imageUrl = await this._imageUploadService.uploadImage(req.file.buffer, "chat");
            this.sendSuccess(res, "Image uploaded successfully", { imageUrl });
        } catch (error) {
            next(error);
        }
    };
}

