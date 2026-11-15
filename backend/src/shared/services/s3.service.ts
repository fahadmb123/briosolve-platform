import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ImageUploadService } from "../interfaces/services/IImageUpload.service";
import { ApplicationError } from "../errors/applicationError";
import { StorageUtil } from "../utils/storage.util";

function detectContentType(buffer: Buffer): { contentType: string; extension: string } {
    if (buffer.length >= 4) {
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
            return { contentType: "image/png", extension: "png" };
        }
        if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
            return { contentType: "image/jpeg", extension: "jpg" };
        }
        if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
            return { contentType: "image/gif", extension: "gif" };
        }
        if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
            return { contentType: "application/pdf", extension: "pdf" };
        }
        if (
            buffer.length >= 12 &&
            buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
            buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
        ) {
            return { contentType: "image/webp", extension: "webp" };
        }
    }
    return { contentType: "application/octet-stream", extension: "bin" };
}

export class S3Service implements ImageUploadService {
    private readonly client: S3Client;
    private readonly bucketName: string;

    constructor() {
        const region = process.env.AWS_REGION || "ap-south-1";
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";
        this.bucketName = process.env.AWS_S3_BUCKET_NAME || "";

        this.client = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    async uploadImage(fileBuffer: Buffer, folder: string = "uploads"): Promise<string> {
        try {
            const { contentType, extension } = detectContentType(fileBuffer);
            const sanitizedFolder = folder.replace(/\/+$/, "").replace(/^\/+/, "");
            const key = `${sanitizedFolder}/${randomUUID()}.${extension}`;

            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: fileBuffer,
                ContentType: contentType,
            });

            await this.client.send(command);
            return key;
        } catch (error) {
            console.error("S3 upload error:", error);
            throw new ApplicationError("IMAGE_UPLOAD_FAILED", "Image upload failed", "INTERNAL");
        }
    }

    async deleteImage(key: string): Promise<void> {
        if (!key) return;
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });
            await this.client.send(command);
        } catch (error) {
            console.error("S3 delete error:", error);
            throw new ApplicationError("IMAGE_DELETION_FAILED", "Image deletion failed", "INTERNAL");
        }
    }

    async deleteImageByUrl(url: string): Promise<void> {
        if (!url) return;
        try {
            const key = StorageUtil.extractKey(url);
            if (key) {
                await this.deleteImage(key);
            }
        } catch (error) {
            console.error("Failed to parse and delete S3 key:", error);
        }
    }
}
