import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/database/client";
import { ServiceRequest } from "../../domain/entities/serviceRequest.entity";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestRepoDto } from "../../application/dtos/request/update-service-request.dto";
import {
    ServiceRequestDetailsDto,
    GetCustomerRequestsOutputDto,
    GetProviderRequestsOutputDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { GetProviderServiceRequestsInputDto } from "../../application/use-cases/getProviderServiceRequests.useCase";
import { ServiceRequestMapper } from "../mappers/serviceRequest.mapper";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { CalculateDistance } from "../../../../shared/utils/calculate-distance";

export class ServiceRequestRepository implements IServiceRequestRepository {
    async findById(id: string): Promise<ServiceRequest | null> {
        const record = await db.orm.public.service_requests
            .where({ id: id as never })
            .include("images")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDomain(record);
    }

    async findDetailsById(id: string, customerId: string): Promise<ServiceRequestDetailsDto | null> {
        const record = await db.orm.public.service_requests
            .where({ id: id as never, customer_id: customerId as never })
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("customer", (c) => c.include("customer_profile"))
            .include("providers")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDetailsDto(record);
    }

    async findByCustomerId(
        input: GetCustomerServiceRequestsInputDto
    ): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts: Record<string, number> }> {
        const { customerId, page = 1, limit = 10, search, status, sortBy = "NEWEST" } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.service_requests.where({ customer_id: customerId as never });

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (search && search.trim()) {
            query = query.where((req) => req.title.ilike(`%${search.trim()}%`));
        }

        if (sortBy === "OLDEST") {
            query = query.orderBy((req) => req.created_at.asc());
        } else {
            query = query.orderBy((req) => req.created_at.desc());
        }

        const records = await query
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("customer", (c) => c.include("customer_profile"))
            .include("providers")
            .offset(skip)
            .limit(limit)
            .all();

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));

        const allRecords = await db.orm.public.service_requests
            .where({ customer_id: customerId as never })
            .all();

        const counts: Record<string, number> = {
            ALL: allRecords.length,
            DRAFT: 0,
            PENDING: 0,
            ACTIVE: 0,
            ACCEPTED: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
            CANCELLED: 0,
            EXPIRED: 0
        };

        allRecords.forEach((r) => {
            if (r.status in counts) {
                counts[r.status] += 1;
            }
        });

        return {
            requests: records.map((record) => ServiceRequestMapper.toDetailsDto(record)),
            total: totalResult.total,
            counts
        };
    }

    async findByProviderId(
        providerProfileId: string,
        input?: Omit<GetProviderServiceRequestsInputDto, "userId">
    ): Promise<{ requests: ServiceRequestDetailsDto[]; total: number }> {
        const { page = 1, limit = 10, search, urgency, budgetType, sortBy = "NEWEST" } = input || {};
        const skip = (page - 1) * limit;

        const matches = await db.orm.public.service_request_providers
            .where({ provider_id: providerProfileId as never })
            .all();

        if (matches.length === 0) {
            return {
                requests: [],
                total: 0
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

        const records = await Promise.all(
            requestIds.map(async (requestId) => {
                return await db.orm.public.service_requests
                    .where({ id: requestId as never })
                    .include("images")
                    .include("category")
                    .include("subservice")
                    .include("address")
                    .include("customer", (c) => c.include("customer_profile"))
                    .include("providers")
                    .first();
            })
        );

        const validRecords = records.filter((r): r is NonNullable<typeof r> => r !== null);

        let dtos = validRecords.map((record) => {
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
            return ServiceRequestMapper.toDetailsDto(record, distanceKm);
        });

        if (urgency && urgency !== "ALL") {
            dtos = dtos.filter((r) => r.urgency === urgency);
        }

        if (budgetType && budgetType !== "ALL") {
            dtos = dtos.filter((r) => r.budget_type === budgetType);
        }

        if (search && search.trim()) {
            const q = search.toLowerCase().trim();
            dtos = dtos.filter((r) => {
                const matchTitle = r.title.toLowerCase().includes(q);
                const matchDesc = r.description.toLowerCase().includes(q);
                const matchCat = (r.category_name || "").toLowerCase().includes(q);
                const matchSub = (r.subservice_name || "").toLowerCase().includes(q);
                const matchArea = (r.address_details?.area || "").toLowerCase().includes(q);
                const matchCity = (r.address_details?.city || "").toLowerCase().includes(q);
                const matchLandmark = (r.address_details?.landmark || "").toLowerCase().includes(q);
                return matchTitle || matchDesc || matchCat || matchSub || matchArea || matchCity || matchLandmark;
            });
        }

        dtos.sort((a, b) => {
            if (sortBy === "BUDGET_HIGH") {
                const aAmt = a.budget_amount ?? 0;
                const bAmt = b.budget_amount ?? 0;
                return bAmt - aAmt;
            }
            if (sortBy === "URGENT") {
                const urgencyOrder: Record<string, number> = { TODAY: 1, THIS_WEEK: 2, SPECIFIC_DATE: 3, FLEXIBLE: 4 };
                return (urgencyOrder[a.urgency] ?? 5) - (urgencyOrder[b.urgency] ?? 5);
            }
            const timeA = new Date(a.created_at).getTime();
            const timeB = new Date(b.created_at).getTime();
            return timeB - timeA;
        });

        const total = dtos.length;
        const paginated = dtos.slice(skip, skip + limit);

        return {
            requests: paginated,
            total
        };
    }

    async update(id: string, customerId: string, data: UpdateServiceRequestRepoDto): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const updatePayload = ServiceRequestMapper.toUpdatePersistence(data);

            await tx.orm.public.service_requests
                .where({ id: id as never, customer_id: customerId as never })
                .update(updatePayload as never);

            if (data.imageUrls !== undefined) {
                await tx.orm.public.service_request_images
                    .where({ service_request_id: id as never })
                    .delete();

                if (data.imageUrls.length > 0) {
                    for (let i = 0; i < data.imageUrls.length; i++) {
                        const imageData = ServiceRequestMapper.toImagePersistence(id, data.imageUrls[i], i);
                        await tx.orm.public.service_request_images.create(imageData as never);
                    }
                }
            }

            const record = await tx.orm.public.service_requests
                .where({ id: id as never })
                .include("images")
                .first();

            if (!record) return null;
            return ServiceRequestMapper.toDomain(record);
        });
    }

    async cancel(id: string, customerId: string): Promise<ServiceRequest | null> {
        const existing = await db.orm.public.service_requests
            .where({ id: id as never, customer_id: customerId as never })
            .first();

        if (!existing) return null;

        if (existing.status !== "ACTIVE") {
            throw new ApplicationError("INVALID_STATE", "Only pending or open requests can be cancelled", "VALIDATION");
        }

        const updated = await db.orm.public.service_requests
            .where({ id: id as never })
            .update({
                status: "CANCELLED" as never,
                updated_at: Temporal.Now.instant()
            });

        if (!updated) return null;

        const record = await db.orm.public.service_requests
            .where({ id: id as never })
            .include("images")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDomain(record);
    }

    async create(data: CreateServiceRequestRepoDto): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const persistenceData = ServiceRequestMapper.toPersistence(data);
            const created = await tx.orm.public.service_requests.create(persistenceData as never);

            if (!created) return null;

            const recordId = (created as { id: string }).id;

            if (data.imageUrls && data.imageUrls.length > 0) {
                for (let i = 0; i < data.imageUrls.length; i++) {
                    const imageData = ServiceRequestMapper.toImagePersistence(recordId, data.imageUrls[i], i);
                    await tx.orm.public.service_request_images.create(imageData as never);
                }
            }

            const finalRecord = await tx.orm.public.service_requests
                .where({ id: recordId as never })
                .include("images")
                .first();

            if (!finalRecord) return null;
            return ServiceRequestMapper.toDomain(finalRecord);
        });
    }
}
