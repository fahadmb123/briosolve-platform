import { Address } from "../../../../domain/entities/address.entity"

export type AddAddressInputUseCaseDto = {
    id:string
    input: Omit<Address, 'id' | 'created_at' | 'updated_at' | "user_id">
}
