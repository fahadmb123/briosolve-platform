import { db } from "../../../../shared/database/client";
import { Booking } from "../../domain/entities/booking.entity";
import { IBookingRepository, BookingDetails } from "../../domain/repositories/IBookingRepository";
import { CreateBookingRepoDto } from "../../application/dtos/request/create-booking.dto";
import { UpdateBookingRepoDto } from "../../application/dtos/request/update-booking-status.dto";
import { BookingMapper } from "../mappers/booking.mapper";

export class PrismaBookingRepository implements IBookingRepository {
    async findById(id: string): Promise<Booking | null> {
        const record = await db.orm.public.bookings
            .where({ id: id as never })
            .first();

        if (!record) return null;
        return BookingMapper.toDomain(record);
    }

    async findDetailsById(id: string): Promise<BookingDetails | null> {
        const record = await db.orm.public.bookings
            .where({ id: id as never })
            .first();

        if (!record) return null;
        const booking = BookingMapper.toDomain(record);

        const details = await this.populateDetails([booking]);
        return details[0] || {
            booking,
            serviceRequestTitle: null,
            providerBusinessName: null,
            providerName: null,
            customerName: null
        };
    }

    async findByBookingNumber(bookingNumber: string): Promise<Booking | null> {
        const record = await db.orm.public.bookings
            .where({ booking_number: bookingNumber as never })
            .first();

        if (!record) return null;
        return BookingMapper.toDomain(record);
    }

    async findByQuotationId(quotationId: string): Promise<Booking | null> {
        const record = await db.orm.public.bookings
            .where({ quotation_id: quotationId as never })
            .first();

        if (!record) return null;
        return BookingMapper.toDomain(record);
    }

    async findByServiceRequestId(serviceRequestId: string): Promise<Booking | null> {
        const record = await db.orm.public.bookings
            .where({ service_request_id: serviceRequestId as never })
            .first();

        if (!record) return null;
        return BookingMapper.toDomain(record);
    }

    async findByCustomerId(customerId: string): Promise<BookingDetails[]> {
        const records = await db.orm.public.bookings
            .where({ customer_id: customerId as never })
            .all();

        const bookings = records.map((r: any) => BookingMapper.toDomain(r));
        return this.populateDetails(bookings);
    }

    async findByProviderProfileId(providerProfileId: string): Promise<BookingDetails[]> {
        const records = await db.orm.public.bookings
            .where({ provider_id: providerProfileId as never })
            .all();

        const bookings = records.map((r: any) => BookingMapper.toDomain(r));
        return this.populateDetails(bookings);
    }

    async create(data: CreateBookingRepoDto): Promise<Booking | null> {
        const persistence = BookingMapper.toPersistence(data);
        const created = await db.orm.public.bookings.create(persistence as never);

        if (!created) return null;
        return BookingMapper.toDomain(created);
    }

    async update(id: string, data: UpdateBookingRepoDto): Promise<Booking | null> {
        const persistence = BookingMapper.toUpdatePersistence(data);
        const updated = await db.orm.public.bookings
            .where({ id: id as never })
            .update(persistence as never);

        if (!updated) return null;
        return BookingMapper.toDomain(updated);
    }

    private async populateDetails(bookings: Booking[]): Promise<BookingDetails[]> {
        if (bookings.length === 0) return [];

        return Promise.all(
            bookings.map(async (booking) => {
                let serviceRequestTitle: string | null = null;
                let providerBusinessName: string | null = null;
                let providerName: string | null = null;
                let customerName: string | null = null;

                const sr = await db.orm.public.service_requests
                    .where({ id: booking.service_request_id as never })
                    .first();
                if (sr) {
                    serviceRequestTitle = sr.title;
                }

                const providerProfile = await db.orm.public.provider_profiles
                    .where({ id: booking.provider_id as never })
                    .first();
                if (providerProfile) {
                    providerBusinessName = providerProfile.business_name;
                    const pUser = await db.orm.public.users
                        .where({ id: providerProfile.user_id as never })
                        .first();
                    if (pUser) {
                        providerName = pUser.name;
                    }
                }

                const cUser = await db.orm.public.users
                    .where({ id: booking.customer_id as never })
                    .first();
                if (cUser) {
                    customerName = cUser.name;
                }

                return {
                    booking,
                    serviceRequestTitle,
                    providerBusinessName,
                    providerName,
                    customerName
                };
            })
        );
    }
}
