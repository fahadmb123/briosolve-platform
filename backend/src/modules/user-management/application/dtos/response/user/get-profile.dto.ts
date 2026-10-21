import { CustomerProfile } from "../../../../domain/entities/customerProfile.entity"
import { ProviderProfile } from "../../../../domain/entities/providerProfile.entity"
import { User } from "../../../../domain/entities/user.entity"

export type GetProfileUseCaseOutputDto = {
    user:User,
    profile:CustomerProfile | ProviderProfile | null
}

