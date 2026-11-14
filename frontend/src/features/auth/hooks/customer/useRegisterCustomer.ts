import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "../../services/customer/customerRegistration.service";

export const useRegisterCustomer = () => {
    return useMutation({
        mutationFn: registerCustomer
    });
};
