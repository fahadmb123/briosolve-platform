import { useMutation } from "@tanstack/react-query";
import { submitReactivationRequest } from "../../services/reactivation.service";

export const useAccountReactivation = () => {
    return useMutation({
        mutationFn: submitReactivationRequest
    });
};
