import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { WalletData } from "../types/wallet.types";

export const getMyWallet = async (limit: number = 50, offset: number = 0): Promise<response<WalletData>> => {
  const res = await apiClient.get<response<WalletData>>("/api/wallet/me", {
    params: { limit, offset }
  });
  return res.data;
};
