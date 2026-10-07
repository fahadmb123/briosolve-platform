import { useMutation } from "@tanstack/react-query"
import { addAddress } from "../../services/address.service"
import type { ApiError } from "../../../../../shared/api/ApiError"
import { toast } from "react-toastify"






export const useAddAddress = ()=>{
    return useMutation({
        mutationFn:addAddress,
        onError:(error:ApiError)=>toast.error(error.message)
    })
}