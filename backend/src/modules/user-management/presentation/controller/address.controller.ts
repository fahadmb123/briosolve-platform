import { NextFunction,Request,Response } from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { Address } from "../../domain/entities/address.entity";
import { AddAddressInputUseCaseDto, EditAddressInputUseCaseDto, GetAddressesInputDto, GetAddressesOutputDto, SetDefaultAddressInputUseCaseDto } from "../../application/Dto/addressDto";
import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";


export class AddressController extends BaseController{
    constructor(
        private readonly addAddressUseCase: IUseCase<AddAddressInputUseCaseDto,Address>,
        private readonly getAddressesUseCase: IUseCase<GetAddressesInputDto,GetAddressesOutputDto>,
        private readonly editAddressUseCase: IUseCase<EditAddressInputUseCaseDto,Address>,
        private readonly deleteAddressUseCase: IUseCase<string,void>,
        private readonly setDefaultAddressUseCase: IUseCase<SetDefaultAddressInputUseCaseDto,void>
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

    editAddress = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)
            const id = req.params.id

            const response = await this.editAddressUseCase.execute({id:id as string,input:req.body})
            
            return sendSuccess(res,"Updated!",response)
        } catch (err) {
            next(err)
        }
    }

    getAddresses = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)

            const response = await this.getAddressesUseCase.execute({
                id:user.userId,
                page:Number(req.query.page) || 1,
                limit:Number(req.query.limit) || 10,
                search:req.query.search as string | undefined
            })
            
            return sendSuccess(res,"",response)
        } catch (err) {
            next(err)
        }
    }
    delete = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)
            const id = req.params.id

            await this.deleteAddressUseCase.execute(id as string)

            return sendSuccess(res,"Deleted!")
        } catch (err) {
            next(err)
        }
    }
    setDefault = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)
            const addressId = req.params.id

            await this.setDefaultAddressUseCase.execute({userId:user.userId,addressId:addressId as string})

            return sendSuccess(res,"Updated!")
        } catch (err) {
            next(err)
        }
    }
}