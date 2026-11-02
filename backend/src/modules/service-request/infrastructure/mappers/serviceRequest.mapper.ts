import { Temporal } from "@js-temporal/polyfill";
import { ServiceRequest, ServiceRequestImage } from "../../domain/entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";

export class ServiceRequestMapper {
    static toDomain(record: any): ServiceRequest {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;
        const specificDateRaw: any = record.specific_date;

        const images: ServiceRequestImage[] = (record.images || []).map((img: any) => {
            const imgCreatedRaw: any = img.created_at;
            return {
                id: img.id,
                service_request_id: img.service_request_id,
                image_key: img.image_key,
                display_order: img.display_order,
                created_at: imgCreatedRaw?.epochMilliseconds
                    ? new Date(Number(imgCreatedRaw.epochMilliseconds))
                    : new Date(imgCreatedRaw)
            };
        });

        return new ServiceRequest(
            record.id,
            record.customer_id,
            record.category_id,
            record.subservice_id ?? null,
            record.title,
            record.description,
            record.urgency,
            specificDateRaw
                ? (specificDateRaw?.epochMilliseconds
                    ? new Date(Number(specificDateRaw.epochMilliseconds))
                    : new Date(specificDateRaw))
                : null,
            record.address_id,
            record.available_time_from?.toString() ?? record.available_time_from,
            record.available_time_to?.toString() ?? record.available_time_to,
            record.budget_type,
            record.budget_amount !== null && record.budget_amount !== undefined
                ? Number(record.budget_amount)
                : null,
            record.status,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            images
        );
    }

    static toPersistence(data: CreateServiceRequestRepoDto) {
        let specificDateValue: any = null;
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
}
