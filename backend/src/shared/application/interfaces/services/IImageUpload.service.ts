export interface ImageUploadService {
    uploadImage(fileBuffer: Buffer, folder?: string): Promise<string>;
    deleteImage(publicId: string): Promise<void>;
    deleteImageByUrl(url: string): Promise<void>;
}
