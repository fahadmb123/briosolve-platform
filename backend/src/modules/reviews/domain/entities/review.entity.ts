export interface ReviewAspectRatings {
  punctuality?: number;
  serviceQuality?: number;
  communication?: number;
  valueForMoney?: number;
  [key: string]: number | undefined;
}

export class Review {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly customerId: string,
    public readonly providerId: string,
    public readonly rating: number,
    public readonly title: string | null,
    public readonly comment: string,
    public readonly aspectRatings: ReviewAspectRatings | null,
    public readonly providerReply: string | null,
    public readonly providerRepliedAt: Date | null,
    public readonly isReported: boolean,
    public readonly isHidden: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly customerName?: string | null,
    public readonly customerAvatar?: string | null,
    public readonly providerName?: string | null,
    public readonly providerBusinessName?: string | null,
    public readonly providerAvatar?: string | null,
    public readonly providerUserId?: string | null,
    public readonly bookingNumber?: string | null,
    public readonly serviceTitle?: string | null
  ) {}
}
