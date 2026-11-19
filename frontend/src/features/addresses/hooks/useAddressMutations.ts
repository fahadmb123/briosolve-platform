import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAddress, deleteAddress, editAddress, getAddresses, setDefaultAddress, type getAddressesInput } from "../services/address.service";
import type { ApiError } from "../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useAddAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useEditAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useGetAddresses = (params?: Partial<getAddressesInput>) => {
    return useQuery({
        queryKey: ["addresses", params],
        queryFn: () => getAddresses({ page: params?.page ?? 1, limit: params?.limit ?? 10, search: params?.search ?? "" }),
    });
};

export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setDefaultAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};
