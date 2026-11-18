import { db } from "../../../../shared/database/client";
import { Booking } from "../../domain/entities/booking.entity";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
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

    async findByCustomerId(customerId: string): Promise<Booking[]> {
        const records = await db.orm.public.bookings
            .where({ customer_id: customerId as never })
            .all();

        return records.map((r: any) => BookingMapper.toDomain(r));
    }

    async findByProviderId(providerId: string): Promise<Booking[]> {
        const records = await db.orm.public.bookings
            .where({ provider_id: providerId as never })
            .all();

        return records.map((r: any) => BookingMapper.toDomain(r));
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
}
