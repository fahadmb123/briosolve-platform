import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Category } from "../../domain/entities/category.entity.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";
import { CategoryMapper } from "../mappers/category.mapper..js";
import { AddCategoryUseCaseInputDto, UpdateCategoryUseCaseDto, GetCategoriesDto } from "../../application/Dto/category.js";



export class CategoryRepository implements ICategoryRepository{
    async findById(id: string): Promise<Category | null> {
        const category = await db.orm.public.categories
            .where({ id })
            .first()
        if (!category) return null
        return CategoryMapper.toDomain(category as Category)
    }

    async findByName(name:string):Promise<Category | null> {
        const category = await db.orm.public.categories
            .where({ name: name.toLowerCase() as Varchar<100> })
            .first()
        if (!category) return null
        return CategoryMapper.toDomain(category as Category)
    }

    async get(input: GetCategoriesDto):Promise<{categories:Category[], total: number}> {
        const { page, search, limit, filter } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.categories;

        if (search) {
            query = query.where((category) => category.name.ilike(`${search}%`));
        }
        if (filter) {
            query = query.where((category) => category.status.eq(filter as any));
        }

        const categories = await query
            .orderBy((category) => category.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all();
            
        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));

        return {
            categories: categories.map(category => CategoryMapper.toDomain(category as Category)),
            total: totalResult.total
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
        await db.orm.public.categories
            .where({id:data.id})
            .update(data.input as any)
            
        return await this.findById(data.id)
    }

    async delete(id: string): Promise<boolean> {
        await db.orm.public.categories
            .where({ id })
            .delete();
        return true;
    }
}