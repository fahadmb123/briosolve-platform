export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR";

export interface NotificationResponseDto {
    id: string;
    recipient_id: string;
    type: NotificationType;
    title: string;
    message: string;
    is_read: boolean;
    read_at: Date | null;
    created_at: Date;
}