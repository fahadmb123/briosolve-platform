import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Service } from "../../domain/entities/service.entity.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";
import { ServiceMapper } from "../mappers/service.mapper.js";
import { AddServiceUseCaseInputDto, UpdateServiceUseCaseDto, GetServicesDto } from "../../application/Dto/service.js";


export class ServiceRepository implements IServiceRepository{
    async findById(id: string): Promise<Service | null> {
        const service = await db.orm.public.services
            .include("category")
            .where({ id })
            .first()
        if (!service) return null
        return ServiceMapper.toDomain(service)
    }

    async findByName(name:string):Promise<Service | null> {
        const service = await db.orm.public.services
            .include("category")
            .where({ name: name.toLowerCase() as Varchar<150> })
            .first()
        if (!service) return null
        return ServiceMapper.toDomain(service)
    }

    async get(input: GetServicesDto):Promise<{services:Service[], total: number}> {
        const { page, search, limit, filter } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.services;

        if (search) {
            query = query.where((service) => service.name.ilike(`${search}%`));
        }
        if (filter) {
            query = query.where((service) => service.status.eq(filter as any));
        }

        const services = await query
            .include("category")
            .orderBy((service) => service.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all();
            
        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));

        return {
            services: services.map(service => ServiceMapper.toDomain(service)),
            total: totalResult.total
        }
    }

    async add(input:AddServiceUseCaseInputDto):Promise<Service | null> {
        const service = await db.orm.public.services
            .create({
                name: input.name.toLowerCase(),
                category_id: input.category_id,
                description: input.description,
                status: input.status,
                image: input.image
            } as never)
        if (!service) return null
        return ServiceMapper.toDomain(service)
    }

    async update(data:UpdateServiceUseCaseDto):Promise<Service | null> {
        await db.orm.public.services
            .where({id:data.id})
            .update(data.input as any)
            
        return await this.findById(data.id)
    }

    async delete(id: string): Promise<boolean> {
        await db.orm.public.services
            .where({ id })
            .delete();
        return true;
    }
}
