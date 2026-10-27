export interface CreateNotificationRequestDto {
    recipientId: string;
    type: string;
    title: string;
    message: string;
}