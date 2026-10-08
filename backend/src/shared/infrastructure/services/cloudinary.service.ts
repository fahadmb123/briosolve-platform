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
            // Using ApplicationError or just logging in the infrastructure layer
            console.error('Cloudinary delete error:', error);
            throw new ApplicationError("IMAGE_DELETION_FAILED", "Image deletion failed", "INTERNAL");
        }
    }

    async deleteImageByUrl(url: string): Promise<void> {
        if (!url || !url.includes('cloudinary.com')) return;
        
        try {
            const splitUrl = url.split('/upload/');
            if (splitUrl.length > 1) {
                const pathWithVersion = splitUrl[1];
                const path = pathWithVersion.replace(/^v\d+\//, '');
                const publicId = path.substring(0, path.lastIndexOf('.'));
                
                if (publicId) {
                    await this.deleteImage(publicId);
                }
            }
        } catch (error) {
            // Safe fallback, we log inside the infra layer rather than bubbling up to controller
            console.error('Failed to parse and delete Cloudinary URL:', error);
        }
    }
}
