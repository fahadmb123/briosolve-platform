import { NextFunction ,Response,Request} from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js";
import { IUpdateUserStatusUseCase } from "../../domain/interfaces/use-cases/IUpdateUserUseCase.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";
import { GetProfileUseCaseInputDto, GetProfileUseCaseOutputDto } from "../../application/Dto/userDto.js";
import { UserResponseMapper } from "../mappers/userResponse.mapper.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";




import { CreateAccountReactivationRequestUseCase } from "../../application/use-cases/createAccountReactivationRequest.useCase.js";

export class UserController extends BaseController{
    constructor (
        private readonly updateUserUseCase:IUpdateUserStatusUseCase,
        private readonly getProfileUseCase : IUseCase<GetProfileUseCaseInputDto,GetProfileUseCaseOutputDto>,
        private readonly createAccountReactivationRequestUseCase: CreateAccountReactivationRequestUseCase
    ) {super()}

    getProfile = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            const response = await this.getProfileUseCase.execute({id:req.user?.userId!,role:req.user?.role!})

            return sendSuccess(res,"",{
                user: UserResponseMapper.toDto(response.user),
                profile: response.profile ? response.profile : null
            }) 
        } catch (err) {
            next(err)
        }
    }
    
    updateUserStatus = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            await this.updateUserUseCase.execute({
                id: req.params.id as string,
                status: req.body.status,
                reason: req.body.reason,
                adminId: req.user?.userId
            })

            return sendSuccess(res,"Updated!")
        } catch (err) {
            next(err)
        }
    }

    requestReactivation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, reason } = req.body;
            const result = await this.createAccountReactivationRequestUseCase.execute({ email, reason });
            return sendSuccess(res, "Submited!", result);
        } catch (err) {
            next(err);
        }
    }
}