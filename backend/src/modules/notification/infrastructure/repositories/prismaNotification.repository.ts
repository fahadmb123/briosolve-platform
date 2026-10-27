import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import { NotificationMapper } from "../mappers/notification.mapper";
import {CreateNotificationData
    ,INotificationRepository
    , UpdateNotificationData
} from "../../domain/repositories/INotification.repository";



export class PrismaNotificationRepository implements INotificationRepository {

    async findById(id:string): Promise<Notification | null> {
        const record = await db.orm.public.notifications
            .where({id:id})
            .first()

        if (!record) return null

        return NotificationMapper.toDomain(record!)
    }

    async create(data: CreateNotificationData): Promise<Notification> {
        const record = await db.orm.public.notifications
            .create(
                NotificationMapper.toPersistence(data)
            )

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

    async update(id: string,data:UpdateNotificationData): Promise<Notification | null> {
        const record = await db.orm.public.notifications
            .where({id:id})
            .update(
                NotificationMapper.toPersistenceUpdate(data)
            )
        
        if (!record) return null

        return NotificationMapper.toDomain(record)
    }

    async markAllAsRead(recipientId: string): Promise<Notification[] | null> {
        const record = await db.orm.public.notifications
            .where({recipient_id:recipientId})
            .updateAll({
                is_read:true,
                read_at:new Date()
            })
        
        if (!record) return null

        return record.map((rec)=>{
            return NotificationMapper.toDomain(rec)
        })
    }

    async getUnreadCount(recipientId: string): Promise<number> {
        const count = await db.orm.public.notifications
            .where({
                recipient_id:recipientId,
                is_read:false
            })
            .count()

        return Number(count)
    }
}
