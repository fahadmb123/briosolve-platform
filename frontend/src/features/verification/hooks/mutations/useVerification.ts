import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as VerificationService from "../../services/verification.service";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';

export const useGetProviderVerifications = () => {
    return useQuery({
        queryKey: ["providerVerifications"],
        queryFn: VerificationService.getProviderVerifications,
    });
};

export const useUploadVerificationDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: VerificationService.uploadVerificationDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerVerifications"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useUpdateVerificationDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: VerificationService.updateVerificationDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerVerifications"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteVerificationDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: VerificationService.deleteVerificationDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerVerifications"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};
