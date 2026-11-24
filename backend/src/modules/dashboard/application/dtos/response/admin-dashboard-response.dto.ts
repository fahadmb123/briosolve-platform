export interface AdminDashboardResponseDto {
  kpis: {
    totalCustomers: number;
    totalProviders: number;
    verifiedProviders: number;
    pendingVerifications: number;
    activeRequests: number;
    totalQuotations: number;
    activeBookings: number;
    openInvestigations: number;
    totalVolume: number;
    currentMonthVolume: number;
    currentMonthSales: number;
  };
  monthlyTrends: Array<{
    month: string;
    bookingsCount: number;
    quotationsCount: number;
    volume: number;
  }>;
  recentOrders: Array<{
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
