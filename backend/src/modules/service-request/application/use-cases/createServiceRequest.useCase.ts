import { Buffer } from "node:buffer";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { CreateServiceRequestInputDto } from "../dtos/request/create-service-request.dto";
import { ServiceRequestResponseDto } from "../dtos/response/service-request.dto";
import { ServiceRequestMapper } from "../../infrastructure/mappers/serviceRequest.mapper";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { IUserRepository } from "../../../user-management/domain/repositories/IUserRepository";
import { Address } from "../../../user-management/domain/entities/address.entity";
import { CalculateDistance } from "../../../../shared/presentation/http/utils/calculate-distance";
import { IAddressRepository } from "../../../user-management/domain/repositories/IAddressRepository";
import { IProviderSelectionService } from "../interfaces/services/IProviderSelectionService";


export class CreateServiceRequestUseCase implements IUseCase<CreateServiceRequestInputDto, ServiceRequestResponseDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _imageUploadService: ImageUploadService,
        private readonly _createBulkNotificationUseCase : IUseCase<CreateBulkNotificationRequestDto,NotificationResponseDto[]>,
        private readonly _userRepository :IUserRepository,
        private readonly _addressRepository:IAddressRepository,
        private readonly _providerSelectionService : IProviderSelectionService
    ) {}

    async execute(input: CreateServiceRequestInputDto): Promise<ServiceRequestResponseDto> {
        if (!input.customerId) throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION")

        if (!input.images || input.images.length === 0) throw new ApplicationError("VALIDATION", "At least one image is required", "VALIDATION")

        const imageUrls = await Promise.all(
            input.images.map(async (img) => {
                if (img.startsWith("data:")) {
                    const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
                    const buffer = Buffer.from(base64Data, "base64");
                    return await this._imageUploadService.uploadImage(buffer, "service-requests");
                }
                return img;
            })
        );

        const serviceRequest = await this._serviceRequestRepository.create({
            ...input,
            imageUrls
        })

        if (!serviceRequest) throw new ApplicationError("FAILED", "Failed to create service request", "INTERNAL")

        const customerAddress = await this._addressRepository.findById(input.selectedAddressId)

        if (!customerAddress) throw new ApplicationError("ADDRESS_NOT_FOUND","Address Not Found","NOT_FOUND")

        const customerLat = Number(customerAddress?.latitude)
        const customerLng = Number(customerAddress?.longitude)

        const providers = await this._userRepository.getActiveProviders()

        const nearestProvidersIds:string[] = this._providerSelectionService.getNearbyProviderIds(
            providers,
            input.customerId,
            customerLat,
            customerLng
        )

        const notification = {
            recipientIds:nearestProvidersIds,
            type:"SUCCESS" ,
            title_code:"NEW_SERVICE_REQUEST",
            title:"New Service Request",
            message:`${input.title} needed in ${input.urgency === "SPECIFIC_DATE" ? input.specificDate : input.urgency}`
        };

        return ServiceRequestMapper.toDto(serviceRequest)
    }
}

