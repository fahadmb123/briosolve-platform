import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/database/client";
import { ServiceRequestProvider, ServiceRequestProviderStatus } from "../../domain/entities/serviceRequestProvider.entity";
import { IServiceRequestProviderRepository } from "../../domain/repositories/IServiceRequestProviderRepository";
import { ServiceRequestProviderMapper } from "../mappers/serviceRequestProvider.mapper";
import { ServiceRequestMapper } from "../mappers/serviceRequest.mapper";
import { ServiceRequestDetailsDto } from "../../application/dtos/response/service-request.dto";
import { GetProviderServiceRequestsInputDto } from "../../application/use-cases/getProviderServiceRequests.useCase";
import { CalculateDistance } from "../../../../shared/utils/calculate-distance";

export class ServiceRequestProviderRepository implements IServiceRequestProviderRepository {
    private async syncExpiredRequests(): Promise<void> {
        try {
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            const endOfTodayInstant = Temporal.Instant.fromEpochMilliseconds(endOfToday.getTime());

            const records = await db.orm.public.service_requests
                .where((req) => req.status.in(["PENDING", "ACTIVE"]))
                .where((req) => req.specific_date.isNotNull())
                .where((req) => req.specific_date.lte(endOfTodayInstant as never))
                .all();

            if (records.length === 0) return;

            const now = new Date();
            const expiredIds: string[] = [];

            for (const req of records) {
                const rawDate: any = req.specific_date;
                const dateVal = rawDate?.epochMilliseconds
                    ? new Date(Number(rawDate.epochMilliseconds))
                    : new Date(rawDate);

                if (isNaN(dateVal.getTime())) continue;

                let timeStr = "23:59:59";
                if (req.available_time_to) {
                    timeStr = req.available_time_to.toString();
                    if (timeStr.length === 5) {
                        timeStr = `${timeStr}:00`;
                    }
                }

                const [hours, minutes] = timeStr.split(":").map(Number);
                const deadline = new Date(dateVal);
                deadline.setHours(
                    hours !== undefined && !isNaN(hours) ? hours : 23,
                    minutes !== undefined && !isNaN(minutes) ? minutes : 59,
                    59,
                    999
                );

                if (now.getTime() > deadline.getTime()) {
                    expiredIds.push(req.id);
                }
            }

            if (expiredIds.length === 0) return;

            await db.orm.public.service_requests
                .where((req) => req.id.in(expiredIds))
                .updateAll({
                    status: "EXPIRED" as never,
                    updated_at: Temporal.Now.instant()
                } as never);

            await db.orm.public.service_request_providers
                .where((p) => p.service_request_id.in(expiredIds))
                .deleteAll();
        } catch {
            return;
        }
    }

    async create(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider> {
        const record = await db.orm.public.service_request_providers.create(
            ServiceRequestProviderMapper.toPersistence(serviceRequestId, providerId) as never
        );

        return ServiceRequestProviderMapper.toDomain(record);
    }

    async createMany(serviceRequestId: string, providerIds: string[]): Promise<ServiceRequestProvider[]> {
        return await db.transaction(async (tx) => {
            const results: ServiceRequestProvider[] = [];
            for (const providerId of providerIds) {
                const existing = await tx.orm.public.service_request_providers
                    .where({
                        service_request_id: serviceRequestId as never,
                        provider_id: providerId as never
                    })
                    .first();

                if (!existing) {
                    const record = await tx.orm.public.service_request_providers.create(
                        ServiceRequestProviderMapper.toPersistence(serviceRequestId, providerId) as never
                    );
                    results.push(ServiceRequestProviderMapper.toDomain(record));
                } else {
                    results.push(ServiceRequestProviderMapper.toDomain(existing));
                }
            }
            return results;
        });
    }

    async findByServiceRequestId(serviceRequestId: string): Promise<ServiceRequestProvider[]> {
        const records = await db.orm.public.service_request_providers
            .where({ service_request_id: serviceRequestId as never })
            .include("provider")
            .all();

        return records.map((record) => ServiceRequestProviderMapper.toDomain(record));
    }

    async findMatchesByProviderId(providerId: string): Promise<ServiceRequestProvider[]> {
        const records = await db.orm.public.service_request_providers
            .where({ provider_id: providerId as never })
            .all();

        return records.map((record) => ServiceRequestProviderMapper.toDomain(record));
    }

    async findByProviderId(
        providerProfileId: string,
        input?: Omit<GetProviderServiceRequestsInputDto, "userId">
    ): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts?: Record<string, number> }> {
        await this.syncExpiredRequests();
        const { page = 1, limit = 10, search, status, urgency, budgetType, sortBy = "NEWEST" } = input || {};
        const skip = (page - 1) * limit;

        const matches = await db.orm.public.service_request_providers
            .where({ provider_id: providerProfileId as never })
            .all();

        if (matches.length === 0) {
            return {
                requests: [],
                total: 0,
                counts: {
                    ALL: 0,
                    OPEN: 0,
                    CLOSED: 0,
                    CANCELLED: 0,
                    EXPIRED: 0
                }
            };
        }

        const providerProfile = await db.orm.public.provider_profiles
            .where({ id: providerProfileId as never })
            .first();

        let providerLat: number | null = null;
        let providerLng: number | null = null;

        if (providerProfile) {
            const providerUser = await db.orm.public.users
                .where({ id: providerProfile.user_id as never })
                .include("current_address")
                .first();

            if (providerUser?.current_address?.latitude != null && providerUser?.current_address?.longitude != null) {
                providerLat = Number(providerUser.current_address.latitude);
                providerLng = Number(providerUser.current_address.longitude);
            }
        }

        const requestIds = matches.map((m) => m.service_request_id);

        let query = db.orm.public.service_requests.where((r) => r.id.in(requestIds));

        if (status && status !== "ALL") {
            if (status === "OPEN" || status === "PENDING") {
                query = query.where((r) => r.status.in(["PENDING", "ACTIVE"] as any));
            } else {
                query = query.where({ status: status as never });
            }
        }

        if (urgency && urgency !== "ALL") {
            query = query.where({ urgency: urgency as never });
        }

        if (search && search.trim()) {
            query = query.where((r) => r.title.ilike(`%${search.trim()}%`));
        }

        query = query.orderBy((r) => r.updated_at.desc());

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const records = await query
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("customer", (c) => c.include("customer_profile"))
            .include("providers")
            .include("quotations")
            .offset(skip)
            .limit(limit)
            .all();

        const allStatuses = await db.orm.public.service_requests
            .where((r) => r.id.in(requestIds))
            .select("status")
            .all();

        const counts: Record<string, number> = {
            ALL: allStatuses.length,
            OPEN: allStatuses.filter((r: any) => r.status === "PENDING" || r.status === "ACTIVE").length,
            CLOSED: allStatuses.filter((r: any) => (r.status as string) === "CLOSED").length,
            CANCELLED: allStatuses.filter((r: any) => r.status === "CANCELLED").length,
            EXPIRED: allStatuses.filter((r: any) => r.status === "EXPIRED").length
        };

        const dtos = records.map((record) => {
            let distanceKm: number | null = null;
            if (
                providerLat != null &&
                providerLng != null &&
                record.address?.latitude != null &&
                record.address?.longitude != null
            ) {
                distanceKm = CalculateDistance(
                    providerLat,
                    providerLng,
                    Number(record.address.latitude),
                    Number(record.address.longitude)
                );
            }
            const dto = ServiceRequestMapper.toDetailsDto(record, distanceKm);
            const providerRecord = record.providers?.find((p: any) => p.provider_id === providerProfileId);
            const myQuotation = record.quotations?.find((q: any) => q.provider_id === providerProfileId);
            dto.has_quoted = Boolean(myQuotation) || providerRecord?.status === "QUOTED";
            dto.my_quotation_status = myQuotation?.status ? String(myQuotation.status) : null;
            dto.my_quotation_id = myQuotation?.id || null;
            return dto;
        });

        return {
            requests: dtos,
            total: totalResult.total,
            counts
        };
    }

    async findByRequestAndProviderId(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null> {
        const record = await db.orm.public.service_request_providers
            .where({
                service_request_id: serviceRequestId as never,
                provider_id: providerId as never
            })
            .first();

        if (!record) return null;
        return ServiceRequestProviderMapper.toDomain(record);
    }

    async updateStatus(
        serviceRequestId: string,
        providerId: string,
        status: ServiceRequestProviderStatus
    ): Promise<ServiceRequestProvider | null> {
        const existing = await db.orm.public.service_request_providers
            .where({
                service_request_id: serviceRequestId as never,
                provider_id: providerId as never
            })
            .first();

        if (!existing) return null;

        await db.orm.public.service_request_providers
            .where({ id: existing.id })
            .update({
                status: status as never,
                ...(status === "VIEWED" && !existing.viewed_at
                    ? { viewed_at: Temporal.Now.instant() as never }
                    : {})
            });

        const updated = await db.orm.public.service_request_providers
            .where({ id: existing.id })
            .first();

        if (!updated) return null;
        return ServiceRequestProviderMapper.toDomain(updated);
    }

    async markAsViewed(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null> {
        return this.updateStatus(serviceRequestId, providerId, "VIEWED");
    }
}
