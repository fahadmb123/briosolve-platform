import type { Prisma } from "@prisma/client";
import { Temporal } from "@js-temporal/polyfill";
import { ServiceRequest, ServiceRequestImage, ServiceRequestStatus } from "../../domain/entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import {
    ServiceRequestResponseDto,
    ServiceRequestDetailsDto,
    ServiceRequestAddressDto
} from "../../application/dtos/response/service-request.dto";

export type ServiceRequestRecord = Prisma.ServiceRequestGetPayload<{}>;
export type ServiceRequestImageRecord = Prisma.ServiceRequestImageGetPayload<{}>;

export class ServiceRequestMapper {
    static toDomain(record: ServiceRequestRecord): ServiceRequest {
        const createdAtRaw = record.created_at;
        const updatedAtRaw = record.updated_at;
        const specificDateRaw = record.specific_date;

        const parseDate = (val: typeof createdAtRaw | typeof specificDateRaw): Date | null => {
            if (!val) return null;
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                const epoch = (val as { epochMilliseconds: bigint | number }).epochMilliseconds;
                return new Date(Number(epoch));
            }
            return new Date(val as unknown as string | Date);
        };

        const images: ServiceRequestImage[] = (record.images || []).map((img: ServiceRequestImageRecord) => {
            const imgCreatedDate = parseDate(img.created_at) ?? new Date();
            return {
                id: img.id,
                service_request_id: img.service_request_id,
                image_key: img.image_key,
                display_order: img.display_order,
                created_at: imgCreatedDate
            };
        });

        const createdDate = parseDate(createdAtRaw) ?? new Date();
        const updatedDate = parseDate(updatedAtRaw) ?? new Date();
        const specificDate = parseDate(specificDateRaw);

        return new ServiceRequest(
            record.id,
            record.customer_id,
            record.category_id,
            record.subservice_id ?? null,
            record.title,
            record.description,
            record.urgency,
            specificDate,
            record.address_id,
            record.available_time_from?.toString() ?? "",
            record.available_time_to?.toString() ?? "",
            record.budget_type,
            record.budget_amount !== null && record.budget_amount !== undefined
                ? Number(record.budget_amount)
                : null,
            record.status as ServiceRequestStatus,
            createdDate,
            updatedDate,
            images
        );
    }

    static toDto(serviceRequest: ServiceRequest): ServiceRequestResponseDto {
        return {
            id: serviceRequest.id,
            customer_id: serviceRequest.customer_id,
            category_id: serviceRequest.category_id,
            subservice_id: serviceRequest.subservice_id,
            title: serviceRequest.title,
            description: serviceRequest.description,
            urgency: serviceRequest.urgency,
            specific_date: serviceRequest.specific_date,
            address_id: serviceRequest.address_id,
            available_time_from: serviceRequest.available_time_from,
            available_time_to: serviceRequest.available_time_to,
            budget_type: serviceRequest.budget_type,
            budget_amount: serviceRequest.budget_amount,
            status: serviceRequest.status,
            created_at: serviceRequest.created_at,
            updated_at: serviceRequest.updated_at,
            images: serviceRequest.images
        };
    }

    static toDetailsDto(record: any): ServiceRequestDetailsDto {
        const domain = ServiceRequestMapper.toDomain(record);
        const dto = ServiceRequestMapper.toDto(domain);

        let addressDetails: ServiceRequestAddressDto | null = null;
        if (record.address) {
            addressDetails = {
                id: record.address.id,
                house_no: record.address.house_no ?? null,
                area: record.address.area || "",
                city: record.address.city || "",
                district: record.address.district ?? null,
                state: record.address.state || "",
                pincode: record.address.pincode || "",
                landmark: record.address.landmark ?? null,
                latitude: record.address.latitude !== null && record.address.latitude !== undefined ? Number(record.address.latitude) : null,
                longitude: record.address.longitude !== null && record.address.longitude !== undefined ? Number(record.address.longitude) : null,
            };
        }

        const providers = Array.isArray(record.providers) ? record.providers : [];
        const quotationsCount = providers.filter((p: any) => p.status === "QUOTED").length;

        return {
            ...dto,
            category_name: record.category?.name,
            subservice_name: record.subservice?.name ?? null,
            address_details: addressDetails,
            matched_providers_count: providers.length,
            quotations_count: quotationsCount
        };
    }

    static toPersistence(data: CreateServiceRequestRepoDto) {
        let specificDateValue: Temporal.Instant | null = null;
        if (data.specificDate) {
            const dateObj = new Date(data.specificDate);
            specificDateValue = Temporal.Instant.fromEpochMilliseconds(dateObj.getTime());
        }

        const parseTime = (timeStr: string): Temporal.PlainTime => {
            const trimmed = timeStr.trim();
            const normalized = trimmed.length === 5 ? `${trimmed}:00` : trimmed;
            return Temporal.PlainTime.from(normalized);
        };

        return {
            customer_id: data.customerId as never,
            category_id: data.categoryId as never,
            subservice_id: data.subserviceId as never,
            title: data.title as never,
            description: data.description as never,
            urgency: data.urgency as never,
            specific_date: specificDateValue,
            address_id: data.selectedAddressId as never,
            available_time_from: parseTime(data.availableTimeFrom) as never,
            available_time_to: parseTime(data.availableTimeTo) as never,
            budget_type: data.budgetType as never,
            budget_amount: data.budgetAmount ? (Number(data.budgetAmount) as never) : null,
            status: "PENDING" as never,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant()
        };
    }

    static toImagePersistence(serviceRequestId: string, imageKey: string, displayOrder: number) {
        return {
            service_request_id: serviceRequestId as never,
            image_key: imageKey as never,
            display_order: displayOrder,
            created_at: Temporal.Now.instant()
        };
    }
}
