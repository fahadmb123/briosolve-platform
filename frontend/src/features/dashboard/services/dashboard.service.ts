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
  };
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
  };
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
};
