export class StorageUtil {
    static getPublicUrl(keyOrUrl?: string | null): string | null {
        if (!keyOrUrl) return null;
        if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
            return keyOrUrl;
        }
        const baseUrl = process.env.AWS_S3_BASE_URL || (process.env.AWS_S3_BUCKET_NAME && process.env.AWS_REGION ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com` : "");
        if (!baseUrl) {
            return keyOrUrl;
        }
        const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const cleanKey = keyOrUrl.startsWith("/") ? keyOrUrl.slice(1) : keyOrUrl;
        return `${cleanBase}/${cleanKey}`;
    }

    static extractKey(keyOrUrl?: string | null): string | null {
        if (!keyOrUrl) return null;
        if (!keyOrUrl.startsWith("http://") && !keyOrUrl.startsWith("https://")) {
            return keyOrUrl;
        }
        try {
            const parsed = new URL(keyOrUrl);
            let pathname = parsed.pathname.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
            const bucketName = process.env.AWS_S3_BUCKET_NAME;
            if (bucketName && pathname.startsWith(`${bucketName}/`)) {
                pathname = pathname.slice(bucketName.length + 1);
            }
            return decodeURIComponent(pathname);
        } catch {
            return keyOrUrl;
        }
    }
}
