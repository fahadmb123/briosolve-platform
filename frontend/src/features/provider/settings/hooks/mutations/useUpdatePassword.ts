import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";
import { updatePassword } from "../../services/auth.service";

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: updatePassword,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
