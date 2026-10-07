import { NextFunction,Request,Response } from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { Address } from "../../domain/entities/address.entity.js";
import { AddAddressInputUseCaseDto } from "../../application/Dto/addressDto.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";


export class AddressController extends BaseController{
    constructor(
        private readonly addAddressUseCase: IUseCase<AddAddressInputUseCaseDto,Address>,
        private readonly getAddressesUseCase: IUseCase<string,{addresses:Address[]}>
    ){super()}

    addAddress = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)

            const response = await this.addAddressUseCase.execute({id:user.userId,input:req.body})
            
            return sendSuccess(res,"Added!",response)
        } catch (err) {
            next(err)
        }
    }

    getAddresses = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)

            const response = await this.getAddressesUseCase.execute(user.userId)
            
            return sendSuccess(res,"",response)
        } catch (err) {
            next(err)
        }
    }
}