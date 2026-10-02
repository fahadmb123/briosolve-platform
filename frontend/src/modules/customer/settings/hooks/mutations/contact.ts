import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { updateEmail, updatePassword, updatePhone } from "../../api/api";
import { toast } from "react-toastify";


export const useUpdateEmail = () => {
    return useMutation({
        mutationFn: updateEmail,
        onError: (error: ApiError) => toast.error(error.message),
    });
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