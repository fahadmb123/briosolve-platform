export type AddCategoryUseCaseInputDto = {
    name: string;
    description: string;
    status: string;
    image?: string;
    imageBuffer?: Buffer;
};
