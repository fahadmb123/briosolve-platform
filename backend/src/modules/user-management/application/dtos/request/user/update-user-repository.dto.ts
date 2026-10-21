export interface UpdateUserRepositoryInput {
    name?: string;
    email?: string;
    phone?: string | null;
    role?: string;
    status?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    current_address_id?: string | null;
}