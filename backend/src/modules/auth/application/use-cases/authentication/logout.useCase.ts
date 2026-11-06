import { IUseCase } from "../../../../../shared/interfaces/use-cases/IUseCase";
import { LogoutInputDto } from "../../dtos/request/logout.dto";

export default class LogoutUseCase implements IUseCase<LogoutInputDto, void> {
    async execute(): Promise<void> {}
}
