import { NextFunction,Request,Response } from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js"
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js"
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js"






export class CustomerController extends BaseController{
    constructor (
        private readonly getCustomersUseCase:IGetCustomersUseCase
    ) {super()}

    getCustomers = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
    
            const response = await this.getCustomersUseCase.execute({
                page:Number(req.query.page) || 1,
                limit:Number(req.query.limit) || 10,
                filter:req.query.filter as string | undefined,
                search:req.query.search as string | undefined
            })

            return sendSuccess(res,"",response)
        } catch (err) {
            next(err)
        }
    }
    
}