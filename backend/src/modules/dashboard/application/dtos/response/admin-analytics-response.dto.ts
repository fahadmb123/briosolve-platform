export interface AnalyticsKpis {
  gmv: number;
  platformRevenue: number;
  totalBookings: number;
  completedBookings: number;
  averageOrderValue: number;
  quotationToBookingRate: number;
  customerGrowthRate: number;
  activeProviders: number;
}

export interface VolumeTrendPoint {
  label: string;
  volume: number;
  revenue: number;
  bookings: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropoffRate: number;
}

export interface CategoryShare {
  categoryId: string;
  categoryName: string;
  volume: number;
  bookingsCount: number;
  percentage: number;
}

export interface RegionalShare {
  region: string;
  bookingsCount: number;
  volume: number;
}

export interface ProviderFulfillmentMetric {
  metric: string;
  value: string;
  score: number;
}

export interface AdminAnalyticsResponseDto {
  timeframe: string;
  kpis: AnalyticsKpis;
  volumeTrends: VolumeTrendPoint[];
  funnel: FunnelStage[];
  categoryShares: CategoryShare[];
  regionalShares: RegionalShare[];
  fulfillmentMetrics: ProviderFulfillmentMetric[];
}
