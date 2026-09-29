import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "../../api/api";

export const useRegisterCustomer = () => {
    return useMutation({
        mutationFn: registerCustomer,
    });
};