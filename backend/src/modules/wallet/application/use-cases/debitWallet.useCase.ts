import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IWalletRepository } from "../../domain/repositories/IWallet.repository";
import { WalletTransactionCategory } from "../../domain/entities/wallet-transaction.entity";
import { WalletResponseDto } from "../dtos/response/wallet-response.dto";
import { WalletMapper } from "../mappers/wallet.mapper";
import { DebitWalletInputDto } from "../dtos/request/debit-wallet.dto";



export class DebitWalletUseCase implements IUseCase<DebitWalletInputDto, WalletResponseDto> {
    constructor(private readonly _walletRepository: IWalletRepository) {}

    async execute(input: DebitWalletInputDto): Promise<WalletResponseDto> {
        if (input.amount <= 0) {
            throw new ApplicationError("INVALID_AMOUNT", "Debit amount must be greater than zero", "VALIDATION");
        }

        let wallet = await this._walletRepository.findByUserId(input.userId);
        if (!wallet) {
            wallet = await this._walletRepository.createWallet(input.userId);
        }

        if (wallet.balance < input.amount) {
            throw new ApplicationError("INSUFFICIENT_FUNDS", "Insufficient wallet balance", "VALIDATION");
        }

        const newBalance = Number((wallet.balance - input.amount).toFixed(2));
        const updatedWallet = await this._walletRepository.updateBalance(wallet.id, newBalance);

        const tx = await this._walletRepository.recordTransaction({
            walletId: wallet.id,
            bookingId: input.bookingId ?? null,
            type: "DEBIT",
            category: input.category,
            amount: input.amount,
            balanceAfter: newBalance,
            description: input.description ?? null,
            referenceId: input.referenceId ?? null
        });

        return WalletMapper.toResponseDto(updatedWallet, [tx], 1);
    }
}
