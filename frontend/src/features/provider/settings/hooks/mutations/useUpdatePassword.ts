import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: updatePassword,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
