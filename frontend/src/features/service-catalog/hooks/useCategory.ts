import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as CategoryService from "../services/category.service"
import type { ApiError } from "../../../shared/api/ApiError"
import { toast } from 'react-hot-toast'

export const useGetCategoriesService = (params: { page?: number; limit?: number; search?: string; filter?: string } = {}) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => CategoryService.getCategories(params),
    })
}

export const useAddCategoryService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CategoryService.addCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    })
}

export const useUpdateCategoryService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CategoryService.updateCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    })
}

export const useDeleteCategoryService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CategoryService.deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    })
}
