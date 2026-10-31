export class PushSubscription {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly endpoint: string,
        public readonly p256dh: string,
        public readonly auth: string,
        public readonly createdAt: Date,
    ){}
}