import { WalletController } from "../../presentation/controller/wallet.controller";
import { createGetWalletDetailsUseCase } from "./useCases";

export function createWalletController(): WalletController {
    const getWalletDetailsUseCase = createGetWalletDetailsUseCase();
    return new WalletController(getWalletDetailsUseCase);
}
