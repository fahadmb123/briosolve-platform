import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { GetBookingByIdInputDto } from "../dtos/request/get-booking.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { db } from "../../../../shared/database/client";

export class GetBookingByIdUseCase implements IUseCase<GetBookingByIdInputDto, BookingResponseDto> {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(input: GetBookingByIdInputDto): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(input.bookingId);
        if (!booking) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const providerProfile = await db.orm.public.provider_profiles
            .where({ id: booking.provider_id as never })
            .first();

        const isAuthorized =
            booking.customer_id === input.userId ||
            (providerProfile && providerProfile.user_id === input.userId);

        if (!isAuthorized) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to view this booking", "AUTHENTICATION");
        }

        let serviceRequestTitle: string | null = null;
        let providerBusinessName: string | null = null;
        let providerName: string | null = null;
        let customerName: string | null = null;

        const sr = await db.orm.public.service_requests.where({ id: booking.service_request_id as never }).first();
        if (sr) {
            serviceRequestTitle = sr.title;
        }

        if (providerProfile) {
            providerBusinessName = providerProfile.business_name;
            const pUser = await db.orm.public.users.where({ id: providerProfile.user_id as never }).first();
            if (pUser) {
                providerName = pUser.name;
            }
        }

        const cUser = await db.orm.public.users.where({ id: booking.customer_id as never }).first();
        if (cUser) {
            customerName = cUser.name;
        }

        return BookingMapper.toResponseDto(booking, {
            serviceRequestTitle,
            providerBusinessName,
            providerName,
            customerName
        });
    }
}
