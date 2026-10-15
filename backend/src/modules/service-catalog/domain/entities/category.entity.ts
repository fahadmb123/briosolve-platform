import { Service } from "./service.entity";

export class Category {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly status: "ACTIVE" | "INACTIVE",
        public readonly image: string,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly services?: Service[]
    ){}
}