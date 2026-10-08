import { v2 as cloudinary } from 'cloudinary';
import { IImageUploadService } from '../../domain/interfaces/IImageUpload.service.js';
import { ApplicationError } from "../../application/errors/applicationError.js";

export class CloudinaryService implements IImageUploadService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(fileBuffer: Buffer, folder: string = 'profiles'): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: folder },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(new ApplicationError("IMAGE_UPLOAD_FAILED", "Image upload failed", "INTERNAL"));
                    } else if (result) {
                        resolve(result.secure_url);
                    } else {
                        reject(new ApplicationError("IMAGE_UPLOAD_FAILED", "Unknown upload error", "INTERNAL"));
                    }
                }
            );

            uploadStream.end(fileBuffer);
        });
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new ApplicationError("IMAGE_DELETION_FAILED", "Image deletion failed", "INTERNAL");
        }
    }
}
