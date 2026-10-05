import { Request,Response,NextFunction } from "express"
import { UpdatePasswordInputDto } from "../../application/dto/customerDto.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js"



class CustomerAuthController extends BaseController {
    constructor (
        private readonly updatePasswordUseCase :IUseCase<UpdatePasswordInputDto,void>
    ) { super() }
    
    updatePassword = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            

            await this.updatePasswordUseCase.execute({id:req.user?.userId as string,data:req.body})

            return sendSuccess(res,"Updated")
        } catch (err) {
            next(err)
        }
    }
}



export default CustomerAuthController