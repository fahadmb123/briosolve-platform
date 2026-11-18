import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { CreateBookingInputDto } from "../dtos/request/create-booking.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { db } from "../../../../shared/database/client";

export class CreateBookingUseCase implements IUseCase<CreateBookingInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: CreateBookingInputDto): Promise<BookingResponseDto> {
        const existingBooking = await this._bookingRepository.findByQuotationId(input.quotationId);
        if (existingBooking) {
            return BookingMapper.toResponseDto(existingBooking);
        }

        const dateSuffix = Date.now().toString(36).toUpperCase();
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        const bookingNumber = `BK-${dateSuffix}-${randomPart}`;

        const scheduledDateObj = input.scheduledDate
            ? (input.scheduledDate instanceof Date ? input.scheduledDate : new Date(input.scheduledDate))
            : null;

        const booking = await this._bookingRepository.create({
            bookingNumber,
            serviceRequestId: input.serviceRequestId,
            quotationId: input.quotationId,
            customerId: input.customerId,
            providerId: input.providerId,
            totalAmount: input.totalAmount,
            platformFee: input.platformFee,
            status: "CONFIRMED",
            scheduledDate: scheduledDateObj,
            scheduledTime: input.scheduledTime ?? null,
            paymentId: input.paymentId ?? null,
            orderId: input.orderId ?? null,
            notes: input.notes ?? null
        });

        if (!booking) {
            throw new ApplicationError("BOOKING_CREATION_FAILED", "Failed to create booking", "INTERNAL");
        }

        let serviceRequestTitle: string | null = null;
        let providerBusinessName: string | null = null;
        let providerName: string | null = null;
        let customerName: string | null = null;

        const sr = await db.orm.public.service_requests.where({ id: input.serviceRequestId as never }).first();
        if (sr) {
            serviceRequestTitle = sr.title;
        }

        const providerProfile = await db.orm.public.provider_profiles.where({ id: input.providerId as never }).first();
        if (providerProfile) {
            providerBusinessName = providerProfile.business_name;
            const pUser = await db.orm.public.users.where({ id: providerProfile.user_id as never }).first();
            if (pUser) {
                providerName = pUser.name;
            }
        }

        const cUser = await db.orm.public.users.where({ id: input.customerId as never }).first();
        if (cUser) {
            customerName = cUser.name;
        }

        if (this._createNotificationUseCase) {
            if (providerProfile) {
                await this._createNotificationUseCase.execute({
                    recipientId: providerProfile.user_id,
                    type: "BOOKING_CREATED",
                    title: "New Booking Confirmed!",
                    title_code: "BOOKING_CREATED",
                    message: `New booking #${booking.booking_number} confirmed for "${serviceRequestTitle || "Service Request"}". Customer: ${customerName || "Customer"}. Amount: ₹${booking.total_amount}.`
                }).catch(() => null);
            }

            await this._createNotificationUseCase.execute({
                recipientId: input.customerId,
                type: "BOOKING_CONFIRMED",
                title: "Booking Confirmed!",
                title_code: "BOOKING_CONFIRMED",
                message: `Payment successful! Your booking #${booking.booking_number} with ${providerBusinessName || providerName || "Service Provider"} is confirmed with 15-day service warranty.`
            }).catch(() => null);
        }

        return BookingMapper.toResponseDto(booking, {
            serviceRequestTitle,
            providerBusinessName,
            providerName,
            customerName
        });
    }
}
