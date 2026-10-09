import { Varchar } from "@prisma/orm-postgres/target/codec-types";

export class Category {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string | null,
        public readonly status: "ACTIVE" | "INACTIVE",
        public readonly image: string,
        public readonly created_at: Date,
        public readonly updated_at: Date,
    ){}
}