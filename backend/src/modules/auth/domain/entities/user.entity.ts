export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly phone: string | null,
        public readonly passwordHash: string,
        public readonly role: string,
        public readonly status: string,
        public readonly email_verified: boolean,
        public readonly phone_verified: boolean,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}
