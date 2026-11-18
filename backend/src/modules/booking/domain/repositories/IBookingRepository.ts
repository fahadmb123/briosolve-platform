import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Booking } from "../entities/booking.entity";
import { CreateBookingRepoDto } from "../../application/dtos/request/create-booking.dto";
import { UpdateBookingRepoDto } from "../../application/dtos/request/update-booking-status.dto";

export interface BookingDetails {
    booking: Booking;
    serviceRequestTitle: string | null;
    providerBusinessName: string | null;
    providerName: string | null;
    customerName: string | null;
}

export interface IBookingRepository extends BaseRepository<Booking | null> {
    create(data: CreateBookingRepoDto): Promise<Booking | null>;
    update(id: string, data: UpdateBookingRepoDto): Promise<Booking | null>;
    findDetailsById(id: string): Promise<BookingDetails | null>;
    findByBookingNumber(bookingNumber: string): Promise<Booking | null>;
    findByQuotationId(quotationId: string): Promise<Booking | null>;
    findByServiceRequestId(serviceRequestId: string): Promise<Booking | null>;
    findByCustomerId(customerId: string): Promise<BookingDetails[]>;
    findByProviderProfileId(providerProfileId: string): Promise<BookingDetails[]>;
}
