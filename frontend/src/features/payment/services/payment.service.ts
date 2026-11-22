import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  CreatePaymentOrderPayload,
  CreatePaymentOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
  CreateBookingPaymentOrderPayload,
  CreateBookingPaymentOrderResponse,
  VerifyBookingPaymentPayload,
  VerifyBookingPaymentResponse
} from "../types/payment.types";

export const createPaymentOrderService = async (
  payload: CreatePaymentOrderPayload
): Promise<response<CreatePaymentOrderResponse>> => {
  const res = await apiClient.post("/api/payment/create-order", payload);
  return res.data;
};

export const verifyPaymentService = async (
  payload: VerifyPaymentPayload
): Promise<response<VerifyPaymentResponse>> => {
  const res = await apiClient.post("/api/payment/verify-and-accept", payload);
  return res.data;
};

export const createBookingPaymentOrderService = async (
  payload: CreateBookingPaymentOrderPayload
): Promise<response<CreateBookingPaymentOrderResponse>> => {
  const res = await apiClient.post("/api/payment/create-booking-order", payload);
  return res.data;
};

export const verifyBookingPaymentService = async (
  payload: VerifyBookingPaymentPayload
): Promise<response<VerifyBookingPaymentResponse>> => {
  const res = await apiClient.post("/api/payment/verify-booking-payment", payload);
  return res.data;
};
