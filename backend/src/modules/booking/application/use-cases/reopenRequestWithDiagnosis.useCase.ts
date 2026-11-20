import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { ReopenRequestWithDiagnosisInputDto } from "../dtos/request/mismatch-report.dto";
import { MismatchReport } from "../dtos/response/booking-response.dto";

export interface ReopenRequestWithDiagnosisResponseDto {
    serviceRequestId: string;
    message: string;
}

export class ReopenRequestWithDiagnosisUseCase implements IUseCase<ReopenRequestWithDiagnosisInputDto, ReopenRequestWithDiagnosisResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(input: ReopenRequestWithDiagnosisInputDto): Promise<ReopenRequestWithDiagnosisResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        if (details.booking.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to reopen this request", "AUTHENTICATION");
        }

        let mismatchReport: MismatchReport | null = null;
        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (typeof parsed === "object" && parsed !== null && parsed.mismatchReport) {
                    mismatchReport = parsed.mismatchReport;
                }
            } catch {}
        }

        if (!mismatchReport || mismatchReport.status !== "ACCEPTED") {
            throw new ApplicationError("MISMATCH_NOT_ACCEPTED", "Can only reopen request after diagnosis report is accepted", "VALIDATION");
        }

        const sr = await this._serviceRequestRepository.findDetailsById(details.booking.service_request_id, input.customerId);
        if (!sr) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        const diagnosisAppendix = `\n\n[Verified Technician Diagnosis]: ${mismatchReport.diagnosis}`;
        const updatedDescription = sr.description.includes("[Verified Technician Diagnosis]")
            ? sr.description
            : (sr.description + diagnosisAppendix).slice(0, 1000);

        await this._serviceRequestRepository.update(sr.id, input.customerId, {
            description: updatedDescription,
            categoryId: mismatchReport.suggestedCategoryId || sr.category_id
        });

        await this._serviceRequestRepository.updateStatus(sr.id, "PENDING");

        return {
            serviceRequestId: sr.id,
            message: "Service request reopened in marketplace with verified technician diagnosis"
        };
    }
}
