import { Address } from "../../../../domain/entities/address.entity"

export type GetAddressesOutputDto = {
    addresses:Address[]
    total:number,
    totalPages:number
}