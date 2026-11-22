import { useQuery } from "@tanstack/react-query";
import { getMyWallet } from "../services/wallet.service";

export const useGetMyWallet = (limit: number = 50, offset: number = 0, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["myWallet", limit, offset],
    queryFn: () => getMyWallet(limit, offset),
    enabled: options?.enabled ?? true
  });
};
