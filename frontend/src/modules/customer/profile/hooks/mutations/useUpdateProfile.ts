import { useMutation } from "@tanstack/react-query"
import { updateProfile } from "../../api/api"
import type { ApiError } from "../../../../../shared/api/ApiError"
import { toast } from "react-toastify"





export const useUpdateProfile = () => {
    return useMutation({
        mutationFn:updateProfile,
        onError:(error:ApiError)=> toast.error(error.message)
    })
} 