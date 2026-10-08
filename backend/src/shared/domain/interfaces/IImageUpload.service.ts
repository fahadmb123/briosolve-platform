export interface IImageUploadService {
    uploadImage(fileBuffer: Buffer, folder?: string): Promise<string>;
    deleteImage(publicId: string): Promise<void>;
}
