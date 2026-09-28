import { NextFunction ,Response,Request} from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js";
import { IUpdateUserStatusUseCase } from "../../domain/interfaces/use-cases/IUpdateUserUseCase.js";




export class UserController extends BaseController{
    constructor (
        private readonly updateUserUseCase:IUpdateUserStatusUseCase,
        private readonly getCustomersUseCase:IGetCustomersUseCase
    ) {super()}

    getCustomers = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            const users = await this.getCustomersUseCase.execute()
            res.status(200).json({
                success:true,
                data:{
                    users
                }
            })
        } catch (err) {
            next(err)
        }
    }

    updateUserStatus = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            await this.updateUserUseCase.execute(req.body)
            res.status(200).json({
                success:true,
                message: "User Updated"
            })
        } catch (err) {
            next(err)
        }
    }
    
}