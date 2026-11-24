export interface GetAdminAnalyticsRequestDto {
  timeframe?: '7D' | '30D' | '90D' | '1Y' | 'ALL' | string;
}
