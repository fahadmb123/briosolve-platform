export interface CreateNotificationRequestDto {
    recipientId: string;
    type: string;
    title_code:string
    title: string;
    message: string;
}