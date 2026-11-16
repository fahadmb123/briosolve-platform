import { Category } from "./category.entity";

export interface ServiceQuestion {
    id: string;
    label: string;
    type: "TEXT" | "NUMBER" | "SELECT" | "MULTI_SELECT" | "BOOLEAN";
    options?: string[];
    is_required: boolean;
    placeholder?: string;
}

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
        public readonly category?: Category,
        public readonly questions?: ServiceQuestion[] | null,
    ){}
}
