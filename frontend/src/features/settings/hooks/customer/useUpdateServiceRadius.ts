import { useMutation } from "@tanstack/react-query";
import { updateServiceRadius } from "../../services/accountSecurity.service";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useUpdateServiceRadius = () => {
    return useMutation({
        mutationFn: updateServiceRadius,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
