import { useMutation } from "@tanstack/react-query"
import { addCategory } from "../../services/category.service"
import type { ApiError } from "../../../../shared/api/ApiError"
import { toast } from "react-toastify"

export const useAddCategoryService = ()=>{
    return useMutation({
        mutationFn:addCategory,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}