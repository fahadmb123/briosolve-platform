import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Booking } from "../entities/booking.entity";
import { CreateBookingRepoDto } from "../../application/dtos/request/create-booking.dto";
import { UpdateBookingRepoDto } from "../../application/dtos/request/update-booking-status.dto";
import { GetCustomerBookingsInputDto, GetProviderBookingsInputDto } from "../../application/dtos/request/get-booking.dto";
import { BookingCountsDto } from "../../application/dtos/response/customer-bookings-response.dto";

export interface BookingDetails {
    booking: Booking;
    serviceRequestTitle: string | null;
    categoryName?: string | null;
    addressText?: string | null;
    providerBusinessName: string | null;
    providerName: string | null;
    providerPhone?: string | null;
    providerUserId?: string | null;
    customerName: string | null;
    customerPhone?: string | null;
    quotationType?: string | null;
    requiresInspection?: boolean;
}

export interface BookingListResult {
    bookings: BookingDetails[];
    total: number;
    counts: BookingCountsDto;
}

export interface IBookingRepository extends BaseRepository<Booking | null> {
    create(data: CreateBookingRepoDto): Promise<Booking | null>;
    update(id: string, data: UpdateBookingRepoDto): Promise<Booking | null>;
    findDetailsById(id: string): Promise<BookingDetails | null>;
    findByBookingNumber(bookingNumber: string): Promise<Booking | null>;
    findByQuotationId(quotationId: string): Promise<Booking | null>;
    findByServiceRequestId(serviceRequestId: string): Promise<Booking | null>;
    findByCustomerId(input: GetCustomerBookingsInputDto | string): Promise<BookingListResult | BookingDetails[]>;
    findByProviderProfileId(input: (GetProviderBookingsInputDto & { providerProfileId: string }) | string): Promise<BookingListResult | BookingDetails[]>;
}
