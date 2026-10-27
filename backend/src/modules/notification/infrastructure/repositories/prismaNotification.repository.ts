import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import {CreateNotificationData,INotificationRepository} from "../../domain/repositories/INotification.repository";
import { NotificationMapper } from "../mappers/notification.mapper";

export class PrismaNotificationRepository implements INotificationRepository {

    async findById(id:string): Promise<Notification> {
        const record = await db.orm.public.notifications
            .where({id:id}).first()

        return NotificationMapper.toDomain(record!)
    }

    async create(data: CreateNotificationData): Promise<Notification> {
        const record = await db.orm.public.notifications
            .create(NotificationMapper.toPersistence(data))

        return NotificationMapper.toDomain(record)
    }

    async findByRecipientId(id: string): Promise<Notification[]> {
        const record = await db.orm.public.notifications
            .where({recipient_id:id})
            .all()

        return record.map((rec)=>{
            return NotificationMapper.toDomain(rec)
        })
    }
}
