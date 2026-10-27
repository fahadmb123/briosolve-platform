import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { GetNotificationRequestDto } from "../../application/dtos/request/get-notifications.dto";
import { UpdateNotificationRequestDto } from "../../application/dtos/request/update-notificsation.dto";



export class NotificationController extends BaseController{
    constructor(
        private readonly _createNotificationUseCase: IUseCase<CreateNotificationRequestDto,NotificationResponseDto>,
        private readonly _getNotificationsUseCase: IUseCase<GetNotificationRequestDto,NotificationResponseDto[]>,
        private readonly _updateNotificationUseCase: IUseCase<UpdateNotificationRequestDto,NotificationResponseDto>,
        private readonly _markAllAsRead:IUseCase<string,NotificationResponseDto[]>,
    ) {super()}

    async create(req: Request,res: Response,next: NextFunction,): Promise<void> {
        try {
            const notification = await this._createNotificationUseCase.execute(req.body)

            this.sendSuccess(
                res,
                "Notification Created!",
                notification
            )
        } catch (error) {
            next(error)
        }
    }
    
    async getNotifications(req: Request,res: Response,next: NextFunction,): Promise<void> {
        try {
            const notifications = await this._getNotificationsUseCase.execute(
                {recipientId:req.user?.userId as string}
            )

            this.sendSuccess(
                res,
                "Fetched!",
                notifications
            )
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request,res: Response,next: NextFunction,): Promise<void> {
        try {
            const id = req.params.id

            await this._updateNotificationUseCase.execute({
                recipientId:req.user?.userId as string,
                id:id as string,
                input:req.body
            })

            this.sendSuccess(
                res,
                "Updated!"
            )
        } catch (error) {
            next(error)
        }
    }

    async markAllAsRead(req: Request,res: Response,next: NextFunction,): Promise<void> {
        try {
            await this._markAllAsRead.execute(req.user?.userId as string)

            this.sendSuccess(
                res,
                "Updated!"
            )
        } catch (error) {
            next(error)
        }
    }
}