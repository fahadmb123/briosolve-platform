export class Address {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly house_no: string | null,
        public readonly area: string,
        public readonly city: string,
        public readonly district: string,
        public readonly state: string,
        public readonly country: string,
        public readonly pincode: string,
        public readonly landmark: string | null,
        public readonly type: string,
        public readonly latitude: number | null,
        public readonly longitude: number | null,
        public readonly created_at: Date,
        public readonly updated_at: Date,
    ){}
}