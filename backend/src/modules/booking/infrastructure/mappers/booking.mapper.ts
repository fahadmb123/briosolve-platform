import { Temporal } from "@js-temporal/polyfill";
import { Booking, BookingStatus, BookingPaymentStatus } from "../../domain/entities/booking.entity";
import { BookingDetails, BookingListResult, CancellationPolicyDetails } from "../../domain/repositories/IBookingRepository";
import { CreateBookingInputDto, CreateBookingRepoDto } from "../../application/dtos/request/create-booking.dto";
import { UpdateBookingRepoDto } from "../../application/dtos/request/update-booking-status.dto";
import { BookingResponseDto, BookingStatusHistoryItem } from "../../application/dtos/response/booking-response.dto";
import { CustomerBookingsResponseDto, BookingCountsDto } from "../../application/dtos/response/customer-bookings-response.dto";
import { ProviderBookingsResponseDto } from "../../application/dtos/response/provider-bookings-response.dto";

export const BookingStatusToTitle = {
    "CONFIRMED": "Confirmed",
    "EN_ROUTE": "On the way",
    "INSPECTION": "Inspection finished",
    "IN_PROGRESS": "In the progress",
    "PAYMENT_PENDING": "Payment Pending",
    "COMPLETED": "Completed",
    "CANCELLED": "Cancelled"
};

export function calculateCancellationPolicy(params: {
    role: "CUSTOMER" | "PROVIDER";
    status: BookingStatus;
    quotationType?: string | null;
    advancePaid: number;
    cancellationsUsed: number;
    maxAllowedCancellations?: number;
}): CancellationPolicyDetails {
    const maxAllowed = params.maxAllowedCancellations ?? 2;
    const advance = Math.max(0, params.advancePaid);

    if (params.role === "PROVIDER") {
        return {
            cancellationsUsed: params.cancellationsUsed,
            maxAllowedCancellations: maxAllowed,
            totalAdvancePaid: advance,
            refundableAmount: advance,
            cancellationFee: 0,
            isFullRefund: true,
            policyStatus: params.cancellationsUsed >= maxAllowed
                ? "LIMIT_EXCEEDED"
                : params.cancellationsUsed === 1
                    ? "FINAL_FREE_CANCELLATION"
                    : "FREE_CANCELLATION",
            policyMessage: params.cancellationsUsed >= maxAllowed
                ? "You have reached your 2-cancellation limit."
                : params.cancellationsUsed === 1
                    ? "This is your final permitted cancellation."
                    : "This will be recorded as your 1st cancellation (maximum 2 allowed)."
        };
    }

    if (params.status === "EN_ROUTE") {
        const isFixed = params.quotationType === "FIXED";
        const fee = isFixed
            ? Math.min(advance, Math.max(100, Math.round(advance * 0.3)))
            : advance;
        const refund = Math.max(0, advance - fee);
        return {
            cancellationsUsed: params.cancellationsUsed,
            maxAllowedCancellations: maxAllowed,
            totalAdvancePaid: advance,
            refundableAmount: refund,
            cancellationFee: fee,
            isFullRefund: refund === advance,
            policyStatus: "EN_ROUTE_FEE",
            policyMessage: isFixed
                ? `Technician is on the way. A travel fee of ₹${fee.toLocaleString("en-IN")} will be deducted, and ₹${refund.toLocaleString("en-IN")} will be refunded to your wallet.`
                : `Technician is on the way. The visiting fee of ₹${fee.toLocaleString("en-IN")} is non-refundable to compensate the technician's travel.`
        };
    }

    if (params.cancellationsUsed >= maxAllowed) {
        const isFixed = params.quotationType === "FIXED";
        const fee = isFixed
            ? Math.round(advance * 0.5)
            : advance;
        const refund = Math.max(0, advance - fee);
        return {
            cancellationsUsed: params.cancellationsUsed,
            maxAllowedCancellations: maxAllowed,
            totalAdvancePaid: advance,
            refundableAmount: refund,
            cancellationFee: fee,
            isFullRefund: false,
            policyStatus: "LIMIT_EXCEEDED",
            policyMessage: isFixed
                ? `You have exceeded your 2 free cancellations. A 50% cancellation fee of ₹${fee.toLocaleString("en-IN")} is deducted, and ₹${refund.toLocaleString("en-IN")} will be refunded.`
                : `You have exceeded your 2 free cancellations. The advance payment of ₹${advance.toLocaleString("en-IN")} is non-refundable to compensate the technician.`
        };
    }

    if (params.cancellationsUsed === 1) {
        return {
            cancellationsUsed: 1,
            maxAllowedCancellations: maxAllowed,
            totalAdvancePaid: advance,
            refundableAmount: advance,
            cancellationFee: 0,
            isFullRefund: true,
            policyStatus: "FINAL_FREE_CANCELLATION",
            policyMessage: `This is your 2nd and final free cancellation. You will receive a 100% full refund of ₹${advance.toLocaleString("en-IN")}. Future cancellations will incur non-refundable deductions.`
        };
    }

    return {
        cancellationsUsed: 0,
        maxAllowedCancellations: maxAllowed,
        totalAdvancePaid: advance,
        refundableAmount: advance,
        cancellationFee: 0,
        isFullRefund: true,
        policyStatus: "FREE_CANCELLATION",
        policyMessage: `You have 1 free cancellation remaining. You will receive a 100% full refund of ₹${advance.toLocaleString("en-IN")} into your wallet.`
    };
}

export class BookingMapper {
    static toCreateRepoDto(data: {
        serviceRequestId: string;
        quotationId: string;
        customerId: string;
        providerId: string;
        totalAmount?: number;
        amount?: number;
        platformFee?: number;
        scheduledDate?: Date | string | null;
        scheduledTime?: string | null;
        paymentId?: string | null;
        orderId?: string | null;
        notes?: string | null;
    }): CreateBookingRepoDto {
        const baseAmount = data.amount ?? (data.totalAmount ? Math.round(data.totalAmount / 1.1) : 0);
        const platformFee = data.platformFee ?? Math.round(baseAmount * 0.1);
        const totalAmount = data.totalAmount ?? (baseAmount + platformFee);
        const advanceAmount = Math.round(totalAmount * 0.3);

        const dateSuffix = Date.now().toString(36).toUpperCase();
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        const bookingNumber = `BK-${dateSuffix}-${randomPart}`;

        const scheduledDateObj = data.scheduledDate
            ? (data.scheduledDate instanceof Date ? data.scheduledDate : new Date(data.scheduledDate))
            : null;

        return {
            bookingNumber,
            serviceRequestId: data.serviceRequestId,
            quotationId: data.quotationId,
            customerId: data.customerId,
            providerId: data.providerId,
            totalAmount,
            platformFee,
            advanceAmount,
            status: "CONFIRMED",
            paymentStatus: "ADVANCE_PAID",
            scheduledDate: scheduledDateObj,
            scheduledTime: data.scheduledTime ?? null,
            paymentId: data.paymentId ?? null,
            orderId: data.orderId ?? null,
            notes: data.notes ?? null
        };
    }

    static fromInputToCreateRepoDto(input: CreateBookingInputDto): CreateBookingRepoDto {
        return this.toCreateRepoDto(input);
    }

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
            updatedDate,
            (record.payment_status as BookingPaymentStatus) || (record.status === "COMPLETED" ? "PAID" : record.status === "CANCELLED" ? "REFUNDED" : "ADVANCE_PAID"),
            record.advance_amount !== undefined && record.advance_amount !== null && Number(record.advance_amount) > 0
                ? Number(record.advance_amount)
                : Number(record.total_amount)
        );
    }

    static toResponseDto(
        source: BookingDetails | Booking,
        extra?: {
            serviceRequestTitle?: string | null;
            providerBusinessName?: string | null;
            providerName?: string | null;
            providerUserId?: string | null;
            customerName?: string | null;
            quotationType?: string | null;
            requiresInspection?: boolean;
            statusHistory?: BookingStatusHistoryItem[];
            providerCancellationsCount?: number;
            maxAllowedCancellations?: number;
            cancellationPolicy?: CancellationPolicyDetails;
        }
    ): BookingResponseDto {
        const isDetails = "booking" in source;
        const entity: Booking = isDetails ? source.booking : source;
        const details = isDetails ? source : null;

        let parsedHistory: BookingStatusHistoryItem[] | undefined = undefined;
        let displayNotes = entity.notes;

        if (entity.notes) {
            try {
                const parsed = JSON.parse(entity.notes);
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object" && "status" in parsed[0]) {
                    parsedHistory = parsed;
                    const latest = parsed[parsed.length - 1];
                    displayNotes = latest.note;
                }
            } catch {
                parsedHistory = undefined;
                displayNotes = entity.notes;
            }
        }

        const isFixed = (details?.quotationType ?? extra?.quotationType) === "FIXED";
        const isFinalConfirmed = isFixed || entity.status === "PAYMENT_PENDING" || entity.status === "COMPLETED";

        const resolvedAdvance = isFixed
            ? entity.total_amount
            : (details?.quoteAmount
                ? Math.round(Number(details.quoteAmount) * 1.1)
                : (entity.advance_amount && entity.advance_amount > 0 ? entity.advance_amount : entity.total_amount));

        const resolvedRemaining = isFixed
            ? 0
            : isFinalConfirmed
                ? Math.max(0, entity.total_amount - resolvedAdvance)
                : 0;

        const resolvedPaymentStatus = isFixed || entity.status === "COMPLETED"
            ? "PAID"
            : (entity.payment_status || "ADVANCE_PAID");

        return {
            id: entity.id,
            bookingNumber: entity.booking_number,
            serviceRequestId: entity.service_request_id,
            quotationId: entity.quotation_id,
            customerId: entity.customer_id,
            providerId: entity.provider_id,
            totalAmount: entity.total_amount,
            platformFee: entity.platform_fee,
            advanceAmount: resolvedAdvance,
            remainingAmount: resolvedRemaining,
            status: entity.status,
            paymentStatus: resolvedPaymentStatus,
            scheduledDate: entity.scheduled_date ? entity.scheduled_date.toISOString() : null,
            scheduledTime: entity.scheduled_time,
            paymentId: entity.payment_id,
            orderId: entity.order_id,
            notes: displayNotes,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString(),
            serviceRequestTitle: details?.serviceRequestTitle ?? extra?.serviceRequestTitle ?? null,
            categoryName: details?.categoryName ?? null,
            addressText: details?.addressText ?? null,
            providerBusinessName: details?.providerBusinessName ?? extra?.providerBusinessName ?? null,
            providerName: details?.providerName ?? extra?.providerName ?? null,
            providerPhone: details?.providerPhone ?? null,
            providerUserId: details?.providerUserId ?? extra?.providerUserId ?? null,
            customerName: details?.customerName ?? extra?.customerName ?? null,
            customerPhone: details?.customerPhone ?? null,
            quotationType: details?.quotationType ?? extra?.quotationType ?? null,
            requiresInspection: details?.requiresInspection ?? extra?.requiresInspection ?? false,
            quoteAmount: details?.quoteAmount ?? null,
            isFinalConfirmed,
            statusHistory: parsedHistory || details?.statusHistory,
            providerCancellationsCount: details?.providerCancellationsCount ?? extra?.providerCancellationsCount ?? 0,
            maxAllowedCancellations: details?.maxAllowedCancellations ?? extra?.maxAllowedCancellations ?? 2,
            cancellationPolicy: details?.cancellationPolicy ?? extra?.cancellationPolicy ?? calculateCancellationPolicy({
                role: "CUSTOMER",
                status: entity.status,
                quotationType: details?.quotationType ?? extra?.quotationType ?? null,
                advancePaid: resolvedAdvance,
                cancellationsUsed: details?.providerCancellationsCount ?? extra?.providerCancellationsCount ?? 0,
                maxAllowedCancellations: details?.maxAllowedCancellations ?? extra?.maxAllowedCancellations ?? 2
            })
        };
    }

    static toCustomerBookingsResponseDto(
        input: BookingListResult | BookingDetails[]
    ): CustomerBookingsResponseDto {
        if (Array.isArray(input)) {
            const counts: BookingCountsDto = {
                ALL: input.length,
                CONFIRMED: input.filter((b) => b.booking.status === "CONFIRMED").length,
                EN_ROUTE: input.filter((b) => b.booking.status === "EN_ROUTE").length,
                INSPECTION: input.filter((b) => b.booking.status === "INSPECTION").length,
                IN_PROGRESS: input.filter((b) => b.booking.status === "IN_PROGRESS").length,
                PAYMENT_PENDING: input.filter((b) => b.booking.status === "PAYMENT_PENDING").length,
                COMPLETED: input.filter((b) => b.booking.status === "COMPLETED").length,
                CANCELLED: input.filter((b) => b.booking.status === "CANCELLED").length
            };
            return {
                bookings: input.map((item) => this.toResponseDto(item)),
                total: input.length,
                counts
            };
        }
        return {
            bookings: input.bookings.map((item) => this.toResponseDto(item)),
            total: input.total,
            counts: input.counts
        };
    }

    static toProviderBookingsResponseDto(
        input: BookingListResult | BookingDetails[]
    ): ProviderBookingsResponseDto {
        if (Array.isArray(input)) {
            const counts: BookingCountsDto = {
                ALL: input.length,
                CONFIRMED: input.filter((b) => b.booking.status === "CONFIRMED").length,
                EN_ROUTE: input.filter((b) => b.booking.status === "EN_ROUTE").length,
                INSPECTION: input.filter((b) => b.booking.status === "INSPECTION").length,
                IN_PROGRESS: input.filter((b) => b.booking.status === "IN_PROGRESS").length,
                PAYMENT_PENDING: input.filter((b) => b.booking.status === "PAYMENT_PENDING").length,
                COMPLETED: input.filter((b) => b.booking.status === "COMPLETED").length,
                CANCELLED: input.filter((b) => b.booking.status === "CANCELLED").length
            };
            return {
                bookings: input.map((item) => this.toResponseDto(item)),
                total: input.length,
                counts
            };
        }
        return {
            bookings: input.bookings.map((item) => this.toResponseDto(item)),
            total: input.total,
            counts: input.counts
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
            advance_amount: (data.advanceAmount !== undefined ? data.advanceAmount : data.totalAmount).toString(),
            status: data.status || "CONFIRMED",
            payment_status: data.paymentStatus || "ADVANCE_PAID",
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
        if (data.paymentStatus) {
            payload.payment_status = data.paymentStatus;
        }
        if (data.totalAmount !== undefined) {
            payload.total_amount = data.totalAmount.toString();
            payload.platform_fee = Math.round(data.totalAmount * 0.1).toString();
        }
        if (data.notes !== undefined) {
            payload.notes = data.notes;
        }
        return payload;
    }
}
