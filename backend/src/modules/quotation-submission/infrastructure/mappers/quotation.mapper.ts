import { Temporal } from "@js-temporal/polyfill";
import { Quotation, QuotationType, QuotationValidity, QuotationStatus } from "../../domain/entities/quotation.entity";
import { CreateQuotationRepoDto } from "../../application/dtos/request/submit-quotation.dto";
import { UpdateQuotationRepoDto } from "../../application/dtos/request/update-quotation.dto";
import { QuotationResponseDto } from "../../application/dtos/response/quotation-response.dto";
import { ProviderQuotationItemDto, ProviderQuotationsResponseDto } from "../../application/dtos/response/provider-quotations-response.dto";
import { RequestQuotationItemDto, RequestQuotationsResponseDto } from "../../application/dtos/response/request-quotations-response.dto";
import { AcceptQuotationResponseDto } from "../../application/dtos/response/accept-quotation-response.dto";
import { RejectQuotationResponseDto } from "../../application/dtos/response/reject-quotation-response.dto";

export class QuotationMapper {
    static toDomain(record: any): Quotation {
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

        const parseJsonArray = (val: any): string[] => {
            if (!val) return [];
            if (Array.isArray(val)) return val.map(String);
            if (typeof val === "string") {
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) ? parsed.map(String) : [val];
                } catch {
                    return [val];
                }
            }
            return [];
        };

        const createdDate = parseDate(record.created_at);
        const updatedDate = parseDate(record.updated_at);
        const validUntilDate = parseNullableDate(record.valid_until_date) ?? new Date();

        return new Quotation(
            record.id,
            record.service_request_id,
            record.provider_id,
            Number(record.amount),
            record.quotation_type as QuotationType,
            record.work_description,
            parseJsonArray(record.included_items),
            parseJsonArray(record.excluded_items),
            record.estimated_duration ?? null,
            record.available_date_time ?? null,
            record.valid_until as QuotationValidity,
            validUntilDate,
            record.extra_charge_policy,
            record.status as QuotationStatus,
            record.rejection_reason ?? null,
            createdDate,
            updatedDate
        );
    }

    static toResponseDto(entity: Quotation): QuotationResponseDto {
        return {
            id: entity.id,
            serviceRequestId: entity.service_request_id,
            providerId: entity.provider_id,
            amount: entity.amount,
            quotationType: entity.quotation_type,
            workDescription: entity.work_description,
            includedItems: entity.included_items,
            excludedItems: entity.excluded_items,
            estimatedDuration: entity.estimated_duration,
            availableDateTime: entity.available_date_time,
            validUntil: entity.valid_until,
            validUntilDate: entity.valid_until_date.toISOString(),
            extraChargePolicy: entity.extra_charge_policy,
            status: entity.status,
            rejectionReason: entity.rejection_reason ?? null,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString()
        };
    }

    static toProviderItemDto(entity: Quotation, serviceRequestTitle?: string | null, categoryName?: string | null): ProviderQuotationItemDto {
        return {
            id: entity.id,
            serviceRequestId: entity.service_request_id,
            serviceRequestTitle: serviceRequestTitle ?? null,
            categoryName: categoryName ?? null,
            amount: entity.amount,
            quotationType: entity.quotation_type,
            workDescription: entity.work_description,
            includedItems: entity.included_items,
            excludedItems: entity.excluded_items,
            estimatedDuration: entity.estimated_duration,
            availableDateTime: entity.available_date_time,
            validUntil: entity.valid_until,
            validUntilDate: entity.valid_until_date.toISOString(),
            extraChargePolicy: entity.extra_charge_policy,
            status: entity.status,
            rejectionReason: entity.rejection_reason ?? null,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString()
        };
    }

    static toRequestQuotationItemDto(
        entity: Quotation,
        providerProfile?: any,
        providerUser?: any
    ): RequestQuotationItemDto {
        return {
            id: entity.id,
            serviceRequestId: entity.service_request_id,
            providerId: entity.provider_id,
            provider: {
                id: providerProfile?.id ?? entity.provider_id,
                userId: providerProfile?.user_id || providerUser?.id || "",
                name: providerUser?.name || providerProfile?.business_name || "Service Provider",
                businessName: providerProfile?.business_name || providerUser?.name || "Service Provider",
                profileImage: providerProfile?.profile_image || providerUser?.avatarUrl || null,
                experience: providerProfile?.experience ?? "",
                completedJobs: providerProfile?.completed_jobs ?? 0,
                phone: providerUser?.phone ?? null,
                email: providerUser?.email ?? null
            },
            amount: entity.amount,
            quotationType: entity.quotation_type,
            workDescription: entity.work_description,
            includedItems: entity.included_items,
            excludedItems: entity.excluded_items,
            estimatedDuration: entity.estimated_duration,
            availableDateTime: entity.available_date_time,
            validUntil: entity.valid_until,
            validUntilDate: entity.valid_until_date.toISOString(),
            extraChargePolicy: entity.extra_charge_policy,
            status: entity.status,
            rejectionReason: entity.rejection_reason ?? null,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString()
        };
    }

    static toRequestQuotationsResponseDto(
        quotations: RequestQuotationItemDto[],
        acceptedQuotationId: string | null
    ): RequestQuotationsResponseDto {
        return {
            quotations,
            total: quotations.length,
            acceptedQuotationId
        };
    }

    static toAcceptQuotationResponseDto(
        quotationId: string,
        status: string,
        serviceRequestId: string
    ): AcceptQuotationResponseDto {
        return {
            id: quotationId,
            status,
            serviceRequestId
        };
    }

    static toRejectQuotationResponseDto(
        quotationId: string,
        status: string
    ): RejectQuotationResponseDto {
        return {
            id: quotationId,
            status
        };
    }

    static toProviderQuotationsResponseDto(
        quotations: ProviderQuotationItemDto[],
        total: number,
        totalPages: number,
        page: number,
        limit: number,
        counts: Record<string, number>
    ): ProviderQuotationsResponseDto {
        return {
            quotations,
            total,
            totalPages,
            page,
            limit,
            counts
        };
    }

    static toPersistence(data: CreateQuotationRepoDto): any {
        const now = new Date();
        let validUntilHours = 24;
        if (data.validUntil === "HOURS_48") {
            validUntilHours = 48;
        } else if (data.validUntil === "DAYS_3") {
            validUntilHours = 72;
        } else if (data.validUntil === "DAYS_7") {
            validUntilHours = 168;
        }

        const validUntilDate = new Date(now.getTime() + validUntilHours * 60 * 60 * 1000);
        const validUntilInstant = Temporal.Instant.fromEpochMilliseconds(validUntilDate.getTime());

        return {
            service_request_id: data.serviceRequestId,
            provider_id: data.providerId,
            amount: data.amount.toString(),
            quotation_type: data.quotationType,
            work_description: data.workDescription,
            included_items: data.includedItems,
            excluded_items: data.excludedItems,
            estimated_duration: data.estimatedDuration ?? null,
            available_date_time: data.availableDateTime ?? null,
            valid_until: data.validUntil,
            valid_until_date: validUntilInstant,
            extra_charge_policy: data.extraChargePolicy,
            status: "PENDING",
            created_at: Temporal.Now.instant()
        };
    }

    static toUpdatePersistence(data: UpdateQuotationRepoDto): any {
        let validUntilInstant: any = undefined;
        if (data.validUntil !== undefined) {
            const now = new Date();
            let validUntilHours = 24;
            if (data.validUntil === "HOURS_48") {
                validUntilHours = 48;
            } else if (data.validUntil === "DAYS_3") {
                validUntilHours = 72;
            } else if (data.validUntil === "DAYS_7") {
                validUntilHours = 168;
            }

            const validUntilDate = new Date(now.getTime() + validUntilHours * 60 * 60 * 1000);
            validUntilInstant = Temporal.Instant.fromEpochMilliseconds(validUntilDate.getTime());
        }

        return {
            ...(data.amount !== undefined && { amount: data.amount.toString() }),
            ...(data.quotationType !== undefined && { quotation_type: data.quotationType }),
            ...(data.workDescription !== undefined && { work_description: data.workDescription }),
            ...(data.includedItems !== undefined && { included_items: data.includedItems }),
            ...(data.excludedItems !== undefined && { excluded_items: data.excludedItems }),
            ...(data.estimatedDuration !== undefined && { estimated_duration: data.estimatedDuration ?? null }),
            ...(data.availableDateTime !== undefined && { available_date_time: data.availableDateTime ?? null }),
            ...(data.validUntil !== undefined && {
                valid_until: data.validUntil,
                valid_until_date: validUntilInstant
            }),
            ...(data.extraChargePolicy !== undefined && { extra_charge_policy: data.extraChargePolicy }),
            ...(data.status !== undefined && { status: data.status }),
            ...(data.rejectionReason !== undefined && { rejection_reason: data.rejectionReason }),
            updated_at: Temporal.Now.instant()
        };
    }
}
