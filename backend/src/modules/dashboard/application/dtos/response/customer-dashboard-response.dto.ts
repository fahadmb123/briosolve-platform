export interface CustomerDashboardResponseDto {
  user: {
    name: string;
    email: string;
  };
  stats: {
    activeRequestsCount: number;
    quotationsReceivedCount: number;
    upcomingBookingsCount: number;
    completedServicesCount: number;
    totalCompletedSpend: number;
    estimatedSavings: number;
  };
  monthlySpending: Array<{
    month: string;
    spend: number;
  }>;
  categoryBreakdown: Array<{
    categoryName: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  quickCategories: Array<{
    id: string;
    name: string;
  }>;
  activeRequests: Array<{
    id: string;
    title: string;
    categoryName: string;
    urgency: string;
    specificDate?: string;
    availableTimeFrom?: string;
    availableTimeTo?: string;
    status: string;
    location: string;
    quotationsCount: number;
    minQuoteAmount?: number;
  }>;
  upcomingBookings: Array<{
    id: string;
    bookingNumber: string;
    status: string;
    scheduledDate?: string | null;
    scheduledTime?: string | null;
    serviceTitle: string;
    categoryName: string;
    providerName: string;
    providerAvatar?: string | null;
    totalAmount: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }>;
}
