export class CommonResponse<T> {

    private constructor(
        private readonly success: boolean,
        private readonly message: string,
        private readonly data: T | null,
        private readonly errors: unknown[] | null,
        private readonly timestamp: string,
        private readonly meta: Record<string, unknown> | null
    ) {}

    static success<T>(message: string,data: T | null = null,meta: Record<string, unknown> | null = null): CommonResponse<T> {
        return new CommonResponse(
            true,
            message,
            data,
            null,
            new Date().toISOString(),
            meta
        );
    }

    static error(message: string,errors: unknown[] | null = null): CommonResponse<null> {
        return new CommonResponse(
            false,
            message,
            null,
            errors,
            new Date().toISOString(),
            null
        );
    }

    toJSON() {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
            errors: this.errors,
            timestamp: this.timestamp,
            meta: this.meta
        };
    }
}