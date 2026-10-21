import { NextFunction ,Response,Request} from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { IUpdateUserStatusUseCase } from "../../application/interfaces/use-cases/users/update-user.interface";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { GetProfileUseCaseOutputDto } from "../../application/dtos/response/user/get-profile.dto";
import { GetProfileUseCaseInputDto } from "../../application/dtos/request/user/get-profile.dto";

export class UserController extends BaseController{
    constructor (
        private readonly updateUserUseCase:IUpdateUserStatusUseCase,
        private readonly getProfileUseCase : IUseCase<GetProfileUseCaseInputDto,GetProfileUseCaseOutputDto>
    ) {super()}

    getProfile = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.getProfileUseCase.execute({id:req.user?.userId!,role:req.user?.role!})

            return this.sendSuccess(res,"",{
                user: UserMapper.toDto(response.user),
                profile: response.profile ? response.profile : null
            }) 
        } catch (err) {
            next(err)
        }
    }
    
    updateUserStatus = async (req:Request,res:Response,next:NextFunction) => {
        try {
            await this.updateUserUseCase.execute({
                id: req.params.id as string,
                status: req.body.status,
                reason: req.body.reason,
                adminId: req.user?.userId
            })

            return this.sendSuccess(res,"Updated!")
        } catch (err) {
            next(err)
        }
    }
}