import { ServiceQuestion } from "../../../../domain/entities/service.entity";

export interface AddServiceUseCaseInputDto {
    name: string;
    category_id: string;
    description: string;
    image?: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    imageBuffer?: Buffer;
    questions?: ServiceQuestion[] | null;
}
