export interface ProviderDashboardResponseDto {
  provider: {
    id: string;
    name: string;
    businessName: string;
    isVerified: boolean;
    serviceArea: string;
    serviceRadiusKm: number;
    rating: number;
    reviewCount: number;
  };
  stats: {
    newRequestsCount: number;
    activeQuotationsCount: number;
    acceptedBookingsCount: number;
    completedServicesCount: number;
    averageRating: number;
    totalEarnings: number;
  };
  activeBookings?: Array<{
    id: string;
    bookingNumber: string;
    status: string;
    scheduledDate?: string | null;
    scheduledTime?: string | null;
    serviceTitle: string;
    categoryName: string;
    customerName: string;
    location: string;
    totalAmount: number;
  }>;
  opportunities: Array<{
    id: string;
    title: string;
    categoryName: string;
    description: string;
    urgency: string;
    location: string;
    customerName: string;
    quotationsCount: number;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
}
