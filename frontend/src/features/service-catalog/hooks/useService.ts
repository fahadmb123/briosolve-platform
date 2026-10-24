import { useMutation } from "@tanstack/react-query"
import * as MainService from "../services/service.service"
import type { ApiError } from "../../../shared/api/ApiError"
import { toast } from 'react-hot-toast'

export const useGetServices = ()=>{
    return useMutation({
        mutationFn:MainService.getServices,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}

export const useAddServiceMut = ()=>{
    return useMutation({
        mutationFn:MainService.addService,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}

export const useUpdateServiceMut = ()=>{
    return useMutation({
        mutationFn:MainService.updateService,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}

export const useDeleteServiceMut = ()=>{
    return useMutation({
        mutationFn:MainService.deleteService,
        onError:(error:ApiError)=> toast.error(error.message)
    })
}
