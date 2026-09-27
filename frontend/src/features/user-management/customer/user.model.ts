import { useMutation } from "@tanstack/react-query";
import { getCustomers } from "./api";



export const useGetCustomers = () => {
    return useMutation({
        mutationFn:getCustomers ,
    });
};