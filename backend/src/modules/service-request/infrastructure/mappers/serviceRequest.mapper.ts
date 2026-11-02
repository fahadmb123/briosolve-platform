import type { Prisma } from "@prisma/client";
import { Temporal } from "@js-temporal/polyfill";
import { ServiceRequest, ServiceRequestImage, ServiceRequestStatus } from "../../domain/entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { ServiceRequestResponseDto } from "../../application/dtos/response/service-request.dto";

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

    static toPersistence(data: CreateServiceRequestRepoDto) {
        let specificDateValue: Temporal.Instant | null = null;
        if (data.specificDate) {
            const dateObj = new Date(data.specificDate);
            specificDateValue = Temporal.Instant.fromEpochMilliseconds(dateObj.getTime());
        }

        return {
            customer_id: data.customerId as never,
            category_id: data.categoryId as never,
            subservice_id: data.subserviceId ? (data.subserviceId as never) : null,
            title: data.title as never,
            description: data.description as never,
            urgency: data.urgency as never,
            specific_date: specificDateValue,
            address_id: data.selectedAddressId as never,
            available_time_from: data.availableTimeFrom as never,
            available_time_to: data.availableTimeTo as never,
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

    static toDto(record: ServiceRequest): ServiceRequestResponseDto {
        return {
            id:record.id,
            customer_id:record.customer_id,
            category_id:record.category_id,
            subservice_id:record.subservice_id ?? null,
            title:record.title,
            description:record.description,
            urgency:record.urgency,
            specific_date:record.specific_date,
            address_id:record.address_id,
            available_time_from:record.available_time_from?.toString() ?? "",
            available_time_to:record.available_time_to?.toString() ?? "",
            budget_type:record.budget_type,
            budget_amount:record.budget_amount !== null && record.budget_amount !== undefined
                ? Number(record.budget_amount)
                : null,
            status:record.status as ServiceRequestStatus,
            created_at:record.created_at,
            updated_at:record.updated_at,
            images:record.images
        }
    }
}
