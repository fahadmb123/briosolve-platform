import { useMutation } from "@tanstack/react-query";
import { getCustomers, updateStatus } from "./api";



export const useGetCustomers = () => {
    return useMutation({
        mutationFn:getCustomers ,
    });
}
export const useUpdateStatus = () => {
    return useMutation({
        mutationFn:updateStatus ,
    });
}