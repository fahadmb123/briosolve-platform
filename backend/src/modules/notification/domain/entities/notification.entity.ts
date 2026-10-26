export class Notification {
    constructor(
        public readonly id: string,
        public readonly recipientId: string,
        public readonly type: string,
        public readonly title: string,
        public readonly message: string,
        public readonly data: Record<string, unknown> | null,
        public readonly isRead: boolean,
        public readonly readAt: Date | null,
        public readonly createdAt: Date
    ) {}
}