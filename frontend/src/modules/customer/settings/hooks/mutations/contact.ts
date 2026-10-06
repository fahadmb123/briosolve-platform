import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { updateEmail, updatePassword, updatePhone, deletePhone } from "../../api/api";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../../../store/auth/auth.store";


export const useUpdateEmail = () => {
    return useMutation({
        mutationFn: updateEmail,
        onError: (error: ApiError) => toast.error(error.message),
    })
}

export const useUpdatePassword = ()=>{
    return useMutation({
        mutationFn:updatePassword,
        onError:(error:ApiError)=>toast.error(error.message)
    })
}

export const useUpdatePhone = ()=>{
    return useMutation({
        mutationFn:updatePhone,
        onError:(error:ApiError)=>toast.error(error.message)
    })
}

export const useDeletePhone = () => {
    const fetchUser = useAuthStore((state) => state.fetchUser);
    
    return useMutation({
        mutationFn: deletePhone,
        onSuccess: () => {
            fetchUser()
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
}