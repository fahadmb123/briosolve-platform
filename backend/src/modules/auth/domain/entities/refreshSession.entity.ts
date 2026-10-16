export class RefreshSession {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly tokenHash: string,
        public readonly familyId: string,
        public readonly expiresAt: Date,
        public readonly revokedAt: Date | null,
        public readonly userAgent: string | null,
        public readonly ipAddress: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    public isRevoked(): boolean {
        return this.revokedAt !== null;
    }

    public isExpired(): boolean {
        return this.expiresAt.getTime() <= Date.now();
    }

    public isValid(): boolean {
        return !this.isRevoked() && !this.isExpired();
    }
}
