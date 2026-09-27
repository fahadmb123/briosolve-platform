import { NextFunction ,Response,Request} from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js";
import { success } from "zod";



export class UserController extends BaseController{
    constructor (
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
    
}