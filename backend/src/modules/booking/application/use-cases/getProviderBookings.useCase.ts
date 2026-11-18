import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { GetProviderBookingsInputDto } from "../dtos/request/get-booking.dto";
import { ProviderBookingsResponseDto } from "../dtos/response/provider-bookings-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";

export class GetProviderBookingsUseCase implements IUseCase<GetProviderBookingsInputDto, ProviderBookingsResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository
    ) {}

    async execute(input: GetProviderBookingsInputDto): Promise<ProviderBookingsResponseDto> {
        const profile = await this._providerRepository.findProfileByUserId(input.providerId);
        if (!profile) {
            return BookingMapper.toProviderBookingsResponseDto([]);
        }

        const detailsList = await this._bookingRepository.findByProviderProfileId(profile.id);
        return BookingMapper.toProviderBookingsResponseDto(detailsList);
    }
}
