export interface GetCustomerReviewsRequestDto {
  customerId: string;
  search?: string;
  rating?: number;
  page?: number;
  limit?: number;
}
