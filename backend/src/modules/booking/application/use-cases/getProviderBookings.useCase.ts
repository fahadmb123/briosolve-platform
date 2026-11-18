import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { GetProviderBookingsInputDto } from "../dtos/request/get-booking.dto";
import { ProviderBookingsResponseDto } from "../dtos/response/provider-bookings-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { db } from "../../../../shared/database/client";

export class GetProviderBookingsUseCase implements IUseCase<GetProviderBookingsInputDto, ProviderBookingsResponseDto> {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(input: GetProviderBookingsInputDto): Promise<ProviderBookingsResponseDto> {
        let providerProfileId = input.providerId;

        const profile = await db.orm.public.provider_profiles
            .where({ user_id: input.providerId as never })
            .first();

        if (profile) {
            providerProfileId = profile.id;
        }

        const bookings = await this._bookingRepository.findByProviderId(providerProfileId);

        const dtoList = await Promise.all(
            bookings.map(async (b) => {
                let serviceRequestTitle: string | null = null;
                let customerName: string | null = null;

                const sr = await db.orm.public.service_requests.where({ id: b.service_request_id as never }).first();
                if (sr) {
                    serviceRequestTitle = sr.title;
                }

                const cUser = await db.orm.public.users.where({ id: b.customer_id as never }).first();
                if (cUser) {
                    customerName = cUser.name;
                }

                return BookingMapper.toResponseDto(b, {
                    serviceRequestTitle,
                    customerName
                });
            })
        );

        return BookingMapper.toProviderBookingsResponseDto(dtoList);
    }
}
