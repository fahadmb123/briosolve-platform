export interface GetMessagesRequestDto {
    conversationId: string;
    userId: string;
    cursor?: string;
    limit?: number;
}

