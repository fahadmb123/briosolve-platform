import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";

export class ServiceRequestController extends BaseController {
    constructor() {
        super();
    }

    createServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return this.sendSuccess(res, "Service request route ready", null);
        } catch (error) {
            next(error);
        }
    };
}

