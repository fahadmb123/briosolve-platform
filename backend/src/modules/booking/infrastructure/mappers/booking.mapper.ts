import { Temporal } from "@js-temporal/polyfill";
import { Booking, BookingStatus } from "../../domain/entities/booking.entity";
import { CreateBookingRepoDto } from "../../application/dtos/request/create-booking.dto";
import { UpdateBookingRepoDto } from "../../application/dtos/request/update-booking-status.dto";
import { BookingResponseDto } from "../../application/dtos/response/booking-response.dto";
import { CustomerBookingsResponseDto } from "../../application/dtos/response/customer-bookings-response.dto";
import { ProviderBookingsResponseDto } from "../../application/dtos/response/provider-bookings-response.dto";

export class BookingMapper {
    static toDomain(record: any): Booking {
        const parseDate = (val: any): Date => {
            if (!val) return new Date();
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                const epoch = (val as { epochMilliseconds: bigint | number }).epochMilliseconds;
                return new Date(Number(epoch));
            }
            return new Date(val);
        };

        const parseNullableDate = (val: any): Date | null => {
            if (!val) return null;
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                const epoch = (val as { epochMilliseconds: bigint | number }).epochMilliseconds;
                return new Date(Number(epoch));
            }
            return new Date(val);
        };

        const createdDate = parseDate(record.created_at);
        const updatedDate = parseDate(record.updated_at);
        const scheduledDate = parseNullableDate(record.scheduled_date);

        return new Booking(
            record.id,
            record.booking_number,
            record.service_request_id,
            record.quotation_id,
            record.customer_id,
            record.provider_id,
            Number(record.total_amount),
            Number(record.platform_fee),
            record.status as BookingStatus,
            scheduledDate,
            record.scheduled_time ?? null,
            record.payment_id ?? null,
            record.order_id ?? null,
            record.notes ?? null,
            createdDate,
            updatedDate
        );
    }

    static toResponseDto(
        entity: Booking,
        extra?: {
            serviceRequestTitle?: string | null;
            providerBusinessName?: string | null;
            providerName?: string | null;
            customerName?: string | null;
        }
    ): BookingResponseDto {
        return {
            id: entity.id,
            bookingNumber: entity.booking_number,
            serviceRequestId: entity.service_request_id,
            quotationId: entity.quotation_id,
            customerId: entity.customer_id,
            providerId: entity.provider_id,
            totalAmount: entity.total_amount,
            platformFee: entity.platform_fee,
            status: entity.status,
            scheduledDate: entity.scheduled_date ? entity.scheduled_date.toISOString() : null,
            scheduledTime: entity.scheduled_time,
            paymentId: entity.payment_id,
            orderId: entity.order_id,
            notes: entity.notes,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
            serviceRequestTitle: extra?.serviceRequestTitle ?? null,
            providerBusinessName: extra?.providerBusinessName ?? null,
            providerName: extra?.providerName ?? null,
            customerName: extra?.customerName ?? null
        };
    }

    static toCustomerBookingsResponseDto(items: BookingResponseDto[]): CustomerBookingsResponseDto {
        return {
            bookings: items,
            total: items.length
        };
    }

    static toProviderBookingsResponseDto(items: BookingResponseDto[]): ProviderBookingsResponseDto {
        return {
            bookings: items,
            total: items.length
        };
    }

    static toPersistence(data: CreateBookingRepoDto): any {
        let scheduledInstant: any = null;
        if (data.scheduledDate) {
            const dateObj = data.scheduledDate instanceof Date ? data.scheduledDate : new Date(data.scheduledDate);
            scheduledInstant = Temporal.Instant.fromEpochMilliseconds(dateObj.getTime());
        }

        return {
            booking_number: data.bookingNumber,
            service_request_id: data.serviceRequestId,
            quotation_id: data.quotationId,
            customer_id: data.customerId,
            provider_id: data.providerId,
            total_amount: data.totalAmount.toString(),
            platform_fee: data.platformFee.toString(),
            status: data.status || "CONFIRMED",
            scheduled_date: scheduledInstant,
            scheduled_time: data.scheduledTime ?? null,
            payment_id: data.paymentId ?? null,
            order_id: data.orderId ?? null,
            notes: data.notes ?? null
        };
    }

    static toUpdatePersistence(data: UpdateBookingRepoDto): any {
        const payload: any = {};
        if (data.status) {
            payload.status = data.status;
        }
        if (data.notes !== undefined) {
            payload.notes = data.notes;
        }
        return payload;
    }
}
