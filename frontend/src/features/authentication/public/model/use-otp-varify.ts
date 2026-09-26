import { useMutation } from "@tanstack/react-query";
import { otpVarify } from "../api";

export const useOtpVarify = () => {
    return useMutation({
        mutationFn:otpVarify ,
    })
}