import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Category } from "../../domain/entities/category.entity.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";
import { CategoryMapper } from "../mappers/category.mapper..js";
import { AddCategoryUseCaseInputDto, UpdateCategoryUseCaseDto } from "../../application/Dto/category.js";



export class CategoryRepository implements ICategoryRepository{
    async findById(id: string): Promise<Category | null> {
        return null
    }

    async findByName(name:string):Promise<Category | null> {
        const category = await db.orm.public.categories
            .where({ name: name.toLowerCase() as Varchar<100> })
            .first()
        if (!category) return null
        return CategoryMapper.toDomain(category as Category)
    }

    async get():Promise<{categories:Category[]}> {
        const categories = await db.orm.public.categories.all()
        return {
            categories:categories.map(category=>CategoryMapper.toDomain(category as Category))
        }
    }

    async add(input:AddCategoryUseCaseInputDto):Promise<Category | null> {
        const category = await db.orm.public.categories
            .create({
                name: input.name.toLowerCase(),
                description: input.description,
                status: input.status,
                image: input.image
            } as never)
        if (!category) return null
        return CategoryMapper.toDomain(category as Category)
    }

    async update(data:UpdateCategoryUseCaseDto):Promise<Category | null> {
        const category = await db.orm.public.categories
            .where({id:data.id})
            .update(data.input as any)
        if (!category) return null
        return CategoryMapper.toDomain(category as Category)
    }
}