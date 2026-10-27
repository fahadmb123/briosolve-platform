export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

export class Notification {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly message: string,
    public readonly type: NotificationType,
    public readonly isRead: boolean,
    public readonly readAt: Date | null,
    public readonly createdAt: Date,
  ) {}
}