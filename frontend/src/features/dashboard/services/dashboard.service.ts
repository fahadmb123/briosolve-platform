import { apiClient } from "../../../shared/api/Client";

export interface CustomerDashboardData {
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
    estimatedSavings?: number;
  };
  monthlySpending?: Array<{
    month: string;
    spend: number;
  }>;
  categoryBreakdown?: Array<{
    categoryName: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  quickCategories?: Array<{
    id: string;
    name: string;
  }>;
  activeRequests: Array<{
    id: string;
    title: string;
    categoryName: string;
    urgency: string;
    specificDate?: string;
    availableTimeFrom: string;
    availableTimeTo: string;
    status: string;
    location: string;
    quotationsCount: number;
    minQuoteAmount?: number;
  }>;
  upcomingBookings: Array<{
    id: string;
    bookingNumber: string;
    status: string;
    scheduledDate?: string;
    scheduledTime?: string;
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

export interface ProviderDashboardData {
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
    scheduledDate?: string;
    scheduledTime?: string;
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

export interface AdminDashboardData {
  kpis: {
    totalCustomers: number;
    totalProviders: number;
    verifiedProviders: number;
    pendingVerifications: number;
    activeRequests: number;
    totalQuotations: number;
    activeBookings: number;
    openInvestigations: number;
    totalVolume?: number;
    currentMonthVolume?: number;
    currentMonthSales?: number;
  };
  monthlyTrends?: Array<{
    month: string;
    bookingsCount: number;
    quotationsCount: number;
    volume: number;
  }>;
  recentOrders?: Array<{
    id: string;
    bookingNumber: string;
    customerName: string;
    serviceTitle: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
  operationalHealth: {
    dbStatus: string;
    redisStatus: string;
    uptimeSeconds: number;
  };
}

export interface AdminAuditLogItem {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  actor?: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  metadata?: Record<string, any>;
}

export interface AdminAuditLogsResponse {
  logs: AdminAuditLogItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminAnalyticsKpis {
  gmv: number;
  platformRevenue: number;
  totalBookings: number;
  completedBookings: number;
  averageOrderValue: number;
  quotationToBookingRate: number;
  customerGrowthRate: number;
  activeProviders: number;
}

export interface AdminVolumeTrendPoint {
  label: string;
  volume: number;
  revenue: number;
  bookings: number;
}

export interface AdminFunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoffRate: number;
}

export interface AdminCategoryShare {
  categoryId: string;
  categoryName: string;
  volume: number;
  bookingsCount: number;
  percentage: number;
}

export interface AdminRegionalShare {
  region: string;
  bookingsCount: number;
  volume: number;
}

export interface AdminFulfillmentMetric {
  metric: string;
  value: string;
  score: number;
}

export interface AdminAnalyticsResponse {
  timeframe: string;
  kpis: AdminAnalyticsKpis;
  volumeTrends: AdminVolumeTrendPoint[];
  funnel: AdminFunnelStage[];
  categoryShares: AdminCategoryShare[];
  regionalShares: AdminRegionalShare[];
  fulfillmentMetrics: AdminFulfillmentMetric[];
}

export const dashboardService = {
  async getCustomerDashboard(): Promise<CustomerDashboardData> {
    const res = await apiClient.get<{ success: boolean; data: CustomerDashboardData }>("/api/dashboard/customer");
    return res.data.data;
  },
  async getProviderDashboard(): Promise<ProviderDashboardData> {
    const res = await apiClient.get<{ success: boolean; data: ProviderDashboardData }>("/api/dashboard/provider");
    return res.data.data;
  },
  async getAdminDashboard(): Promise<AdminDashboardData> {
    const res = await apiClient.get<{ success: boolean; data: AdminDashboardData }>("/api/dashboard/admin");
    return res.data.data;
  },
  async getAdminAuditLogs(params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }): Promise<AdminAuditLogsResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.type && params.type !== "ALL") query.append("type", params.type);
    if (params?.search) query.append("search", params.search);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await apiClient.get<{ success: boolean; data: AdminAuditLogsResponse }>(
      `/api/dashboard/admin/audit-logs${queryString}`
    );
    return res.data.data;
  },
  async getAdminAnalytics(timeframe?: string): Promise<AdminAnalyticsResponse> {
    const query = timeframe ? `?timeframe=${encodeURIComponent(timeframe)}` : "";
    const res = await apiClient.get<{ success: boolean; data: AdminAnalyticsResponse }>(
      `/api/dashboard/admin/analytics${query}`
    );
    return res.data.data;
  },
};
