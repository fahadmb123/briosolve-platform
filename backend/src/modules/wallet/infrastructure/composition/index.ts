import { buildWalletRoute } from "../../presentation/routes/wallet.routes";
import { createWalletController } from "./controller";

export function createWalletRoutes() {
    const walletController = createWalletController();
    return buildWalletRoute({
        wallet: walletController
    });
}

export * from "./repositories";
export * from "./useCases";
export * from "./controller";
