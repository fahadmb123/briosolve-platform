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
