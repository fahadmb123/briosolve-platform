import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IWalletRepository } from "../../domain/repositories/IWallet.repository";
import { WalletMapper } from "../mappers/wallet.mapper";
import { GetWalletDetailsInputDto } from "../dtos/response/get-wallet-details.dto";
import { WalletResponseDto } from "../dtos/response/wallet-response.dto";


export class GetWalletDetailsUseCase implements IUseCase<GetWalletDetailsInputDto, WalletResponseDto> {
    constructor(private readonly _walletRepository: IWalletRepository) {}

    async execute(input: GetWalletDetailsInputDto): Promise<WalletResponseDto> {
        let wallet = await this._walletRepository.findByUserId(input.userId);
        if (!wallet) {
            wallet = await this._walletRepository.createWallet(input.userId);
        }

        const limit = input.limit ?? 20;
        const offset = input.offset ?? 0;
        const { transactions, total } = await this._walletRepository.getTransactions(wallet.id, limit, offset);

        return WalletMapper.toResponseDto(wallet, transactions, total);
    }
}
