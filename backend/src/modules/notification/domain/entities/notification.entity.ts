export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

export class Notification {
  constructor(
    public readonly id: string,
    public readonly recipient_id: string,
    public readonly title: string,
    public readonly message: string,
    public readonly type: NotificationType,
    public readonly is_read: boolean,
    public readonly read_at: Date | null,
    public readonly created_at: Date,
  ) {}
}