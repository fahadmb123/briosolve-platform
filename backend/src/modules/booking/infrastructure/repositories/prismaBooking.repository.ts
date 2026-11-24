import { db } from "../../../../shared/database/client";
import { Booking } from "../../domain/entities/booking.entity";
import {
    IBookingRepository,
    BookingDetails,
    BookingListResult,
    GetAdminBookingsInputDto,
    AdminBookingListResult
} from "../../domain/repositories/IBookingRepository";
import { CreateBookingRepoDto } from "../../application/dtos/request/create-booking.dto";
import { UpdateBookingRepoDto } from "../../application/dtos/request/update-booking-status.dto";
import { GetCustomerBookingsInputDto, GetProviderBookingsInputDto } from "../../application/dtos/request/get-booking.dto";
import { BookingCountsDto } from "../../application/dtos/response/customer-bookings-response.dto";
import { BookingMapper } from "../../application/mappers/booking.mapper";

export class PrismaBookingRepository implements IBookingRepository {
    async findById(id: string): Promise<Booking | null> {
        const record = await db.orm.public.bookings
            .where({ id: id as never })
            .first();

        if (!record) return null;
        return BookingMapper.toDomain(record);
    }

    async findDetailsById(id: string): Promise<BookingDetails | null> {
        try {
            const record = await db.orm.public.bookings
                .where({ id: id as never })
                .first();

            if (!record) return null;
            const booking = BookingMapper.toDomain(record);

            const details = await this.populateDetails([booking]);
            const cancellationsCount = await this.countProviderCancellations(booking.provider_id);
            const detail = details[0] || {
                booking,
                serviceRequestTitle: null,
                providerBusinessName: null,
                providerName: null,
                customerName: null,
                quotationType: null,
                requiresInspection: false,
                statusHistory: undefined
            };
            detail.providerCancellationsCount = cancellationsCount;
            detail.maxAllowedCancellations = 2;
            return detail;
        } catch {
            return null;
        }
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

    async findByCustomerId(
        input: GetCustomerBookingsInputDto | string
    ): Promise<BookingListResult> {
        const customerId = typeof input === "string" ? input : input.customerId;
        const page = typeof input === "object" && input.page ? Number(input.page) : 1;
        const limit = typeof input === "object" && input.limit ? Number(input.limit) : 50;
        const search = typeof input === "object" ? input.search : undefined;
        const status = typeof input === "object" ? input.status : undefined;
        const skip = (page - 1) * limit;

        const statusRows = await db.orm.public.bookings
            .where({ customer_id: customerId as never })
            .select("status")
            .all();

        const counts: BookingCountsDto = {
            ALL: statusRows.length,
            CONFIRMED: statusRows.filter((b: any) => b.status === "CONFIRMED").length,
            EN_ROUTE: statusRows.filter((b: any) => b.status === "EN_ROUTE").length,
            INSPECTION: statusRows.filter((b: any) => b.status === "INSPECTION").length,
            IN_PROGRESS: statusRows.filter((b: any) => b.status === "IN_PROGRESS").length,
            PAYMENT_PENDING: statusRows.filter((b: any) => b.status === "PAYMENT_PENDING").length,
            COMPLETED: statusRows.filter((b: any) => b.status === "COMPLETED").length,
            CLOSED: statusRows.filter((b: any) => b.status === "CLOSED").length,
            CANCELLED: statusRows.filter((b: any) => b.status === "CANCELLED").length
        };

        let query = db.orm.public.bookings.where({ customer_id: customerId as never });

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (search && search.trim()) {
            const trimmed = search.trim();
            const term = `%${trimmed}%`;
            if (trimmed.toUpperCase().startsWith("BK")) {
                query = query.where((b) => b.booking_number.ilike(term));
            } else {
                const matchingSrs = await db.orm.public.service_requests
                    .where({ customer_id: customerId as never })
                    .where((sr) => sr.title.ilike(term))
                    .select("id")
                    .all();
                const srIds = matchingSrs.map((s) => s.id);
                if (srIds.length > 0) {
                    query = query.where((b) => b.service_request_id.in(srIds));
                } else {
                    query = query.where((b) => b.booking_number.ilike(term));
                }
            }
        }

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const records = await query
            .orderBy((b) => b.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all();

        const bookings = records.map((r: any) => BookingMapper.toDomain(r));
        const detailed = await this.populateDetails(bookings);

        return {
            bookings: detailed,
            total: totalResult.total,
            counts
        };
    }

    async findByProviderProfileId(
        input: (GetProviderBookingsInputDto & { providerProfileId: string }) | string
    ): Promise<BookingListResult> {
        const providerProfileId = typeof input === "string" ? input : input.providerProfileId;
        const page = typeof input === "object" && input.page ? Number(input.page) : 1;
        const limit = typeof input === "object" && input.limit ? Number(input.limit) : 50;
        const search = typeof input === "object" ? input.search : undefined;
        const status = typeof input === "object" ? input.status : undefined;
        const skip = (page - 1) * limit;

        const statusRows = await db.orm.public.bookings
            .where({ provider_id: providerProfileId as never })
            .select("status")
            .all();

        const counts: BookingCountsDto = {
            ALL: statusRows.length,
            CONFIRMED: statusRows.filter((b: any) => b.status === "CONFIRMED").length,
            EN_ROUTE: statusRows.filter((b: any) => b.status === "EN_ROUTE").length,
            INSPECTION: statusRows.filter((b: any) => b.status === "INSPECTION").length,
            IN_PROGRESS: statusRows.filter((b: any) => b.status === "IN_PROGRESS").length,
            PAYMENT_PENDING: statusRows.filter((b: any) => b.status === "PAYMENT_PENDING").length,
            COMPLETED: statusRows.filter((b: any) => b.status === "COMPLETED").length,
            CLOSED: statusRows.filter((b: any) => b.status === "CLOSED").length,
            CANCELLED: statusRows.filter((b: any) => b.status === "CANCELLED").length
        };

        let query = db.orm.public.bookings.where({ provider_id: providerProfileId as never });

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (search && search.trim()) {
            const trimmed = search.trim();
            const term = `%${trimmed}%`;
            if (trimmed.toUpperCase().startsWith("BK")) {
                query = query.where((b) => b.booking_number.ilike(term));
            } else {
                const matchingSrs = await db.orm.public.service_requests
                    .where((sr) => sr.title.ilike(term))
                    .select("id")
                    .all();
                const srIds = matchingSrs.map((s) => s.id);
                if (srIds.length > 0) {
                    query = query.where((b) => b.service_request_id.in(srIds));
                } else {
                    query = query.where((b) => b.booking_number.ilike(term));
                }
            }
        }

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const records = await query
            .orderBy((b) => b.updated_at.desc())
            .offset(skip)
            .limit(limit)
            .all();

        const bookings = records.map((r: any) => BookingMapper.toDomain(r));
        const detailed = await this.populateDetails(bookings);
        const providerCancellations = await this.countProviderCancellations(providerProfileId);
        detailed.forEach((item) => {
            item.providerCancellationsCount = providerCancellations;
            item.maxAllowedCancellations = 2;
        });

        return {
            bookings: detailed,
            total: totalResult.total,
            counts
        };
    }

    async countProviderCancellations(providerProfileId: string): Promise<number> {
        try {
            const records = await db.orm.public.bookings
                .where({
                    provider_id: providerProfileId as never,
                    status: "CANCELLED" as never
                })
                .all();

            let count = 0;
            for (const record of records) {
                if (!record.notes) {
                    count++;
                    continue;
                }
                try {
                    const parsed = JSON.parse(record.notes);
                    if (parsed && typeof parsed === "object") {
                        if (parsed.mismatchReport && parsed.mismatchReport.status === "ACCEPTED") {
                            continue;
                        }
                    }
                    if (Array.isArray(parsed)) {
                        const cancelItem = parsed.find((item: any) => item.status === "CANCELLED");
                        if (cancelItem && cancelItem.authorName && (cancelItem.authorName.toLowerCase() === "customer" || cancelItem.authorName.toLowerCase().includes("diagnosis closed"))) {
                            continue;
                        }
                    } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.history)) {
                        const cancelItem = parsed.history.find((item: any) => item.status === "CANCELLED");
                        if (cancelItem && cancelItem.authorName && (cancelItem.authorName.toLowerCase() === "customer" || cancelItem.authorName.toLowerCase().includes("diagnosis closed"))) {
                            continue;
                        }
                    }
                } catch {
                    if (record.notes.toLowerCase().includes("customer") || record.notes.toLowerCase().includes("diagnosis closed")) {
                        continue;
                    }
                }
                count++;
            }
            return count;
        } catch {
            return 0;
        }
    }

    async countCustomerCancellations(customerId: string): Promise<number> {
        try {
            const records = await db.orm.public.bookings
                .where({
                    customer_id: customerId as never,
                    status: "CANCELLED" as never
                })
                .all();

            let count = 0;
            for (const record of records) {
                if (!record.notes) {
                    continue;
                }
                try {
                    const parsed = JSON.parse(record.notes);
                    if (parsed && typeof parsed === "object") {
                        if (parsed.mismatchReport && parsed.mismatchReport.status === "ACCEPTED") {
                            continue;
                        }
                    }
                    if (Array.isArray(parsed)) {
                        const cancelItem = parsed.find((item: any) => item.status === "CANCELLED");
                        if (cancelItem && cancelItem.authorName && cancelItem.authorName.toLowerCase() === "customer") {
                            count++;
                            continue;
                        }
                    } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.history)) {
                        const cancelItem = parsed.history.find((item: any) => item.status === "CANCELLED");
                        if (cancelItem && cancelItem.authorName && cancelItem.authorName.toLowerCase() === "customer") {
                            count++;
                            continue;
                        }
                    }
                } catch {
                    if (record.notes.toLowerCase().includes("customer") && !record.notes.toLowerCase().includes("diagnosis closed")) {
                        count++;
                        continue;
                    }
                }
            }
            return count;
        } catch {
            return 0;
        }
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
                let categoryName: string | null = null;
                let addressText: string | null = null;
                let providerBusinessName: string | null = null;
                let providerName: string | null = null;
                let providerEmail: string | null = null;
                let providerPhone: string | null = null;
                let providerUserId: string | null = null;
                let customerName: string | null = null;
                let customerEmail: string | null = null;
                let customerPhone: string | null = null;

                const sr = await db.orm.public.service_requests
                    .where({ id: booking.service_request_id as never })
                    .include("category")
                    .include("address")
                    .first();
                if (sr) {
                    serviceRequestTitle = sr.title;
                    categoryName = sr.category?.name || null;
                    if (sr.address) {
                        addressText = [sr.address.house_no, sr.address.area, sr.address.city]
                            .filter(Boolean)
                            .join(", ");
                    }
                }

                const providerProfile = await db.orm.public.provider_profiles
                    .where({ id: booking.provider_id as never })
                    .first();
                if (providerProfile) {
                    providerBusinessName = providerProfile.business_name;
                    providerUserId = providerProfile.user_id;
                    const pUser = await db.orm.public.users
                        .where({ id: providerProfile.user_id as never })
                        .first();
                    if (pUser) {
                        providerName = pUser.name;
                        providerPhone = pUser.phone;
                        providerEmail = pUser.email;
                    }
                }

                const cUser = await db.orm.public.users
                    .where({ id: booking.customer_id as never })
                    .first();
                if (cUser) {
                    customerName = cUser.name;
                    customerPhone = cUser.phone;
                    customerEmail = cUser.email;
                }

                let quotationType: string | null = null;
                let requiresInspection = false;
                let quoteAmount: number | null = null;

                const quote = await db.orm.public.quotations
                    .where({ id: booking.quotation_id as never })
                    .first();
                if (quote) {
                    quotationType = quote.quotation_type;
                    requiresInspection =
                        quote.quotation_type === "INSPECTION_REQUIRED" ||
                        quote.quotation_type === "ESTIMATED";
                    quoteAmount = Number(quote.amount);
                }

                let isReviewed = false;
                try {
                    const rev = await db.orm.public.reviews
                        .where({ booking_id: booking.id as never })
                        .first();
                    isReviewed = Boolean(rev);
                } catch {}

                return {
                    booking,
                    serviceRequestTitle,
                    categoryName,
                    addressText,
                    providerBusinessName,
                    providerName,
                    providerEmail,
                    providerPhone,
                    providerUserId,
                    customerName,
                    customerEmail,
                    customerPhone,
                    quotationType,
                    requiresInspection,
                    quoteAmount,
                    isReviewed
                };
            })
        );
    }

    async findForAdmin(input: GetAdminBookingsInputDto): Promise<AdminBookingListResult> {
        const page = input.page ? Number(input.page) : 1;
        const limit = input.limit ? Number(input.limit) : 10;
        const search = input.search?.trim();
        const status = input.status;
        const paymentStatus = input.paymentStatus;
        const skip = (page - 1) * limit;

        let query = db.orm.public.bookings;

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (paymentStatus && paymentStatus !== "ALL") {
            query = query.where({ payment_status: paymentStatus as never });
        }

        if (search) {
            const term = `%${search}%`;
            if (search.toUpperCase().startsWith("BK")) {
                query = query.where((b) => b.booking_number.ilike(term));
            } else {
                const matchingBookingIds = new Set<string>();

                const byNumber = await db.orm.public.bookings
                    .where((b) => b.booking_number.ilike(term))
                    .select("id")
                    .all();
                for (const b of byNumber) matchingBookingIds.add(b.id);

                const usersByName = await db.orm.public.users
                    .where((u) => u.name.ilike(term))
                    .select("id")
                    .all();
                const usersByEmail = await db.orm.public.users
                    .where((u) => u.email.ilike(term))
                    .select("id")
                    .all();
                const userIds = Array.from(new Set([...usersByName.map((u) => u.id), ...usersByEmail.map((u) => u.id)]));
                if (userIds.length > 0) {
                    const byCustomer = await db.orm.public.bookings
                        .where((b) => b.customer_id.in(userIds))
                        .select("id")
                        .all();
                    for (const b of byCustomer) matchingBookingIds.add(b.id);
                }

                const matchingProviders = await db.orm.public.provider_profiles
                    .where((p) => p.business_name.ilike(term))
                    .select("id")
                    .all();
                const providerIds = matchingProviders.map((p) => p.id);
                if (providerIds.length > 0) {
                    const byProvider = await db.orm.public.bookings
                        .where((b) => b.provider_id.in(providerIds))
                        .select("id")
                        .all();
                    for (const b of byProvider) matchingBookingIds.add(b.id);
                }

                const matchingSrs = await db.orm.public.service_requests
                    .where((sr) => sr.title.ilike(term))
                    .select("id")
                    .all();
                const srIds = matchingSrs.map((s) => s.id);
                if (srIds.length > 0) {
                    const bySr = await db.orm.public.bookings
                        .where((b) => b.service_request_id.in(srIds))
                        .select("id")
                        .all();
                    for (const b of bySr) matchingBookingIds.add(b.id);
                }

                if (matchingBookingIds.size > 0) {
                    query = query.where((b) => b.id.in(Array.from(matchingBookingIds)));
                } else {
                    query = query.where((b) => b.id.in(["00000000-0000-0000-0000-000000000000"]));
                }
            }
        }

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const records = await query
            .orderBy((b) => b.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all();

        const bookings = records.map((r: any) => BookingMapper.toDomain(r));
        const detailed = await this.populateDetails(bookings);

        const total = totalResult.total;
        const totalPages = Math.ceil(total / limit) || 1;

        return {
            bookings: detailed,
            total,
            page,
            limit,
            totalPages
        };
    }
}
