import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IWalletRepository } from "../../domain/repositories/IWallet.repository";
import { WalletResponseDto } from "../dtos/response/wallet-response.dto";
import { WalletMapper } from "../mappers/wallet.mapper";
import type { CreditWalletInputDto } from "../dtos/request/credit-wallet.dto";

export type { CreditWalletInputDto };

export class CreditWalletUseCase implements IUseCase<CreditWalletInputDto, WalletResponseDto> {
    constructor(private readonly _walletRepository: IWalletRepository) {}

    async execute(input: CreditWalletInputDto): Promise<WalletResponseDto> {
        if (input.amount <= 0) {
            throw new ApplicationError("INVALID_AMOUNT", "Credit amount must be greater than zero", "VALIDATION");
        }

        let wallet = await this._walletRepository.findByUserId(input.userId);
        if (!wallet) {
            wallet = await this._walletRepository.createWallet(input.userId);
        }

        const newBalance = Number((wallet.balance + input.amount).toFixed(2));
        const updatedWallet = await this._walletRepository.updateBalance(wallet.id, newBalance);

        const tx = await this._walletRepository.recordTransaction({
            walletId: wallet.id,
            bookingId: input.bookingId ?? null,
            type: "CREDIT",
            category: input.category,
            amount: input.amount,
            balanceAfter: newBalance,
            description: input.description ?? null,
            referenceId: input.referenceId ?? null
        });

        return WalletMapper.toResponseDto(updatedWallet, [tx], 1);
    }
}
