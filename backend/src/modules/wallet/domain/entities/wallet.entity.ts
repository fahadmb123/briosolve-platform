export class Wallet {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly balance: number,
        public readonly currency: string,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}
