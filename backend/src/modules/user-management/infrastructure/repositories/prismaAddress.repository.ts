import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../infrastructure/persistence/prisma/client.js";
import { Address } from "../../domain/entities/address.entity.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";
import { AddressMapper } from "../mappers/address.mapper.js";
import { GetAddressesInputDto, GetAddressesOutputDto } from "../../application/Dto/addressDto.js";




export class AddressRepository implements IAddressRepository{
    async findById(id: string): Promise<Address | null> {
        const address = await db.orm.public.addresses
            .where({id})
            .first()
        if (!address) return null
        return AddressMapper.toDomain(address)
    }

    async addAddress(id:string,data: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> {
        const address = await db.orm.public.addresses.create({
            user_id:id,
            house_no: data.house_no,
            area: data.area,
            city: data.city,
            district: data.district,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            landmark: data.landmark,
            type: data.type,
            latitude: data.latitude,
            longitude: data.longitude,
        } as never);

        return AddressMapper.toDomain(address);
    }
    async update(id:string,data:Partial<Omit<Address, 'id' | 'created_at' | 'updated_at'>>):Promise<Address>{
        const address = await db.orm.public.addresses
            .where({id:id})
            .update(data as any)
        return AddressMapper.toDomain(address)
    }

    async getAddresses(input:GetAddressesInputDto): Promise<Omit<GetAddressesOutputDto,"totalPages">> {
        const {page,search,limit} = input
        const skip = (page - 1) * limit

        let query = await db.orm.public.addresses.where({user_id:input.id})
        if (search){
            query = query.where((address)=> address.landmark.ilike(`${search}%`))
        }

        const addresses  = await query
            .orderBy((address)=>address.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        
        const total = await query.aggregate((agg)=>({total:agg.count()}))
        return {
            addresses: addresses.map(address => AddressMapper.toDomain(address)),
            total:total.total
        }

    }
    async delete(id:string): Promise<void> {
        await db.orm.public.addresses
            .where({id:id})
            .delete()
    }
}