import { NextFunction,Request,Response } from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { AddAddressInputUseCaseDto } from "../../application/dtos/request/address/add-address.dto";
import { GetAddressesInputDto } from "../../application/dtos/request/address/get-addresses.dto";
import { GetAddressesOutputDto } from "../../application/dtos/response/address/get-addresses.dto";
import { EditAddressInputUseCaseDto } from "../../application/dtos/request/address/edit-address.dto";
import { SetDefaultAddressInputUseCaseDto } from "../../application/dtos/request/address/set-default-address.dto";
import { AddressResponseDto } from "../../application/dtos/response/address/address.dto";


export class AddressController extends BaseController{
    constructor(
        private readonly _addAddressUseCase: IUseCase<AddAddressInputUseCaseDto,AddressResponseDto>,
        private readonly _getAddressesUseCase: IUseCase<GetAddressesInputDto,GetAddressesOutputDto>,
        private readonly _editAddressUseCase: IUseCase<EditAddressInputUseCaseDto,AddressResponseDto>,
        private readonly _deleteAddressUseCase: IUseCase<string,void>,
        private readonly _setDefaultAddressUseCase: IUseCase<SetDefaultAddressInputUseCaseDto,void>
    ){super()}

    addAddress = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = req.user!

            const response = await this._addAddressUseCase.execute({id:user.userId,input:req.body})
            
            return this.sendSuccess(res,"Added!",response)
        } catch (err) {
            next(err)
        }
    }

    editAddress = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const id = req.params.id

            const response = await this._editAddressUseCase.execute({id:id as string,input:req.body})
            
            return this.sendSuccess(res,"Updated!",response)
        } catch (err) {
            next(err)
        }
    }

    getAddresses = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = req.user!

            const response = await this._getAddressesUseCase.execute({
                id:user.userId,
                page:Number(req.query.page) || 1,
                limit:Number(req.query.limit) || 10,
                search:req.query.search as string | undefined
            })
            
            return this.sendSuccess(res,"",response)
        } catch (err) {
            next(err)
        }
    }
    delete = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const id = req.params.id

            await this._deleteAddressUseCase.execute(id as string)

            return this.sendSuccess(res,"Deleted!")
        } catch (err) {
            next(err)
        }
    }
    setDefault = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = req.user!
            const addressId = req.params.id

            await this._setDefaultAddressUseCase.execute({userId:user.userId,addressId:addressId as string})

            return this.sendSuccess(res,"Updated!")
        } catch (err) {
            next(err)
        }
    }
}