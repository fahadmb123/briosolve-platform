import { walletRepository } from "./repositories";
import { GetWalletDetailsUseCase } from "../../application/use-cases/getWalletDetails.useCase";
import { CreditWalletUseCase } from "../../application/use-cases/creditWallet.useCase";
import { DebitWalletUseCase } from "../../application/use-cases/debitWallet.useCase";

export function createGetWalletDetailsUseCase(): GetWalletDetailsUseCase {
    return new GetWalletDetailsUseCase(walletRepository);
}

export function createCreditWalletUseCase(): CreditWalletUseCase {
    return new CreditWalletUseCase(walletRepository);
}

export function createDebitWalletUseCase(): DebitWalletUseCase {
    return new DebitWalletUseCase(walletRepository);
}
