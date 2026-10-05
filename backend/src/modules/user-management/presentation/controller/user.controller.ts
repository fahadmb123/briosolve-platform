import { NextFunction ,Response,Request} from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js";
import { IUpdateUserStatusUseCase } from "../../domain/interfaces/use-cases/IUpdateUserUseCase.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";




export class UserController extends BaseController{
    constructor (
        private readonly updateUserUseCase:IUpdateUserStatusUseCase
    ) {super()}
    
    updateUserStatus = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            await this.updateUserUseCase.execute({id:req.params.id as string,status:req.body.status})

            return sendSuccess(res,"User Updated")
        } catch (err) {
            next(err)
        }
    }
    
}