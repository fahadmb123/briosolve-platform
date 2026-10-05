import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"
import { User } from "../../domain/entities/user.entity.js"


export type UpdateUserStatusDto = {
    id:string,
    status:string
}

export type GetProfileUseCaseOutputDto = {
    user:User,
    profile:CustomerProfile | null
}
export type GetProfileUseCaseInputDto = {
    id:string,
    role:string
}

export type UpdateCustomerProfileInputDto = {
    id:string,
    data:UpdateCustomerProfileInputDataDto
}
export type UpdateCustomerProfileInputDataDto = {
    name:string,
    about:string
}
