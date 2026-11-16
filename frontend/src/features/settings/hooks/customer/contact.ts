import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../shared/api/ApiError";
import { updateEmail, updatePassword, updatePhone, deletePhone } from "../../services/accountSecurity.service";
import { toast } from 'react-hot-toast';
import { useAuthStore } from "../../../auth/stores/auth.store";

const notifyErrorOrInfo = (error: ApiError) => {
    toast.error(error.message);
};

export const useUpdateEmail = () => {
    return useMutation({
        mutationFn: updateEmail,
        onError: notifyErrorOrInfo,
    });
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: updatePassword,
        onError: notifyErrorOrInfo,
    });
};

export const useUpdatePhone = () => {
    return useMutation({
        mutationFn: updatePhone,
        onError: notifyErrorOrInfo,
    });
};

export const useDeletePhone = () => {
    const fetchUser = useAuthStore((state) => state.fetchUser);
    
    return useMutation({
        mutationFn: deletePhone,
        onSuccess: () => {
            fetchUser();
        },
        onError: notifyErrorOrInfo,
    });
};
