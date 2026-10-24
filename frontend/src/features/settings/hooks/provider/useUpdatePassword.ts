import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';
import { updatePassword } from "../../services/providerAuth.service";

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: updatePassword,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
