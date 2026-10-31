import { PrismaUserRepository } from "../../../auth/infrastructure/repositories/prismaUser.repository";
import { PrismaNotificationRepository } from "../repositories/prismaNotification.repository";
import { PrismaPushSubscriptionRepository } from "../repositories/prismaPushSubscription.repository";

export const userRepository = new PrismaUserRepository();
export const notificastionRepository = new PrismaNotificationRepository();
export const pushSubscriptionRepository = new PrismaPushSubscriptionRepository();
