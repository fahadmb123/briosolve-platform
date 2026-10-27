import { PrismaUserRepository } from "../../../auth/infrastructure/repositories/prismaUser.repository";
import { PrismaNotificationRepository } from "../repositories/prismaNotification.repository";

export const userRepository = new PrismaUserRepository()
export const notificastionRepository = new PrismaNotificationRepository()