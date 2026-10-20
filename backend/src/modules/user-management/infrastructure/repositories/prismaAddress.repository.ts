import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { Address } from "../../domain/entities/address.entity";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { AddressMapper } from "../mappers/address.mapper";
import { GetAddressesInputDto, GetAddressesOutputDto } from "../../application/Dto/addressDto";




export class AddressRepository implements IAddressRepository{
    async findById(id: string): Promise<Address | null> {
        const address = await db.orm.public.addresses
            .where({id})
            .first()
        if (!address) return null
        return AddressMapper.toDomain(address)
    }

    async addAddress(id:string,data: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> {
        const address = await db.orm.public.addresses.create(
            AddressMapper.toPersistence(id, data) as never
        );

        return AddressMapper.toDomain(address);
    }
    async update(id:string,data:Partial<Omit<Address, 'id' | 'created_at' | 'updated_at'>>):Promise<Address>{
        const address = await db.orm.public.addresses
            .where({id:id})
            .update(data as any)
        return AddressMapper.toDomain(address!);
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