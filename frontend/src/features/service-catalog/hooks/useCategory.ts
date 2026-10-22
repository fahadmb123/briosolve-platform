import { useMutation } from "@tanstack/react-query"
import * as CategoryService from "../services/category.service"
import type { ApiError } from "../../../shared/api/ApiError"
import { toast } from "react-toastify"



export const useGetCategoriesService = ()=>{
    return useMutation({
        mutationFn:CategoryService.getCategories,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}
export const useAddCategoryService = ()=>{
    return useMutation({
        mutationFn:CategoryService.addCategory,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}

export const useUpdateCategoryService = ()=>{
    return useMutation({
        mutationFn:CategoryService.updateCategory,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}

export const useDeleteCategoryService = ()=>{
    return useMutation({
        mutationFn:CategoryService.deleteCategory,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}