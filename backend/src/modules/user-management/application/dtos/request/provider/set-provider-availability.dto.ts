import { Weekday } from "../../../../domain/entities/providerAvailability.entity";

export interface AvailabilitySlotDto {
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
}

export interface SetProviderAvailabilityInputDto {
    userId: string;
    slots: AvailabilitySlotDto[];
}