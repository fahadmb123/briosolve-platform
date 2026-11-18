import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { GetCustomerBookingsInputDto } from "../dtos/request/get-booking.dto";
import { CustomerBookingsResponseDto } from "../dtos/response/customer-bookings-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { db } from "../../../../shared/database/client";

export class GetCustomerBookingsUseCase implements IUseCase<GetCustomerBookingsInputDto, CustomerBookingsResponseDto> {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(input: GetCustomerBookingsInputDto): Promise<CustomerBookingsResponseDto> {
        const bookings = await this._bookingRepository.findByCustomerId(input.customerId);

        const dtoList = await Promise.all(
            bookings.map(async (b) => {
                let serviceRequestTitle: string | null = null;
                let providerBusinessName: string | null = null;
                let providerName: string | null = null;

                const sr = await db.orm.public.service_requests.where({ id: b.service_request_id as never }).first();
                if (sr) {
                    serviceRequestTitle = sr.title;
                }

                const providerProfile = await db.orm.public.provider_profiles
                    .where({ id: b.provider_id as never })
                    .first();
                if (providerProfile) {
                    providerBusinessName = providerProfile.business_name;
                    const pUser = await db.orm.public.users.where({ id: providerProfile.user_id as never }).first();
                    if (pUser) {
                        providerName = pUser.name;
                    }
                }

                return BookingMapper.toResponseDto(b, {
                    serviceRequestTitle,
                    providerBusinessName,
                    providerName
                });
            })
        );

        return BookingMapper.toCustomerBookingsResponseDto(dtoList);
    }
}
