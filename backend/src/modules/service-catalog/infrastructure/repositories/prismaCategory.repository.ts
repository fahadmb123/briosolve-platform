import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { CategoryMapper } from "../mappers/category.mapper.";
import { GetCategoriesDto } from "../../application/dtos/response/get-categories.dto";
import { AddCategoryUseCaseInputDto } from "../../application/dtos/request/add-category.dto";
import { UpdateCategoryUseCaseDto } from "../../application/dtos/request/update-category.dto";




export class CategoryRepository implements ICategoryRepository{
    async findById(id: string): Promise<Category | null> {
        const category = await db.orm.public.categories
            .include("services")
            .where({ id })
            .first()
        if (!category) return null
        return CategoryMapper.toDomain(category as Category)
    }

    async findByName(name:string):Promise<Category | null> {
        const category = await db.orm.public.categories
            .include("services")
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
            .include("services")
            .orderBy((category) => category.updated_at.desc())
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
            .create(CategoryMapper.toPersistence(input) as never)
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