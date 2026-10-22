type Contract = import("../../prisma/contract").Contract;
type Models = import("../../prisma/contract").Models;
type DefaultModelRow<Table extends keyof Contract["storage"]["namespaces"]["public"]["tables"]> = 
    import("@prisma/orm-postgres/family-contract/types").DefaultModelRow<Contract, Table, "public">;

declare module "@prisma/client" {
    export namespace Prisma {
        export type UserGetPayload<T = {}> = DefaultModelRow<"users"> & Partial<Models.public_users>;
        export type usersGetPayload<T = {}> = UserGetPayload<T>;
        export type CustomerProfileGetPayload<T = {}> = DefaultModelRow<"customer_profiles"> & Partial<Models.public_customer_profiles>;
        export type customer_profilesGetPayload<T = {}> = CustomerProfileGetPayload<T>;
        export type ProviderProfileGetPayload<T = {}> = DefaultModelRow<"provider_profiles"> & Partial<Models.public_provider_profiles>;
        export type provider_profilesGetPayload<T = {}> = ProviderProfileGetPayload<T>;
        export type VerificationDocumentGetPayload<T = {}> = DefaultModelRow<"provider_verification_documents"> & Partial<Models.public_provider_verification_documents>;
        export type provider_verification_documentsGetPayload<T = {}> = VerificationDocumentGetPayload<T>;
        export type VerificationFileGetPayload<T = {}> = DefaultModelRow<"provider_verification_files"> & Partial<Models.public_provider_verification_files>;
        export type provider_verification_filesGetPayload<T = {}> = VerificationFileGetPayload<T>;
        export type ProviderAvailabilityGetPayload<T = {}> = DefaultModelRow<"provider_availability"> & Partial<Models.public_provider_availability>;
        export type provider_availabilityGetPayload<T = {}> = ProviderAvailabilityGetPayload<T>;
        export type ProviderAvailabilityOverrideGetPayload<T = {}> = DefaultModelRow<"provider_availability_overrides"> & Partial<Models.public_provider_availability_overrides>;
        export type provider_availability_overridesGetPayload<T = {}> = ProviderAvailabilityOverrideGetPayload<T>;
        export type ProviderServiceGetPayload<T = {}> = DefaultModelRow<"provider_services"> & Partial<Models.public_provider_services>;
        export type provider_servicesGetPayload<T = {}> = ProviderServiceGetPayload<T>;
        export type AddressGetPayload<T = {}> = DefaultModelRow<"addresses"> & Partial<Models.public_addresses>;
        export type addressesGetPayload<T = {}> = AddressGetPayload<T>;
        export type CategoryGetPayload<T = {}> = DefaultModelRow<"categories"> & Partial<Models.public_categories>;
        export type categoriesGetPayload<T = {}> = CategoryGetPayload<T>;
        export type ServiceGetPayload<T = {}> = DefaultModelRow<"services"> & Partial<Models.public_services>;
        export type servicesGetPayload<T = {}> = ServiceGetPayload<T>;
        export type UserAccountBlockGetPayload<T = {}> = DefaultModelRow<"user_account_blocks"> & Partial<Models.public_user_account_blocks>;
        export type user_account_blocksGetPayload<T = {}> = UserAccountBlockGetPayload<T>;
        export type AccountReactivationRequestGetPayload<T = {}> = DefaultModelRow<"account_reactivation_requests"> & Partial<Models.public_account_reactivation_requests>;
        export type account_reactivation_requestsGetPayload<T = {}> = AccountReactivationRequestGetPayload<T>;
    }
}
