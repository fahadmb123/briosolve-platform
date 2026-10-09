import { useMutation } from "@tanstack/react-query"
import { addCategory, updateCategory } from "../../services/category.service"
import type { ApiError } from "../../../../shared/api/ApiError"
import { toast } from "react-toastify"

export const useAddCategoryService = ()=>{
    return useMutation({
        mutationFn:addCategory,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}

export const useUpdateCategoryService = ()=>{
    return useMutation({
        mutationFn:updateCategory,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}