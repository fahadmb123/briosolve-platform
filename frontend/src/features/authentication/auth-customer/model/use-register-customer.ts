import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "../api";

export const useRegisterCustomer = () => {
    return useMutation({
        mutationFn: registerCustomer,
    });
};