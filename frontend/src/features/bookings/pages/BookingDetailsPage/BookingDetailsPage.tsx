import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetBookingById,
  useUpdateBookingStatus,
  useReportBookingMismatch,
  useResolveBookingMismatch
} from "../../hooks/useBookingMutations";
import type { BookingItem, BookingStatus, BookingStatusHistoryItem } from "../../types/booking.types";
import { BookingStatusModal, ServiceMismatchModal } from "../../components";
import { RaiseDisputeModal } from "../../../support";
import { ReviewModal, BookingReviewCard, useBookingReviewQuery } from "../../../reviews";
import { useGetProviderPublicProfile } from "../../../nearby-providers/hooks/mutations/useGetProviderPublicProfile";
import { ProviderDetailsModal } from "../../../nearby-providers/components/ProviderDetailsModal";
import type { ProviderPublicProfileData } from "../../../nearby-providers/services/nearbyProviders.service";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { createBookingPaymentOrderService, verifyBookingPaymentService } from "../../../payment/services/payment.service";
import { loadRazorpayScript, resetRazorpay } from "../../../payment/utils/razorpay.utils";
import "./BookingDetailsPage.css";

interface BookingDetailsPageProps {
  role?: "customer" | "provider";
}

export const BookingDetailsPage: React.FC<BookingDetailsPageProps> = ({ role: roleProp }) => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const role: "customer" | "provider" =
    roleProp || (location.pathname.startsWith("/provider") ? "provider" : "customer");
  const isProvider = role === "provider";

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);

  const initialBooking = (location.state as { booking?: BookingItem } | null)?.booking || null;

  const { data: responseData, isLoading, error, refetch } = useGetBookingById(bookingId);
  const updateStatusMutation = useUpdateBookingStatus();
  const reportMismatchMutation = useReportBookingMismatch();
  const resolveMismatchMutation = useResolveBookingMismatch();

  const booking: BookingItem | null = responseData?.data || initialBooking;

  const [statusModalBooking, setStatusModalBooking] = useState<BookingItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<BookingStatus | null>(null);
  const [isMismatchModalOpen, setIsMismatchModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const activeRazorpayRef = useRef<any>(null);

  const { data: reviewData, refetch: refetchReview } = useBookingReviewQuery(booking?.id);
  const existingReview = reviewData?.data || null;

  const targetProviderId = booking?.providerUserId || booking?.providerId;

  const { data: providerProfileRes } = useGetProviderPublicProfile(
    !isProvider && targetProviderId ? targetProviderId : undefined
  );
  const publicProvider = providerProfileRes?.data || null;

  const modalProviderData = useMemo(() => {
    if (publicProvider) return publicProvider;
    if (!booking) return null;
    return {
      id: targetProviderId || booking.providerId,
      name: booking.providerName || "Service Provider",
      email: booking.providerEmail || "",
      phone: booking.providerPhone || null,
      status: "ACTIVE",
      current_address_id: booking.addressText || null,
      provider_profile: {
        id: booking.providerId,
        user_id: booking.providerUserId || "",
        business_name: booking.providerBusinessName || booking.providerName || "Service Provider",
        experience: booking.providerExperience || "Experienced",
        bio: booking.providerBio || "",
        profile_image: booking.providerAvatar || null,
        completed_jobs: booking.providerCompletedJobs ?? 0,
        kyc_status: "APPROVED",
        skills: null,
        service_radius_km: null
      },
      services: [],
      availability: []
    } as ProviderPublicProfileData;
  }, [publicProvider, booking, targetProviderId]);

  useEffect(() => {
    return () => {
      if (activeRazorpayRef.current && typeof activeRazorpayRef.current.close === "function") {
        try {
          activeRazorpayRef.current.close();
        } catch { }
        activeRazorpayRef.current = null;
      }
      resetRazorpay();
    };
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBack = () => {
    if (isProvider) {
      navigate("/provider/bookings");
    } else {
      navigate("/bookings");
    }
  };

  const handleChat = () => {
    if (!booking) return;
    if (isProvider) {
      if (!booking.customerId) {
        toast.error("Customer details are unavailable for this booking");
        return;
      }
      navigate(`/provider/messages?recipientId=${booking.customerId}`, {
        state: {
          recipientId: booking.customerId,
          recipientName: booking.customerName || "Customer",
          requestId: booking.serviceRequestId,
          requestTitle: booking.serviceRequestTitle || "Service Job",
          categoryName: booking.categoryName || undefined,
          location: booking.addressText || undefined
        }
      });
    } else {
      const targetProviderId = booking.providerUserId || booking.providerId;
      if (!targetProviderId) {
        toast.error("Provider details are unavailable for this booking");
        return;
      }
      navigate(`/messages?recipientId=${targetProviderId}`, {
        state: {
          recipientId: targetProviderId,
          recipientName: booking.providerBusinessName || booking.providerName || "Service Provider",
          requestId: booking.serviceRequestId,
          requestTitle: booking.serviceRequestTitle || "Service Booking",
          categoryName: booking.categoryName || undefined,
          location: booking.addressText || undefined
        }
      });
    }
  };

  const handleViewServiceRequest = () => {
    if (!booking) return;
    if (isProvider) {
      navigate(`/provider/service-requests/${booking.serviceRequestId}`);
    } else {
      navigate(`/my-requests/${booking.serviceRequestId}`);
    }
  };

  const handleTriggerStatusChange = (newStatus: BookingStatus) => {
    if (!booking) return;
    setStatusModalBooking(booking);
    setTargetStatus(newStatus);
  };

  const handleCloseStatusModal = () => {
    setStatusModalBooking(null);
    setTargetStatus(null);
  };

  const handleConfirmStatusChange = (
    item: BookingItem,
    newStatus: BookingStatus,
    notes?: string,
    totalAmount?: number
  ) => {
    updateStatusMutation.mutate(
      {
        id: item.id,
        payload: {
          status: newStatus,
          notes,
          totalAmount
        }
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "EN_ROUTE"
              ? "Technician marked as On The Way"
              : newStatus === "INSPECTION"
                ? "Inspection / Diagnostic started"
                : newStatus === "IN_PROGRESS"
                  ? "Job marked as In Progress"
                  : newStatus === "PAYMENT_PENDING"
                    ? "Total payment confirmed and sent to customer"
                    : newStatus === "COMPLETED"
                      ? "Job marked as Completed"
                      : newStatus === "CANCELLED"
                        ? "Booking cancelled. 100% refund initiated to customer."
                        : "Booking status updated"
          );
          handleCloseStatusModal();
          refetch();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || err?.message || "Failed to update booking status"
          );
        }
      }
    );
  };

  const handleReportMismatchSubmit = (payload: {
    diagnosis: string;
    visitFee?: number;
    suggestedCategory?: string | null;
    suggestedCategoryId?: string | null;
  }) => {
    if (!booking) return;
    reportMismatchMutation.mutate(
      { id: booking.id, payload },
      {
        onSuccess: () => {
          toast.success("Diagnosis submitted to customer");
          setIsMismatchModalOpen(false);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to submit diagnosis");
        }
      }
    );
  };

  const handleResolveMismatch = (action: "ACCEPT" | "DECLINE") => {
    if (!booking) return;
    resolveMismatchMutation.mutate(
      { id: booking.id, action },
      {
        onSuccess: () => {
          toast.success(action === "ACCEPT" ? "Diagnosis accepted and booking closed" : "Diagnosis report declined");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to respond to report");
        }
      }
    );
  };

  const handlePayRemainingBalance = async () => {
    if (!booking || isProcessingPayment) return;
    setIsProcessingPayment(true);
    resetRazorpay();

    const isLoaded = await loadRazorpayScript(true);
    if (!isLoaded) {
      toast.error("Unable to load Razorpay payment gateway. Please check your internet connection.");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const orderRes = await createBookingPaymentOrderService({ bookingId: booking.id });
      const orderData = orderRes.data;
      if (!orderData) {
        toast.error("Failed to generate payment order");
        setIsProcessingPayment(false);
        return;
      }

      let rzp: any = null;

      const cleanupRazorpayModal = () => {
        if (rzp && typeof rzp.close === "function") {
          try {
            rzp.close();
          } catch { }
        }
        if (activeRazorpayRef.current && typeof activeRazorpayRef.current.close === "function") {
          try {
            activeRazorpayRef.current.close();
          } catch { }
          activeRazorpayRef.current = null;
        }
        resetRazorpay();
      };

      const options = {
        key: orderData.keyId,
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency || "INR",
        name: "Service Settle",
        description: `Remaining Balance for Booking #${booking.bookingNumber}`,
        order_id: orderData.orderId,
        prefill: {
          name: (profile as any)?.full_name || user?.name || "",
          email: user?.email || "",
          contact: (profile as any)?.phone || user?.phone || ""
        },
        theme: {
          color: "#ea580c"
        },
        modal: {
          ondismiss: () => {
            cleanupRazorpayModal();
            setIsProcessingPayment(false);
            toast("Payment window closed. You can settle the remaining balance whenever you are ready.", {
              icon: "ℹ️"
            });
          }
        },
        handler: async (paymentResponse: any) => {
          cleanupRazorpayModal();
          try {
            const verifyRes = await verifyBookingPaymentService({
              bookingId: booking.id,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature
            });

            if (verifyRes.data?.success) {
              toast.success("Remaining balance settled successfully! Booking completed.");
              refetch();
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to verify balance payment");
          } finally {
            setIsProcessingPayment(false);
          }
        }
      };

      rzp = new (window as any).Razorpay(options);
      activeRazorpayRef.current = rzp;

      rzp.on("payment.failed", (response: any) => {
        cleanupRazorpayModal();
        setIsProcessingPayment(false);
        toast.error(`Payment failed: ${response?.error?.description || "Transaction declined"}`);
      });

      rzp.open();
    } catch (err: any) {
      setIsProcessingPayment(false);
      resetRazorpay();
      toast.error(err?.response?.data?.message || err?.message || "Failed to initiate payment");
    }
  };

  const getStatusMeta = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return { label: "Confirmed", icon: "fas fa-check-circle", variant: "confirmed" };
      case "EN_ROUTE":
        return { label: "On The Way", icon: "fas fa-route", variant: "route" };
      case "INSPECTION":
        return { label: "Inspection", icon: "fas fa-clipboard-check", variant: "inspection" };
      case "IN_PROGRESS":
        return { label: "In Progress", icon: "fas fa-tools", variant: "in-progress" };
      case "PAYMENT_PENDING":
        return { label: "Payment Pending", icon: "fas fa-file-invoice-dollar", variant: "warning" };
      case "COMPLETED":
        return { label: "Completed", icon: "fas fa-award", variant: "completed" };
      case "CLOSED":
        return { label: "Diagnosis Closed", icon: "fas fa-stethoscope", variant: "completed" };
      case "CANCELLED":
        return { label: "Cancelled", icon: "fas fa-ban", variant: "cancelled" };
      default:
        return { label: status, icon: "fas fa-info-circle", variant: "confirmed" };
    }
  };

  const timelineItems = useMemo<BookingStatusHistoryItem[]>(() => {
    if (!booking) return [];
    if (booking.statusHistory && booking.statusHistory.length > 0) {
      return booking.statusHistory;
    }
    const items: BookingStatusHistoryItem[] = [
      {
        status: "CONFIRMED",
        note: "Booking confirmed and payment escrow secured.",
        timestamp: booking.createdAt,
        authorName: "System"
      }
    ];
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        items.push({
          status: booking.status,
          note: booking.notes,
          timestamp: booking.updatedAt,
          authorName: booking.providerBusinessName || booking.providerName || "Service Provider"
        });
      }
    }
    return items;
  }, [booking]);

  const cancellationReason = useMemo<string | null>(() => {
    if (!booking) return null;
    if (timelineItems.length > 0) {
      const cancelItem = timelineItems.slice().reverse().find((item) => item.status === "CANCELLED" || item.status === "CLOSED");
      if (cancelItem?.note && cancelItem.note.trim()) {
        return cancelItem.note.trim();
      }
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed)) {
          const cancelItem = parsed.slice().reverse().find((item: any) => item.status === "CANCELLED" || item.status === "CLOSED");
          if (cancelItem?.note && cancelItem.note.trim()) return cancelItem.note.trim();
        }
      } catch {
        return booking.notes.trim();
      }
    }
    return null;
  }, [booking, timelineItems]);

  const cancellationAuthor = useMemo<string | null>(() => {
    if (!booking) return null;
    if (timelineItems.length > 0) {
      const cancelItem = timelineItems.slice().reverse().find((item) => item.status === "CANCELLED" || item.status === "CLOSED");
      if (cancelItem?.authorName) return cancelItem.authorName;
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed)) {
          const cancelItem = parsed.slice().reverse().find((item: any) => item.status === "CANCELLED" || item.status === "CLOSED");
          if (cancelItem?.authorName) return cancelItem.authorName;
        }
      } catch { }
    }
    return null;
  }, [booking, timelineItems]);

  const isCancelledByCustomer = useMemo<boolean>(() => {
    if (!cancellationAuthor) return false;
    const lower = cancellationAuthor.toLowerCase();
    return lower === "customer" || (booking?.customerName ? lower === booking.customerName.toLowerCase() : false);
  }, [cancellationAuthor, booking]);

  if (isLoading && !booking) {
    return (
      <div className={`bkdet-page-container bkdet-skeleton-container ${isProvider ? "is-provider" : "is-customer"}`} aria-hidden="true">
        <button type="button" className="bkdet-back-link" onClick={handleBack}>
          <i className="fas fa-arrow-left" />
          <span>Back to Bookings</span>
        </button>

        <div className="bkdet-header-card">
          <div className="bkdet-header-left">
            <div className="bkdet-badge-row">
              <div className="bkdet-sk-shimmer bkdet-sk-pill" style={{ width: "120px" }} />
              <div className="bkdet-sk-shimmer bkdet-sk-pill" style={{ width: "100px" }} />
              <div className="bkdet-sk-shimmer bkdet-sk-pill" style={{ width: "115px" }} />
              <div className="bkdet-sk-shimmer bkdet-sk-status" style={{ width: "105px" }} />
            </div>

            <div className="bkdet-sk-shimmer" style={{ width: "65%", height: "30px", borderRadius: "6px", margin: "10px 0 4px" }} />
            <div className="bkdet-sk-shimmer" style={{ width: "180px", height: "14px", borderRadius: "4px" }} />
          </div>

          <div className="bkdet-header-actions">
            <div className="bkdet-sk-shimmer bkdet-sk-btn" style={{ width: "85px" }} />
            <div className="bkdet-sk-shimmer bkdet-sk-btn" style={{ width: "135px" }} />
          </div>
        </div>

        <div className="bkdet-layout-grid">
          <div className="bkdet-col-main">
            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "190px", height: "20px", borderRadius: "4px" }} />
                </div>
              </div>

              <div className="bkdet-schedule-block">
                <div className="bkdet-sk-shimmer" style={{ width: "64px", height: "64px", borderRadius: "12px", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "220px", height: "20px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "150px", height: "15px", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", padding: "0 10px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div className="bkdet-sk-shimmer bkdet-sk-stepper-circle" />
                    <div className="bkdet-sk-shimmer" style={{ width: "60px", height: "12px", borderRadius: "4px" }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "230px", height: "20px", borderRadius: "4px" }} />
                </div>
                <div className="bkdet-sk-shimmer" style={{ width: "80px", height: "24px", borderRadius: "9999px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "14px" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div className="bkdet-sk-shimmer" style={{ width: "110px", height: "22px", borderRadius: "9999px" }} />
                      <div className="bkdet-sk-shimmer" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />
                    </div>
                    <div className="bkdet-sk-tl-bubble">
                      <div className="bkdet-sk-shimmer" style={{ width: "100%", height: "14px", borderRadius: "4px" }} />
                      <div className="bkdet-sk-shimmer" style={{ width: "65%", height: "14px", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div className="bkdet-sk-shimmer" style={{ width: "100px", height: "22px", borderRadius: "9999px" }} />
                      <div className="bkdet-sk-shimmer" style={{ width: "80px", height: "14px", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "150px", height: "20px", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginTop: "14px" }}>
                {[1, 2, 3, 4].map((m) => (
                  <div key={m} className="bkdet-sk-meta-box">
                    <div className="bkdet-sk-shimmer" style={{ width: "90px", height: "12px", borderRadius: "4px" }} />
                    <div className="bkdet-sk-shimmer" style={{ width: "130px", height: "16px", borderRadius: "4px" }} />
                  </div>
                ))}
              </div>

              <div className="bkdet-sk-shimmer" style={{ width: "200px", height: "34px", borderRadius: "8px", marginTop: "16px" }} />
            </div>

            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "150px", height: "20px", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginTop: "12px" }}>
                <div className="bkdet-sk-shimmer" style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "120px", height: "16px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "90%", height: "14px", borderRadius: "4px" }} />
                </div>
              </div>

              <div className="bkdet-sk-shimmer" style={{ width: "100%", height: "42px", borderRadius: "10px", marginTop: "16px" }} />
            </div>
          </div>

          <div className="bkdet-col-side">
            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "160px", height: "20px", borderRadius: "4px" }} />
                </div>
                <div className="bkdet-sk-shimmer" style={{ width: "110px", height: "24px", borderRadius: "9999px" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "16px 0 20px" }}>
                <div className="bkdet-sk-shimmer" style={{ width: "120px", height: "14px", borderRadius: "4px" }} />
                <div className="bkdet-sk-shimmer" style={{ width: "180px", height: "40px", borderRadius: "8px" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "16px" }}>
                <div className="bkdet-sk-payment-tile">
                  <div className="bkdet-sk-shimmer" style={{ width: "80px", height: "13px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "100px", height: "22px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "70px", height: "11px", borderRadius: "4px" }} />
                </div>
                <div className="bkdet-sk-payment-tile">
                  <div className="bkdet-sk-shimmer" style={{ width: "90px", height: "13px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "100px", height: "22px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "85px", height: "11px", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ border: "1px solid #f1f5f9", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "110px", height: "14px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "70px", height: "14px", borderRadius: "4px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "120px", height: "14px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "50px", height: "14px", borderRadius: "4px" }} />
                </div>
                <div style={{ height: "1px", background: "#f1f5f9" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "140px", height: "18px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "90px", height: "18px", borderRadius: "4px" }} />
                </div>
              </div>

              <div className="bkdet-sk-shimmer" style={{ width: "100%", height: "54px", borderRadius: "10px", marginTop: "16px" }} />
            </div>

            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-sk-shimmer" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "140px", height: "20px", borderRadius: "4px" }} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "14px" }}>
                <div className="bkdet-sk-shimmer" style={{ width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <div className="bkdet-sk-shimmer" style={{ width: "80px", height: "12px", borderRadius: "4px" }} />
                  <div className="bkdet-sk-shimmer" style={{ width: "140px", height: "18px", borderRadius: "4px" }} />
                </div>
              </div>

              <div className="bkdet-sk-shimmer" style={{ width: "100%", height: "38px", borderRadius: "8px", marginTop: "16px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((error && !booking) || (!booking && !isLoading)) {
    return (
      <div className={`bkdet-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
        <button type="button" className="bkdet-back-link" onClick={handleBack}>
          <i className="fas fa-arrow-left" />
          <span>Back to Bookings</span>
        </button>
        <div className="bkdet-error-box">
          <img
            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
            alt="No booking found"
            className="bkdet-empty-img"
            onError={(e) => {
              e.currentTarget.src = "/images/no-data.png";
            }}
          />
          <h3 className="bkdet-error-title">No Booking Record Found</h3>
          <p className="bkdet-error-desc">
            We could not find or retrieve this booking record.
          </p>
          <button type="button" className="bkdet-action-btn primary" onClick={() => refetch()}>
            <i className="fas fa-redo" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const dateObj = booking.scheduledDate ? new Date(booking.scheduledDate) : null;
  const monthAbbr = dateObj
    ? dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()
    : "DATE";
  const dayNum = dateObj ? dateObj.getDate() : "--";
  const fullDateText = dateObj
    ? dateObj.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    })
    : "Flexible schedule";

  const timeSlotText = booking.scheduledTime || "Schedule window as agreed with provider";

  const providerPersonName = booking.providerName || null;
  const handleViewProviderProfile = () => {
    if (!targetProviderId) {
      toast.error("Provider profile is not available");
      return;
    }
    navigate(`/nearby-providers/${targetProviderId}`, {
      state: { returnUrl: location.pathname }
    });
  };

  const counterpartyName = isProvider
    ? booking.customerName || "Customer"
    : booking.providerName || booking.providerBusinessName || "Service Provider";

  const mapsUrl = booking.addressText
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.addressText)}`
    : null;

  const isConfirmed = booking.status === "CONFIRMED";
  const isEnRoute = booking.status === "EN_ROUTE";
  const isInspection = booking.status === "INSPECTION";
  const isInProgress = booking.status === "IN_PROGRESS";
  const isPaymentPending = booking.status === "PAYMENT_PENDING";
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";
  const isClosed = booking.status === "CLOSED";
  const isMismatchAccepted =
    booking.mismatchReport?.status === "ACCEPTED" ||
    isClosed ||
    (cancellationReason?.toLowerCase().includes("diagnosis accepted") ?? false) ||
    (cancellationAuthor?.toLowerCase().includes("diagnosis") ?? false);

  const totalAmount = booking.totalAmount || 0;
  const advanceAmount = booking.advanceAmount || totalAmount;
  const quotationType =
    booking.quotationType || (booking.requiresInspection ? "INSPECTION_REQUIRED" : "FIXED");
  const isFixedQuote = quotationType === "FIXED";
  const isInspectionQuote = quotationType === "INSPECTION_REQUIRED";
  const isFinalConfirmed = Boolean(booking.isFinalConfirmed || isFixedQuote || isPaymentPending || isCompleted);
  const remainingAmount = isFinalConfirmed
    ? (booking.remainingAmount ?? Math.max(0, totalAmount - advanceAmount))
    : 0;
  const platformFee = booking.platformFee || Math.round((totalAmount / 1.05) * 0.05);
  const baseAmount = Math.max(0, totalAmount - platformFee);
  const providerCommission = Math.round(baseAmount * 0.05);
  const providerEarnings = Math.max(0, baseAmount - providerCommission);

  const isAdvancePaid = booking.paymentStatus === "ADVANCE_PAID";
  const isFullyPaid = booking.paymentStatus === "PAID";

  const requiresInspection =
    booking.requiresInspection === true ||
    quotationType === "INSPECTION_REQUIRED" ||
    quotationType === "ESTIMATED" ||
    booking.status === "INSPECTION";

  const stepProgressPercent = isFixedQuote
    ? isCompleted
      ? 100
      : isInProgress
        ? 66
        : isEnRoute
          ? 33
          : 0
    : requiresInspection
      ? isCompleted
        ? 100
        : isPaymentPending
          ? 80
          : isInProgress
            ? 60
            : isInspection
              ? 40
              : isEnRoute
                ? 20
                : 0
      : isCompleted
        ? 100
        : isPaymentPending
          ? 75
          : isInProgress
            ? 50
            : isEnRoute
              ? 25
              : 0;

  return (
    <div className={`bkdet-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <button type="button" className="bkdet-back-link" onClick={handleBack}>
        <i className="fas fa-arrow-left" />
        <span>Back to Bookings</span>
      </button>

      <div className="bkdet-header-card">
        <div className="bkdet-header-left">
          <div className="bkdet-badge-row">
            <span className="bkdet-ref-pill">
              <i className="fas fa-calendar-check" />
              <span>{booking.bookingNumber}</span>
            </span>

            {booking.categoryName && (
              <span className="bkdet-category-pill">
                <i className="fas fa-tag" />
                <span>{booking.categoryName}</span>
              </span>
            )}

            <span className={`bkdet-type-pill ${requiresInspection ? "inspection" : "type-fixed"}`}>
              <i className={requiresInspection ? "fas fa-clipboard-check" : "fas fa-lock"} />
              <span>{requiresInspection ? "Inspection Required" : "Fixed Price"}</span>
            </span>

            <span className={`bkdet-status-badge ${isMismatchAccepted ? "closed" : booking.status.toLowerCase().replace(/_/g, "-")}`}>
              <i
                className={`fas ${isMismatchAccepted
                  ? "fa-clipboard-check"
                  : isConfirmed
                    ? "fa-check-circle"
                    : isEnRoute
                      ? "fa-route"
                      : isInspection
                        ? "fa-clipboard-check"
                        : isInProgress
                          ? "fa-tools"
                          : isPaymentPending
                            ? "fa-file-invoice-dollar"
                            : isCompleted
                              ? "fa-award"
                              : "fa-times-circle"
                  }`}
              />
              <span>
                {isMismatchAccepted
                  ? "Closed (Diagnosis Done)"
                  : booking.status === "EN_ROUTE"
                    ? "On The Way"
                    : booking.status === "INSPECTION"
                      ? "Inspection"
                      : booking.status === "PAYMENT_PENDING"
                        ? "Payment Pending"
                        : booking.status.replace(/_/g, " ")}
              </span>
            </span>
          </div>

          <h1 className="bkdet-title">
            {booking.serviceRequestTitle || `Booking #${booking.bookingNumber}`}
          </h1>

          <span className="bkdet-created-date">
            Booked on{" "}
            {new Date(booking.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>

        <div className="bkdet-header-actions">
          <button type="button" className="bkdet-action-btn outline" onClick={handleChat}>
            <i className="fas fa-comment-dots" />
            <span>Chat</span>
          </button>

          {isProvider && isConfirmed && (
            <>
              <button
                type="button"
                className="bkdet-action-btn danger-outline"
                onClick={() => handleTriggerStatusChange("CANCELLED")}
              >
                <i className="fas fa-times-circle" />
                <span>Cancel Booking</span>
              </button>
              <button
                type="button"
                className="bkdet-action-btn route"
                onClick={() => handleTriggerStatusChange("EN_ROUTE")}
              >
                <i className="fas fa-route" />
                <span>On The Way</span>
              </button>
            </>
          )}

          {!isProvider && (isConfirmed || isEnRoute) && (
            <button
              type="button"
              className="bkdet-action-btn danger-outline"
              onClick={() => handleTriggerStatusChange("CANCELLED")}
            >
              <i className="fas fa-times-circle" />
              <span>Cancel Booking</span>
            </button>
          )}

          {!isProvider && isCompleted && !existingReview && !booking.isReviewed && (
            <button
              type="button"
              className="bkdet-action-btn primary"
              style={{ background: "#FF7900", borderColor: "#ea580c" }}
              onClick={() => setIsReviewModalOpen(true)}
            >
              <i className="fas fa-star" />
              <span>Write Review</span>
            </button>
          )}

          {isProvider && isEnRoute && (
            requiresInspection ? (
              <button
                type="button"
                className="bkdet-action-btn inspection"
                onClick={() => handleTriggerStatusChange("INSPECTION")}
              >
                <i className="fas fa-clipboard-check" />
                <span>Start Inspection</span>
              </button>
            ) : (
              <button
                type="button"
                className="bkdet-action-btn primary"
                onClick={() => handleTriggerStatusChange("IN_PROGRESS")}
              >
                <i className="fas fa-tools" />
                <span>Start Work</span>
              </button>
            )
          )}

          {isProvider && isInspection && (
            <button
              type="button"
              className="bkdet-action-btn primary"
              onClick={() => handleTriggerStatusChange("IN_PROGRESS")}
            >
              <i className="fas fa-tools" />
              <span>Start Work</span>
            </button>
          )}

          {isProvider && isInProgress && (
            isFixedQuote ? (
              <button
                type="button"
                className="bkdet-action-btn success"
                onClick={() => handleTriggerStatusChange("COMPLETED")}
              >
                <i className="fas fa-check-circle" />
                <span>Mark Completed</span>
              </button>
            ) : (
              <button
                type="button"
                className="bkdet-action-btn primary"
                onClick={() => handleTriggerStatusChange("PAYMENT_PENDING")}
              >
                <i className="fas fa-file-invoice-dollar" />
                <span>Complete Job / Settle Payment</span>
              </button>
            )
          )}

          {isProvider && !isFixedQuote && isPaymentPending && (
            <button
              type="button"
              className="bkdet-action-btn success"
              onClick={() => handleTriggerStatusChange("COMPLETED")}
            >
              <i className="fas fa-check-circle" />
              <span>Mark as Paid & Complete</span>
            </button>
          )}

          {isProvider && (isEnRoute || isInspection) && (!booking.mismatchReport || booking.mismatchReport.status === "DECLINED") && (
            <button
              type="button"
              className="bkdet-btn-mismatch-trigger"
              onClick={() => setIsMismatchModalOpen(true)}
            >
              <i className="fas fa-stethoscope" />
              <span>Different Problem Found</span>
            </button>
          )}
        </div>
      </div>

      {booking.mismatchReport && booking.mismatchReport.status === "PENDING" && (
        <div className="bkdet-mismatch-banner">
          <div className="bkdet-mismatch-header">
            <div className="bkdet-mismatch-title-wrap">
              <i className="fas fa-stethoscope" />
              <h4 className="bkdet-mismatch-title">
                {isProvider ? "Scope Mismatch Diagnosis Submitted" : "Technician Diagnosed a Different Issue"}
              </h4>
            </div>
            <span className="bkdet-mismatch-pill pending">
              {isProvider ? "Awaiting Customer Review" : "Action Required"}
            </span>
          </div>

          <div className="bkdet-mismatch-body">
            <div className="bkdet-mismatch-diag">
              <strong>Technician Diagnosis:</strong> "{booking.mismatchReport.diagnosis}"
            </div>
            {booking.mismatchReport.suggestedCategory && (
              <div className="bkdet-mismatch-cat">
                <i className="fas fa-tag" />
                <span>Recommended Category:</span>
                <strong>{booking.mismatchReport.suggestedCategory}</strong>
              </div>
            )}
            <div className="bkdet-mismatch-finance">
              <div className="bkdet-mismatch-fin-row">
                <span>Visit &amp; Diagnosis Fee to Technician:</span>
                <strong>{formatCurrency(booking.mismatchReport.visitFee)}</strong>
              </div>
              <div className="bkdet-mismatch-fin-row">
                <span>Deposit Refund to Customer:</span>
                <strong style={{ color: "#0284c7" }}>{formatCurrency(booking.mismatchReport.refundAmount)}</strong>
              </div>
            </div>
          </div>

          {!isProvider && (
            <div className="bkdet-mismatch-actions">
              <button
                type="button"
                className="bkdet-mismatch-btn-accept"
                onClick={() => handleResolveMismatch("ACCEPT")}
                disabled={resolveMismatchMutation.isPending}
              >
                {resolveMismatchMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle" />
                    <span>Accept Diagnosis &amp; Close Booking</span>
                  </>
                )}
              </button>
              <button
                type="button"
                className="bkdet-mismatch-btn-decline"
                onClick={() => handleResolveMismatch("DECLINE")}
                disabled={resolveMismatchMutation.isPending}
              >
                <i className="fas fa-times" />
                <span>Decline / Keep Active</span>
              </button>
            </div>
          )}

          {isProvider && (
            <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
              The customer has been notified. Once they accept, ₹{booking.mismatchReport.visitFee.toLocaleString("en-IN")} visit fee will be credited to your wallet.
            </div>
          )}
        </div>
      )}

      {booking.mismatchReport && booking.mismatchReport.status === "ACCEPTED" && (
        <div className="bkdet-mismatch-banner accepted">
          <div className="bkdet-mismatch-header">
            <div className="bkdet-mismatch-title-wrap">
              <i className="fas fa-clipboard-check" />
              <h4 className="bkdet-mismatch-title">
                Booking Closed (Technician Diagnosis Accepted)
              </h4>
            </div>
            <span className="bkdet-mismatch-pill accepted">Diagnosis Accepted</span>
          </div>

          <div className="bkdet-mismatch-body">
            <div className="bkdet-mismatch-diag">
              <strong>Verified Diagnosis:</strong> "{booking.mismatchReport.diagnosis}"
            </div>
            {booking.mismatchReport.suggestedCategory && (
              <div className="bkdet-mismatch-cat">
                <i className="fas fa-tag" />
                <span>Recommended Category:</span>
                <strong>{booking.mismatchReport.suggestedCategory}</strong>
              </div>
            )}
            <div className="bkdet-mismatch-finance">
              <div className="bkdet-mismatch-fin-row">
                <span>Visit Fee Released to Technician:</span>
                <strong>{formatCurrency(booking.mismatchReport.visitFee)}</strong>
              </div>
              <div className="bkdet-mismatch-fin-row">
                <span>Deposit Refunded to Customer:</span>
                <strong style={{ color: "#16a34a" }}>{formatCurrency(booking.mismatchReport.refundAmount)}</strong>
              </div>
            </div>
          </div>

          {!isProvider && (
            <div className="bkdet-mismatch-actions">
              <button
                type="button"
                className="bkdet-mismatch-btn-repost"
                onClick={() => navigate("/request-service")}
              >
                <i className="fas fa-plus-circle" />
                <span>Request Another Service</span>
              </button>
            </div>
          )}
        </div>
      )}

      {isCancelled && !isMismatchAccepted && (
        <div className="bkdet-cancelled-banner">
          <div className="bkdet-cb-left">
            <div className="bkdet-cb-icon">
              <i className="fas fa-ban" />
            </div>
            <div>
              <div className="bkdet-cb-author-badge">
                <i className="fas fa-user-times" />
                Cancelled by: <strong>{cancellationAuthor ? (isCancelledByCustomer ? "Customer" : cancellationAuthor.toLowerCase().includes("provider") ? "Provider" : cancellationAuthor) : "System"}</strong>
              </div>
              <h4 className="bkdet-cb-title">
                Booking Cancelled Before Service Dispatch
              </h4>
              <p className="bkdet-cb-desc">
                {isProvider
                  ? isCancelledByCustomer
                    ? `This booking was cancelled by the customer before dispatch. Escrow advance has been refunded to the customer.`
                    : `You cancelled this booking before dispatch. A 100% full refund of ${formatCurrency(advanceAmount)} secured in Escrow has been processed for the customer.`
                  : isCancelledByCustomer
                    ? `You cancelled this booking before dispatch. Your full payment of ${formatCurrency(advanceAmount)} held safely in Escrow has been 100% refunded.`
                    : `This booking was cancelled by the provider before dispatch. Your full payment of ${formatCurrency(advanceAmount)} held safely in Escrow has been 100% refunded.`}
              </p>
              {cancellationReason && (
                <div className="bkdet-cb-reason-box">
                  <span className="bkdet-cb-reason-badge">
                    <i className="fas fa-comment-alt" /> Cancellation Reason
                  </span>
                  <span className="bkdet-cb-reason-text">"{cancellationReason}"</span>
                </div>
              )}
            </div>
          </div>
          {!isProvider && (
            <button
              type="button"
              className="bkdet-cb-btn"
              onClick={handleViewServiceRequest}
            >
              <i className="fas fa-redo-alt" />
              <span>Find Another Provider</span>
            </button>
          )}
        </div>
      )}

      {!isFixedQuote && isPaymentPending && (
        <div className="bkdet-payment-pending-banner">
          <div className="bkdet-ppb-left">
            <div className="bkdet-ppb-icon">
              <i className="fas fa-file-invoice-dollar" />
            </div>
            <div>
              <h4 className="bkdet-ppb-title">
                {isProvider
                  ? isFixedQuote
                    ? "Work Completed — Awaiting Customer Settlement"
                    : "Final Total Confirmed — Awaiting Customer Settlement"
                  : isFixedQuote
                    ? "Work Completed — Final Payment Due"
                    : "Work Completed & Total Confirmed — Final Payment Due"}
              </h4>
              <p className="bkdet-ppb-desc">
                {isProvider
                  ? isFixedQuote
                    ? `You completed the work under the fixed price agreement of ${formatCurrency(totalAmount)}. The customer has been requested to settle the remaining balance of ${formatCurrency(remainingAmount)}.`
                    : `You confirmed the final total of ${formatCurrency(totalAmount)}. The customer has been requested to settle the remaining balance of ${formatCurrency(remainingAmount)}.`
                  : isFixedQuote
                    ? `The provider completed the work for the agreed fixed price of ${formatCurrency(totalAmount)}. Please settle the remaining balance of ${formatCurrency(remainingAmount)} to conclude the booking.`
                    : `The provider completed the work and confirmed the final total of ${formatCurrency(totalAmount)}. Please settle the remaining balance of ${formatCurrency(remainingAmount)} to conclude the booking.`}
              </p>
            </div>
          </div>
          <div className="bkdet-ppb-actions">
            {!isProvider && (
              <button
                type="button"
                className="bkdet-action-btn success"
                onClick={handlePayRemainingBalance}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    <span>Connecting Razorpay...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock" />
                    <span>Pay Balance ({formatCurrency(remainingAmount)}) & Complete</span>
                  </>
                )}
              </button>
            )}
            {isProvider && (
              <button
                type="button"
                className="bkdet-action-btn success"
                onClick={() => handleTriggerStatusChange("COMPLETED")}
              >
                <i className="fas fa-check-circle" />
                <span>Mark Paid & Complete</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bkdet-layout-grid">
        <div className="bkdet-col-main">
          {isCompleted && existingReview && (
            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-section-icon" style={{ color: "#f59e0b" }}>
                    <i className="fas fa-star" />
                  </div>
                  <h3 className="bkdet-section-title">
                    {isProvider ? "Customer Feedback & Review" : "Your Review for Specialist"}
                  </h3>
                </div>
              </div>
              <BookingReviewCard review={existingReview} />
            </div>
          )}

          {isCompleted && !isProvider && !existingReview && !booking.isReviewed && (
            <div className="bkdet-section-card bkdet-review-prompt-card">
              <div className="bkdet-review-prompt-content">
                <div className="bkdet-review-prompt-icon">
                  <i className="fas fa-star" />
                </div>
                <div className="bkdet-review-prompt-text">
                  <h3 className="bkdet-review-prompt-title">Rate & Review Your Specialist</h3>
                  <p className="bkdet-review-prompt-desc">
                    Your service is completed! Take a moment to rate {counterpartyName} and help other customers in the marketplace.
                  </p>
                </div>
                <button
                  type="button"
                  className="bkdet-review-prompt-btn"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  <i className="fas fa-star" />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>
          )}

          <div className="bkdet-section-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-calendar-day" />
                </div>
                <h3 className="bkdet-section-title">Schedule & Appointment</h3>
              </div>
            </div>

            <div className="bkdet-schedule-block">
              <div className="bkdet-calendar-tile">
                <div className="bkdet-cal-month">{monthAbbr}</div>
                <div className="bkdet-cal-day">{dayNum}</div>
              </div>
              <div className="bkdet-schedule-details">
                <div className="bkdet-schedule-headline">{fullDateText}</div>
                <div className="bkdet-schedule-sub">
                  <i className="far fa-clock" />
                  <span>{timeSlotText}</span>
                </div>
              </div>
            </div>

            <div className={`bkdet-stepper ${requiresInspection ? "has-inspection" : "fixed-flow"}`}>
              <div className="bkdet-step-line">
                <div className="bkdet-step-line-fill" style={{ width: `${stepProgressPercent}%` }} />
              </div>

              <div className={`bkdet-step-item ${isEnRoute || isInspection || isInProgress || isPaymentPending || isCompleted ? "done" : isConfirmed ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-check" />
                </div>
                <span className="bkdet-step-label">Confirmed</span>
              </div>

              <div className={`bkdet-step-item ${(requiresInspection ? (isInspection || isInProgress || isPaymentPending || isCompleted) : (isInProgress || isPaymentPending || isCompleted)) ? "done" : isEnRoute ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-route" />
                </div>
                <span className="bkdet-step-label">On The Way</span>
              </div>

              {requiresInspection && (
                <div className={`bkdet-step-item ${isInProgress || isPaymentPending || isCompleted ? "done" : isInspection ? "active" : ""}`}>
                  <div className="bkdet-step-circle">
                    <i className="fas fa-clipboard-check" />
                  </div>
                  <span className="bkdet-step-label">Inspection</span>
                </div>
              )}

              <div className={`bkdet-step-item ${isPaymentPending || isCompleted ? "done" : isInProgress ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-tools" />
                </div>
                <span className="bkdet-step-label">In Progress</span>
              </div>

              {!isFixedQuote && (
                <div className={`bkdet-step-item ${isCompleted ? "done" : isPaymentPending ? "active" : ""}`}>
                  <div className="bkdet-step-circle">
                    <i className="fas fa-file-invoice-dollar" />
                  </div>
                  <span className="bkdet-step-label">Payment Due</span>
                </div>
              )}

              <div className={`bkdet-step-item ${isCompleted ? "done" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-award" />
                </div>
                <span className="bkdet-step-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="bkdet-section-card bkdet-timeline-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-stream" />
                </div>
                <h3 className="bkdet-section-title">Execution Updates & Status Log</h3>
              </div>
              <span className="bkdet-timeline-count-badge">
                {timelineItems.length} {timelineItems.length === 1 ? "Update" : "Updates"}
              </span>
            </div>

            <div className="bkdet-timeline-flow">
              {timelineItems.map((item, idx) => {
                const isLatest = idx === timelineItems.length - 1;
                const statusMeta = getStatusMeta(item.status);
                const formattedTime = new Date(item.timestamp).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={idx} className={`bkdet-tl-item ${isLatest ? "latest" : ""}`}>
                    <div className="bkdet-tl-left">
                      <div className={`bkdet-tl-bullet ${statusMeta.variant}`}>
                        <i className={statusMeta.icon} />
                      </div>
                      {idx < timelineItems.length - 1 && <div className="bkdet-tl-connector" />}
                    </div>

                    <div className="bkdet-tl-content">
                      <div className="bkdet-tl-meta-header">
                        <div className="bkdet-tl-title-group">
                          <span className={`bkdet-tl-status-pill ${statusMeta.variant}`}>
                            {statusMeta.label}
                          </span>
                          {isLatest && (
                            <span className="bkdet-live-badge">
                              <span className="bkdet-live-dot" />
                              Latest Update
                            </span>
                          )}
                        </div>
                        <span className="bkdet-tl-time">{formattedTime}</span>
                      </div>

                      {item.note && (
                        <div className="bkdet-tl-note-bubble">
                          <p className="bkdet-tl-note-text">{item.note}</p>
                          {item.authorName && (
                            <div className="bkdet-tl-author">
                              <i className="fas fa-user-check" />
                              <span>Shared by {item.authorName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bkdet-section-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-clipboard-list" />
                </div>
                <h3 className="bkdet-section-title">Service Details</h3>
              </div>
            </div>

            <div className="bkdet-meta-grid">
              {booking.serviceRequestTitle && (
                <div className="bkdet-meta-box">
                  <div className="bkdet-meta-box-label">Service Request</div>
                  <div className="bkdet-meta-box-value">
                    {booking.serviceRequestTitle}
                  </div>
                </div>
              )}

              {booking.categoryName && (
                <div className="bkdet-meta-box">
                  <div className="bkdet-meta-box-label">Category</div>
                  <div className="bkdet-meta-box-value">
                    {booking.categoryName}
                  </div>
                </div>
              )}

              <div className="bkdet-meta-box">
                <div className="bkdet-meta-box-label">Pricing / Job Model</div>
                <div className="bkdet-meta-box-value">
                  {requiresInspection ? "Inspection Required" : "Fixed Price"}
                </div>
              </div>
            </div>

            <button type="button" className="bkdet-link-btn" onClick={handleViewServiceRequest}>
              <i className="fas fa-external-link-alt" />
              <span>View Original Service Request</span>
            </button>
          </div>

          {booking.addressText && (
            <div className="bkdet-section-card">
              <div className="bkdet-section-header">
                <div className="bkdet-section-title-wrap">
                  <div className="bkdet-section-icon">
                    <i className="fas fa-map-marker-alt" />
                  </div>
                  <h3 className="bkdet-section-title">Service Location</h3>
                </div>
              </div>

              <div className="bkdet-address-row">
                <div className="bkdet-address-pin">
                  <i className="fas fa-location-arrow" />
                </div>
                <div className="bkdet-address-content">
                  <div className="bkdet-address-title">Service Address</div>
                  <div className="bkdet-address-text">
                    {booking.addressText}
                  </div>
                </div>
              </div>

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bkdet-directions-btn"
                >
                  <i className="fas fa-directions" />
                  <span>Open in Google Maps / Get Directions</span>
                </a>
              )}
            </div>
          )}
        </div>

        <div className="bkdet-col-side">
          <div className="bkdet-section-card bkdet-billing-card">
            <div className="bkdet-billing-header">
              <div className="bkdet-billing-title-wrap">
                <i className="fas fa-receipt" />
                <h3 className="bkdet-billing-title">Payment & Billing</h3>
              </div>
              <span
                className={`bkdet-billing-pill ${isCancelled || booking.paymentStatus === "REFUNDED"
                  ? "refunded"
                  : isFullyPaid || isFixedQuote
                    ? "paid"
                    : isAdvancePaid
                      ? "advance"
                      : "pending"
                  }`}
              >
                {isMismatchAccepted
                  ? "Visit Fee Settled"
                  : isCancelled || booking.paymentStatus === "REFUNDED"
                    ? "Refunded"
                    : isFullyPaid || isFixedQuote
                      ? "Fully Paid"
                      : isAdvancePaid
                        ? "Advance Paid"
                        : "Pending"}
              </span>
            </div>

            <div className="bkdet-billing-hero">
              <span className="bkdet-billing-hero-label">
                {isMismatchAccepted
                  ? "Visit & Diagnostic Fee"
                  : isCancelled
                    ? "Refunded Amount"
                    : isFixedQuote
                      ? "Total Fixed Price"
                      : (isPaymentPending || isCompleted)
                        ? "Final Confirmed Total"
                        : isInspectionQuote
                          ? "Inspection Fee Paid"
                          : "Advance Deposit"}
              </span>
              <div className="bkdet-billing-hero-amount">
                {formatCurrency(
                  isMismatchAccepted
                    ? (booking.mismatchReport?.visitFee || advanceAmount)
                    : (isPaymentPending || isCompleted || isFixedQuote)
                      ? totalAmount
                      : advanceAmount
                )}
              </div>
            </div>

            {isMismatchAccepted && (
              <div className="bkdet-billing-notice info">
                <i className="fas fa-check-circle" />
                <span>Diagnostic visit completed. Visit fee settled to technician and remainder refunded. Exempt from cancellation quotas.</span>
              </div>
            )}

            {isCancelled && !isMismatchAccepted && (
              <div className="bkdet-billing-notice cancelled">
                <i className="fas fa-undo-alt" />
                <div>
                  Cancelled {cancellationAuthor ? (isCancelledByCustomer ? "by Customer" : "by Provider") : ""} · Deposit of {formatCurrency(advanceAmount)} released to customer.
                  {cancellationReason && (
                    <div style={{ marginTop: "3px", fontStyle: "italic", fontWeight: 600 }}>
                      "{cancellationReason}"
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bkdet-billing-breakdown">
              {isProvider ? (
                <>
                  <div className="bkdet-billing-row">
                    <span>
                      {isFixedQuote
                        ? "Service Quote"
                        : (isPaymentPending || isCompleted)
                          ? "Confirmed Service Amount"
                          : isInspectionQuote
                            ? "Inspection / Visit Fee"
                            : "Initial Base Quote"}
                    </span>
                    <span>{formatCurrency(baseAmount)}</span>
                  </div>
                  <div className="bkdet-billing-row">
                    <span>Platform Commission (5%)</span>
                    <span>-{formatCurrency(providerCommission)}</span>
                  </div>
                  <div className="bkdet-billing-row total">
                    <span>Take-Home Earnings</span>
                    <strong>{formatCurrency(providerEarnings)}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div className="bkdet-billing-row">
                    <span>
                      {isFixedQuote
                        ? "Base Service Quote"
                        : (isPaymentPending || isCompleted)
                          ? "Confirmed Service Amount"
                          : isInspectionQuote
                            ? "Inspection / Visit Fee"
                            : "Initial Base Quote"}
                    </span>
                    <span>{formatCurrency(baseAmount)}</span>
                  </div>
                  <div className="bkdet-billing-row">
                    <span>Platform & Escrow Fee (5%)</span>
                    <span>+{formatCurrency(platformFee)}</span>
                  </div>
                  <div className="bkdet-billing-row total">
                    <span>
                      {isFixedQuote
                        ? "Total Amount Paid"
                        : (isPaymentPending || isCompleted)
                          ? "Total Confirmed Amount"
                          : isInspectionQuote
                            ? "Inspection Total Paid"
                            : "Total Advance Paid"}
                    </span>
                    <strong>
                      {formatCurrency((isPaymentPending || isCompleted || isFixedQuote) ? totalAmount : advanceAmount)}
                    </strong>
                  </div>
                </>
              )}

              {!isFixedQuote && (
                <>
                  <div className="bkdet-billing-divider" />
                  <div className="bkdet-billing-row advance">
                    <span>Advance Paid Online</span>
                    <span className="paid-tag">- {formatCurrency(advanceAmount)}</span>
                  </div>
                  <div className="bkdet-billing-row balance">
                    <span>Remaining Balance</span>
                    <strong className={remainingAmount > 0 ? "due" : "settled"}>
                      {remainingAmount > 0 ? formatCurrency(remainingAmount) : "₹0 (Settled)"}
                    </strong>
                  </div>
                </>
              )}
            </div>

            {!isFixedQuote && !isProvider && isPaymentPending && (
              <div className="bkdet-billing-pay-wrap">
                <button
                  type="button"
                  className="bkdet-billing-pay-btn"
                  onClick={handlePayRemainingBalance}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <i className="fas fa-spinner fa-spin" />
                      <span>Connecting Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card" />
                      <span>Pay Remaining Balance ({formatCurrency(remainingAmount)})</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {!isFixedQuote && !isProvider && !isPaymentPending && !isFullyPaid && !isCancelled && (
              <div className="bkdet-billing-notice info">
                <i className="fas fa-info-circle" />
                <span>
                  {isInspectionQuote
                    ? "Final balance will be confirmed after on-site inspection."
                    : "Final balance will be confirmed by provider upon completion."}
                </span>
              </div>
            )}

            {!isFixedQuote && isProvider && isPaymentPending && (
              <div className="bkdet-billing-notice warning">
                <i className="fas fa-clock" />
                <span>Awaiting customer payment of {formatCurrency(remainingAmount)} to complete booking.</span>
              </div>
            )}

            <div className="bkdet-billing-escrow-footer">
              <i className="fas fa-shield-alt" />
              <span>100% Escrow Protected · Released upon service completion</span>
            </div>
          </div>

          <div className="bkdet-section-card bkdet-provider-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-user-circle" />
                </div>
                <h3 className="bkdet-section-title">
                  {isProvider ? "Client Details" : "Provider Details"}
                </h3>
              </div>
            </div>

            <div className="bkdet-person-avatar-wrap">
              <div
                className="bkdet-person-avatar"
                onClick={!isProvider ? () => setIsProviderModalOpen(true) : undefined}
                style={{ cursor: !isProvider ? "pointer" : "default" }}
                title={!isProvider ? "Click to view full provider profile" : undefined}
              >
                {!isProvider ? (
                  <img
                    src={
                      booking.providerAvatar ||
                      publicProvider?.provider_profile?.profile_image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(providerPersonName || counterpartyName)}&background=FF7900&color=fff&size=160&bold=true`
                    }
                    alt={providerPersonName || counterpartyName}
                    className="bkdet-counterparty-avatar-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(providerPersonName || counterpartyName)}&background=FF7900&color=fff&size=160&bold=true`;
                    }}
                  />
                ) : (
                  <img
                    src={
                      booking.customerAvatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.customerName || "Customer")}&background=0f172a&color=fff&size=160&bold=true`
                    }
                    alt={booking.customerName || "Customer"}
                    className="bkdet-counterparty-avatar-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.customerName || "Customer")}&background=0f172a&color=fff&size=160&bold=true`;
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bkdet-person-kv-list">
              {!isProvider ? (
                <>
                  <div className="bkdet-person-kv-row">
                    <span className="bkdet-person-kv-label">
                      <i className="fas fa-user" /> Name
                    </span>
                    <span className="bkdet-person-kv-value">
                      {providerPersonName || counterpartyName}
                    </span>
                  </div>

                  <div className="bkdet-person-kv-row">
                    <span className="bkdet-person-kv-label">
                      <i className="fas fa-check-circle" /> Jobs Done
                    </span>
                    <span className="bkdet-person-kv-value">
                      {booking.providerCompletedJobs ?? publicProvider?.provider_profile?.completed_jobs ?? 0}
                    </span>
                  </div>

                  <div className="bkdet-person-kv-row">
                    <span className="bkdet-person-kv-label">
                      <i className="fas fa-star" /> Reviews Rating
                    </span>
                    <span className="bkdet-person-kv-value">
                      {booking.providerRating != null && (booking.providerReviewCount ?? 0) > 0 ? (
                        <>
                          <i className="fas fa-star" style={{ color: "#f59e0b", marginRight: "5px" }} />
                          {booking.providerRating.toFixed(1)} ({booking.providerReviewCount}{" "}
                          {booking.providerReviewCount === 1 ? "review" : "reviews"})
                        </>
                      ) : (
                        "No reviews yet"
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <div className="bkdet-person-kv-row">
                  <span className="bkdet-person-kv-label">
                    <i className="fas fa-user" /> Name
                  </span>
                  <span className="bkdet-person-kv-value">
                    {booking.customerName || "Customer"}
                  </span>
                </div>
              )}
            </div>

            <div className="bkdet-contact-actions">
              <button type="button" className="bkdet-contact-btn" onClick={handleChat}>
                <i className="fas fa-comment-dots" />
                <span>Chat</span>
              </button>
              {!isProvider && (
                <button
                  type="button"
                  className="bkdet-contact-btn bkdet-profile-btn"
                  onClick={() => setIsProviderModalOpen(true)}
                >
                  <i className="fas fa-id-card" />
                  <span>View Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {(isProvider || (!isProvider && targetStatus === "CANCELLED")) && (
        <BookingStatusModal
          booking={statusModalBooking}
          targetStatus={targetStatus}
          isOpen={Boolean(statusModalBooking && targetStatus)}
          role={isProvider ? "PROVIDER" : "CUSTOMER"}
          onClose={handleCloseStatusModal}
          onConfirm={handleConfirmStatusChange}
          isLoading={updateStatusMutation.isPending}
        />
      )}

      {isProvider && (
        <ServiceMismatchModal
          isOpen={isMismatchModalOpen}
          booking={booking}
          onClose={() => setIsMismatchModalOpen(false)}
          onSubmit={handleReportMismatchSubmit}
          isLoading={reportMismatchMutation.isPending}
        />
      )}

      {booking && (
        <RaiseDisputeModal
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          booking={{
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            serviceRequestTitle: booking.serviceRequestTitle || undefined,
            totalAmount: booking.totalAmount,
            advanceAmount: booking.advanceAmount,
            providerName: booking.providerName || undefined,
            customerName: booking.customerName || undefined
          }}
          role={isProvider ? "PROVIDER" : "CUSTOMER"}
          onSubmitConcern={() => {
            toast.success("Concern submitted successfully. Our resolution team will review it.");
            navigate(isProvider ? "/provider/support" : "/support");
          }}
        />
      )}

      {booking && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          bookingId={booking.id}
          bookingNumber={booking.bookingNumber}
          providerName={counterpartyName}
          serviceTitle={booking.serviceRequestTitle || booking.categoryName}
          onSuccess={() => {
            refetchReview();
            refetch();
          }}
        />
      )}

      {!isProvider && isProviderModalOpen && modalProviderData && (
        <ProviderDetailsModal
          provider={modalProviderData}
          onClose={() => setIsProviderModalOpen(false)}
          onChat={() => {
            setIsProviderModalOpen(false);
            handleChat();
          }}
          onViewFullProfile={targetProviderId ? handleViewProviderProfile : undefined}
        />
      )}
    </div>
  );
};
