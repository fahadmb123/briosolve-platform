export class Service {
    constructor(
        public readonly id: string,
        public readonly category_id: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly image: string | null,
        public readonly status: "ACTIVE" | "INACTIVE",
        public readonly created_at: Date,
        public readonly updated_at: Date,
    ){}
}
