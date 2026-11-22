import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { WalletRouteDependencies } from "../types/wallet.route.dependencies";

export function buildWalletRoute(dependencies: WalletRouteDependencies): Router {
    const router = Router()

    router.get("/me", authMiddleware, dependencies.wallet.getMyWallet);

    return router;
}
