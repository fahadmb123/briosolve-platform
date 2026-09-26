import { useMutation } from "@tanstack/react-query";
import { getOtpStatus, otpVarify } from "../api";




export const useOtpVarify = () => {
    return useMutation({
        mutationFn:otpVarify ,
    })
}
export const useGetOtpStatus = () => {
    return useMutation({
        mutationFn:getOtpStatus ,
    })
}