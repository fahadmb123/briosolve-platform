import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as MainService from "../services/service.service"
import type { ApiError } from "../../../shared/api/ApiError"
import { toast } from 'react-hot-toast'

export const useGetServices = (params: { page?: number; limit?: number; search?: string; filter?: string } = {}) => {
    return useQuery({
        queryKey: ["services", params],
        queryFn: () => MainService.getServices(params),
    })
}

export const useAddServiceMut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: MainService.addService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    })
}

export const useUpdateServiceMut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: MainService.updateService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    })
}

export const useDeleteServiceMut = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: MainService.deleteService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    })
}
