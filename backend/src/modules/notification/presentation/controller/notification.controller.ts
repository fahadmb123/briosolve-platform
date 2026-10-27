import { Request, Response, NextFunction } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";


export class NotificationController extends BaseController{
  constructor(
    private readonly _createNotificationUseCase: IUseCase<CreateNotificationRequestDto,NotificationResponseDto>,
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
}