type Contract = import("../../prisma/contract").Contract;
type PublicTables = keyof Contract["storage"]["namespaces"]["public"]["tables"];

type DefaultModelRow<Table extends PublicTables> = 
    import("@prisma/orm-postgres/orm-client").DefaultModelRow<Contract, Table, "public">;

declare module "@prisma/client" {
    export type PrismaClient = typeof import("../shared/infrastructure/persistence/prisma/client").db;
    export const PrismaClient: new () => PrismaClient;

    export namespace Prisma {
        export type ModelPayload<Table extends PublicTables> = DefaultModelRow<Table>;

        export type UserGetPayload<T = {}> = DefaultModelRow<"users"> & {
            current_address?: AddressGetPayload | null;
            customer_profile?: CustomerProfileGetPayload | null;
            provider_profile?: ProviderProfileGetPayload | null;
        };
        export type usersGetPayload<T = {}> = UserGetPayload<T>;

        export type CustomerProfileGetPayload<T = {}> = DefaultModelRow<"customer_profiles"> & {
            user?: UserGetPayload | null;
        };
        export type customer_profilesGetPayload<T = {}> = CustomerProfileGetPayload<T>;

        export type ProviderProfileGetPayload<T = {}> = DefaultModelRow<"provider_profiles"> & {
            user?: UserGetPayload | null;
            verification_documents?: VerificationDocumentGetPayload[] | null;
            services?: ProviderServiceGetPayload[] | null;
        };
        export type provider_profilesGetPayload<T = {}> = ProviderProfileGetPayload<T>;

        export type VerificationDocumentGetPayload<T = {}> = DefaultModelRow<"provider_verification_documents"> & {
            files?: VerificationFileGetPayload[] | null;
        };
        export type provider_verification_documentsGetPayload<T = {}> = VerificationDocumentGetPayload<T>;

        export type VerificationFileGetPayload<T = {}> = DefaultModelRow<"provider_verification_files">;
        export type provider_verification_filesGetPayload<T = {}> = VerificationFileGetPayload<T>;

        export type ProviderAvailabilityGetPayload<T = {}> = DefaultModelRow<"provider_availability">;
        export type provider_availabilityGetPayload<T = {}> = ProviderAvailabilityGetPayload<T>;

        export type ProviderAvailabilityOverrideGetPayload<T = {}> = DefaultModelRow<"provider_availability_overrides">;
        export type provider_availability_overridesGetPayload<T = {}> = ProviderAvailabilityOverrideGetPayload<T>;

        export type ProviderServiceGetPayload<T = {}> = DefaultModelRow<"provider_services"> & {
            service?: ServiceGetPayload | null;
        };
        export type provider_servicesGetPayload<T = {}> = ProviderServiceGetPayload<T>;

        export type AddressGetPayload<T = {}> = DefaultModelRow<"addresses">;
        export type addressesGetPayload<T = {}> = AddressGetPayload<T>;

        export type CategoryGetPayload<T = {}> = DefaultModelRow<"categories"> & {
            services?: ServiceGetPayload[] | null;
        };
        export type categoriesGetPayload<T = {}> = CategoryGetPayload<T>;

        export type ServiceGetPayload<T = {}> = DefaultModelRow<"services"> & {
            category?: CategoryGetPayload | null;
        };
        export type servicesGetPayload<T = {}> = ServiceGetPayload<T>;

        export type UserAccountBlockGetPayload<T = {}> = DefaultModelRow<"user_account_blocks"> & {
            user?: UserGetPayload | null;
            admin?: UserGetPayload | null;
        };
        export type user_account_blocksGetPayload<T = {}> = UserAccountBlockGetPayload<T>;

        export type AccountReactivationRequestGetPayload<T = {}> = DefaultModelRow<"account_reactivation_requests"> & {
            user?: UserGetPayload | null;
            block?: UserAccountBlockGetPayload | null;
            reviewer?: UserGetPayload | null;
        };
        export type account_reactivation_requestsGetPayload<T = {}> = AccountReactivationRequestGetPayload<T>;

        export type NotificationGetPayload<T = {}> = DefaultModelRow<"notifications">;
        export type notificationsGetPayload<T = {}> = NotificationGetPayload<T>;

        export type PushSubscriptionGetPayload<T = {}> = DefaultModelRow<"push_subscriptions">;
        export type PushSubscriptionsGetPayload<T = {}> = DefaultModelRow<"push_subscriptions">;
        export type push_subscriptionsGetPayload<T = {}> = PushSubscriptionGetPayload<T>;

        export type NotificationCreateInput = import("@prisma/orm-postgres/orm-client").CreateInput<Contract, "notifications", "public">;
        export type notificationsCreateInput = NotificationCreateInput;

        export type PushSubscriptionCreateInput = import("@prisma/orm-postgres/orm-client").CreateInput<Contract, "push_subscriptions", "public">;
        export type PushSubscriptionsCreateInput = PushSubscriptionCreateInput;
        export type push_subscriptionsCreateInput = PushSubscriptionCreateInput;
        
        export type CreateInput<Table extends PublicTables> = import("@prisma/orm-postgres/orm-client").CreateInput<Contract, Table, "public">;
    }
}

