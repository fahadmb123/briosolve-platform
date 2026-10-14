import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { GetAddressesInputDto, GetAddressesOutputDto } from "../../application/Dto/addressDto.js";
import { Address } from "../entities/address.entity.js";



export interface IAddressRepository extends BaseRepository<Address | null>{
    addAddress(id:string,data: Omit<Address, 'id' | 'created_at' | 'updated_at' | "user_id">): Promise<Address>
    getAddresses(data:GetAddressesInputDto): Promise<Omit<GetAddressesOutputDto,"totalPages">>
    update(id:string,data:Partial<Omit<Address, 'id' | 'created_at' | 'updated_at'>>):Promise<Address>
    delete(id:string):Promise<void>
}