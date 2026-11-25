import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetRequestQuotations,
  useRejectQuotation,
  useCompareQuotationsWithAi
} from "../../../quotations/hooks/useQuotationMutations";
import { AiQuotationComparisonModal } from "../../../quotations/components";
import {
  useCreatePaymentOrder,
  useVerifyPayment
} from "../../../payment/hooks/usePayment";
import { loadRazorpayScript, resetRazorpay } from "../../../payment/utils/razorpay.utils";
import type { RequestQuotationItem, CompareQuotationsResponse } from "../../../quotations/types/quotation.types";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import "./RequestQuotations.css";

export interface RequestQuotationsProps {
  requestId: string;
  requestStatus?: string;
  requestItem?: CustomerServiceRequestItem | null;
  onQuotationAccepted?: () => void;
}

export const RequestQuotations: React.FC<RequestQuotationsProps> = ({
  requestId,
  requestStatus,
  requestItem,
  onQuotationAccepted
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: responseData, isLoading, error, refetch } = useGetRequestQuotations(requestId);
  const rejectMutation = useRejectQuotation();
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const compareAiMutation = useCompareQuotationsWithAi();

  const [confirmAcceptQuote, setConfirmAcceptQuote] = useState<RequestQuotationItem | null>(null);
  const [confirmRejectQuote, setConfirmRejectQuote] = useState<RequestQuotationItem | null>(null);
  const [declineReason, setDeclineReason] = useState<string>("Price is higher than expected");
  const [customDeclineReason, setCustomDeclineReason] = useState<string>("");
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiComparisonData, setAiComparisonData] = useState<CompareQuotationsResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const activeRazorpayRef = useRef<any>(null);
  const [redirectOverlay, setRedirectOverlay] = useState<{
    show: boolean;
    type: "SUCCESS" | "CANCELLED";
    countdown: number;
    message: string;
  }>({
    show: false,
    type: "SUCCESS",
    countdown: 3,
    message: ""
  });

  const quotations: RequestQuotationItem[] = responseData?.data?.quotations || [];
  const isQuoteExpired = (q: RequestQuotationItem) => {
    if (q.status === "EXPIRED") return true;
    if (q.status === "PENDING" && q.validUntilDate) {
      return new Date(q.validUntilDate).getTime() < Date.now();
    }
    return false;
  };

  const activeQuotations = useMemo(
    () => quotations.filter((q) => (q.status === "PENDING" && !isQuoteExpired(q)) || q.status === "ACCEPTED"),
    [quotations]
  );
  const pastQuotations = useMemo(
    () => quotations.filter((q) => q.status === "WITHDRAWN" || q.status === "REJECTED" || isQuoteExpired(q)),
    [quotations]
  );
  const acceptedQuoteId = responseData?.data?.acceptedQuotationId;
  const isRequestClosed =
    requestStatus === "CANCELLED" ||
    requestStatus === "EXPIRED" ||
    requestStatus === "COMPLETED" ||
    requestStatus === "ACCEPTED";

  useEffect(() => {
    const retryId = (location.state as any)?.retryQuotationId;
    if (retryId && quotations.length > 0 && !confirmAcceptQuote) {
      const match = quotations.find((q) => q.id === retryId && q.status === "PENDING");
      if (match) {
        setConfirmAcceptQuote(match);
      }
    }
  }, [quotations, location.state]);

  useEffect(() => {
    return () => {
      resetRazorpay();
    };
  }, []);

  const handleChat = (quote: RequestQuotationItem) => {
    const targetUserId = quote.provider.userId || quote.provider.id;
    if (!targetUserId) {
      toast.error("Provider messaging unavailable");
      return;
    }

    navigate(`/messages?recipientId=${targetUserId}`, {
      state: {
        recipientId: targetUserId,
        recipientName: quote.provider.businessName || quote.provider.name || "Provider",
        requestId: quote.serviceRequestId,
        requestTitle: "Service Quotation"
      }
    });
  };

  const handleOpenAiComparison = () => {
    setIsAiModalOpen(true);
    if (!aiComparisonData) {
      setAiError(null);
      compareAiMutation.mutate(
        { serviceRequestId: requestId, topN: 3 },
        {
          onSuccess: (res) => {
            if (res.data) {
              setAiComparisonData(res.data);
              setAiError(null);
            }
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.message || err?.message || "Failed to analyze quotations with AI";
            setAiError(msg);
            toast.error(msg);
          }
        }
      );
    }
  };

  const handleRefreshAiComparison = () => {
    setAiError(null);
    compareAiMutation.mutate(
      { serviceRequestId: requestId, topN: 3 },
      {
        onSuccess: (res) => {
          if (res.data) {
            setAiComparisonData(res.data);
            setAiError(null);
            toast.success("AI comparison updated");
          }
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || err?.message || "Failed to analyze quotations with AI";
          setAiError(msg);
          toast.error(msg);
        }
      }
    );
  };

  const handlePayAndAccept = async () => {
    if (!confirmAcceptQuote) return;
    setIsProcessingPayment(true);

    try {
      resetRazorpay();
      const isLoaded = await loadRazorpayScript(true);
      if (!isLoaded) {
        toast.error("Unable to load Razorpay payment gateway. Please check your internet connection.");
        setIsProcessingPayment(false);
        return;
      }

      createOrderMutation.mutate(
        { quotationId: confirmAcceptQuote.id },
        {
          onSuccess: (res) => {
            const orderData = res.data;
            if (!orderData) {
              toast.error("Failed to generate payment order");
              setIsProcessingPayment(false);
              return;
            }

            let rzp: any = null;
            let cancelHandled = false;

            const cleanupRazorpayModal = () => {
              if (rzp && typeof rzp.close === "function") {
                try {
                  rzp.close();
                } catch {}
              }
              if (activeRazorpayRef.current && typeof activeRazorpayRef.current.close === "function") {
                try {
                  activeRazorpayRef.current.close();
                } catch {}
                activeRazorpayRef.current = null;
              }
              resetRazorpay();
            };

            const handlePaymentCancellation = (customMessage?: string) => {
              if (cancelHandled) return;
              cancelHandled = true;

              cleanupRazorpayModal();
              const quoteCancelled = confirmAcceptQuote;
              setIsProcessingPayment(false);
              setConfirmAcceptQuote(null);
              if (!quoteCancelled) return;

              setRedirectOverlay({
                show: true,
                type: "CANCELLED",
                countdown: 3,
                message: customMessage || "Payment process was cancelled. Your quotation is safe."
              });

              let seconds = 3;
              const timer = setInterval(() => {
                seconds -= 1;
                if (seconds <= 0) {
                  clearInterval(timer);
                  cleanupRazorpayModal();
                  navigate("/payment/cancelled", {
                    state: {
                      serviceRequestId: requestId,
                      quotationId: quoteCancelled.id,
                      amount: Math.round(quoteCancelled.amount * 1.05),
                      providerName: quoteCancelled.provider.name,
                      providerBusinessName: quoteCancelled.provider.businessName,
                      requestItem: requestItem || null
                    }
                  });
                } else {
                  setRedirectOverlay((prev) => ({
                    ...prev,
                    countdown: seconds
                  }));
                }
              }, 1000);
            };

            const options = {
              key: orderData.keyId,
              amount: orderData.amount * 100,
              currency: orderData.currency || "INR",
              name: "BrioSolve",
              description: `Booking with ${confirmAcceptQuote.provider.businessName || "Provider"}`,
              order_id: orderData.orderId,
              retry: {
                enabled: false
              },
              prefill: {
                name: orderData.customerName || "",
                email: orderData.customerEmail || "",
                contact: orderData.customerPhone || ""
              },
              theme: {
                color: "#ea580c"
              },
              handler: (paymentResponse: any) => {
                cleanupRazorpayModal();
                const quoteAccepted = confirmAcceptQuote;
                const totalPaidAmount = Math.round(quoteAccepted.amount * 1.05);

                verifyPaymentMutation.mutate(
                  {
                    quotationId: quoteAccepted.id,
                    razorpayOrderId: paymentResponse.razorpay_order_id,
                    razorpayPaymentId: paymentResponse.razorpay_payment_id,
                    razorpaySignature: paymentResponse.razorpay_signature
                  },
                  {
                    onSuccess: (res: any) => {
                      setConfirmAcceptQuote(null);
                      setIsProcessingPayment(false);
                      refetch();
                      onQuotationAccepted?.();

                      const bookingData = res?.data;

                      setRedirectOverlay({
                        show: true,
                        type: "SUCCESS",
                        countdown: 3,
                        message: `Payment verified! Confirmed with ${quoteAccepted.provider.businessName || quoteAccepted.provider.name}.`
                      });

                      let seconds = 3;
                      const timer = setInterval(() => {
                        seconds -= 1;
                        if (seconds <= 0) {
                          clearInterval(timer);
                          cleanupRazorpayModal();
                          navigate("/payment/success", {
                            state: {
                              paymentId: paymentResponse.razorpay_payment_id,
                              orderId: paymentResponse.razorpay_order_id,
                              amount: totalPaidAmount,
                              quotationId: quoteAccepted.id,
                              serviceRequestId: requestId,
                              providerName: quoteAccepted.provider.name,
                              providerBusinessName: quoteAccepted.provider.businessName,
                              requestItem: requestItem
                                ? { ...requestItem, status: "ACCEPTED" }
                                : null,
                              bookingId: bookingData?.bookingId,
                              bookingNumber: bookingData?.bookingNumber
                            }
                          });
                        } else {
                          setRedirectOverlay((prev) => ({
                            ...prev,
                            countdown: seconds
                          }));
                        }
                      }, 1000);
                    },
                    onError: (err: any) => {
                      toast.error(err?.response?.data?.message || err?.message || "Payment verification failed");
                      setIsProcessingPayment(false);
                    }
                  }
                );
              },
              modal: {
                ondismiss: () => {
                  handlePaymentCancellation("Payment process was cancelled. Your quotation is safe.");
                }
              }
            };

            if (activeRazorpayRef.current && typeof activeRazorpayRef.current.close === "function") {
              try {
                activeRazorpayRef.current.close();
              } catch {}
              activeRazorpayRef.current = null;
            }

            rzp = new window.Razorpay(options);
            activeRazorpayRef.current = rzp;
            rzp.on("payment.failed", (resp: any) => {
              handlePaymentCancellation(resp?.error?.description || "Payment failed or was cancelled.");
            });
            rzp.open();
          },
          onError: (err: any) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to initialize payment order");
            setIsProcessingPayment(false);
          }
        }
      );
    } catch {
      toast.error("An unexpected error occurred while initiating payment");
      setIsProcessingPayment(false);
    }
  };

  const handleConfirmReject = () => {
    if (!confirmRejectQuote) return;

    const resolvedReason = declineReason === "Other"
      ? (customDeclineReason.trim() || "Declined by customer")
      : declineReason;

    rejectMutation.mutate(
      { quotationId: confirmRejectQuote.id, reason: resolvedReason },
      {
        onSuccess: () => {
          toast.success("Quotation declined");
          setConfirmRejectQuote(null);
          setDeclineReason("Price is higher than expected");
          setCustomDeclineReason("");
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to decline quotation");
        }
      }
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FIXED":
        return { label: "Fixed Price", className: "reqquotes-pill-fixed" };
      case "ESTIMATED":
        return { label: "Estimated", className: "reqquotes-pill-estimated" };
      case "INSPECTION_REQUIRED":
        return { label: "Inspection Required", className: "reqquotes-pill-inspection" };
      default:
        return { label: type, className: "" };
    }
  };

  if (isLoading) {
    return <RequestQuotationsSkeleton />;
  }

  if (error) {
    return (
      <div className="srdetails-card reqquotes-card-wrapper">
        <div className="srdetails-card-header">
          <div className="srdetails-card-header-left">
            <i className="fas fa-file-invoice-dollar srdetails-card-icon"></i>
            <h3 className="srdetails-card-title">Provider Quotations</h3>
          </div>
        </div>
        <div className="reqquotes-empty">
          <p className="reqquotes-empty-subtitle">Unable to load quotations for this request.</p>
          <button type="button" className="reqquotes-btn-chat" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="srdetails-card reqquotes-card-wrapper">
        <div className="srdetails-card-header">
          <div className="srdetails-card-header-left">
            <i className="fas fa-file-invoice-dollar srdetails-card-icon"></i>
            <h3 className="srdetails-card-title">Provider Quotations</h3>
          </div>
          <div className="reqquotes-header-actions">
            {activeQuotations.length >= 2 && !acceptedQuoteId && (
              <button
                type="button"
                className="reqquotes-ai-compare-btn"
                onClick={handleOpenAiComparison}
                title="Compare all bids with Gemini AI"
              >
                <i className="fas fa-wand-magic-sparkles" />
                <span>AI Compare Bids</span>
              </button>
            )}
            <span className={`reqquotes-count-badge ${acceptedQuoteId ? "has-accepted" : ""}`}>
              {acceptedQuoteId
                ? "Provider Selected"
                : activeQuotations.length === 1
                ? "1 Active Quote"
                : activeQuotations.length > 1
                ? `${activeQuotations.length} Active Quotes`
                : pastQuotations.length > 0
                ? "Awaiting New Quotes"
                : "0 Quotes"}
            </span>
          </div>
        </div>

        {activeQuotations.length === 0 ? (
          <div className="reqquotes-empty">
            <img
              src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
              alt="No quotations found"
              className="reqquotes-empty-img"
              onError={(e) => {
                e.currentTarget.src = "/images/no-data.png";
              }}
            />
            <h4 className="reqquotes-empty-title">
              {pastQuotations.length > 0
                ? "Awaiting New Provider Quotations"
                : "Awaiting Provider Quotations"}
            </h4>
            <p className="reqquotes-empty-subtitle">
              {pastQuotations.length > 0
                ? "Your service request is active for new quotes. Verified local technicians have been alerted and their new estimates will appear here."
                : "Verified service providers in your area have been notified and are reviewing your service request. Their estimates and quotations will appear here as soon as they submit."}
            </p>
            <div className="reqquotes-empty-status-tag">
              <span className="reqquotes-pulse-dot" />
              <span>Matching active in your area</span>
            </div>
          </div>
        ) : (
          <div className="reqquotes-list">
            {activeQuotations.map((quote) => {
              const typeConfig = getTypeLabel(quote.quotationType);
              const isAccepted = quote.status === "ACCEPTED";
              const isPending = quote.status === "PENDING";
              const isAiWinner = aiComparisonData?.recommendedWinnerId === quote.id;
              const aiWinnerRanking = isAiWinner
                ? aiComparisonData?.rankings.find((r) => r.quotationId === quote.id)
                : null;

              return (
                <div
                  key={quote.id}
                  className={`reqquotes-item ${isAccepted ? "status-accepted" : ""} ${isAiWinner ? "ai-winner-highlight" : ""}`}
                >
                  {isAiWinner && (
                    <div
                      className="reqquotes-ai-winner-ribbon"
                      onClick={handleOpenAiComparison}
                      role="button"
                      tabIndex={0}
                      title="Click to view full AI comparison"
                    >
                      <div className="reqquotes-ai-winner-ribbon-left">
                        <i className="fas fa-crown" />
                        <span>#1 AI Recommended Pick</span>
                      </div>
                      <span className="reqquotes-ai-winner-pill">
                        Match Score: {aiWinnerRanking?.score || 95}/100
                        <i className="fas fa-chevron-right" />
                      </span>
                    </div>
                  )}

                  <div className="reqquotes-item-header">
                    <div className="reqquotes-provider-info">
                      {quote.provider.profileImage ? (
                        <img
                          src={quote.provider.profileImage}
                          alt={quote.provider.businessName}
                          className="reqquotes-avatar"
                        />
                      ) : (
                        <div className="reqquotes-avatar-fallback">
                          {(quote.provider.businessName || quote.provider.name || "P").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="reqquotes-provider-details">
                        <div className="reqquotes-provider-name-row">
                          <span className="reqquotes-business-name">
                            {quote.provider.businessName || quote.provider.name}
                          </span>
                          <i className="fas fa-check-circle reqquotes-verified-badge" title="Verified Provider"></i>
                        </div>
                        <div className="reqquotes-provider-sub">
                          {quote.provider.experience && (
                            <span className="reqquotes-sub-pill">{quote.provider.experience}</span>
                          )}
                          {quote.provider.completedJobs > 0 && (
                            <span className="reqquotes-sub-pill">
                              <i className="fas fa-star" style={{ color: "#f59e0b", fontSize: "0.7rem", marginRight: "3px" }}></i>
                              {quote.provider.completedJobs} jobs
                            </span>
                          )}
                          <span className="reqquotes-sub-date">
                            Quoted{" "}
                            {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="reqquotes-price-container">
                      <span className="reqquotes-price-val">
                        ₹{quote.amount.toLocaleString("en-IN")}
                      </span>
                      <span className={`reqquotes-price-type-pill ${typeConfig.className}`}>
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="reqquotes-work-box">
                    <div className="reqquotes-work-icon">
                      <i className="fas fa-quote-left"></i>
                    </div>
                    <p className="reqquotes-work-text">{quote.workDescription}</p>
                  </div>

                  <div className="reqquotes-meta-grid">
                    {quote.availableDateTime && (
                      <div className="reqquotes-meta-pill">
                        <i className="far fa-calendar-alt"></i>
                        <span>Available: <strong>{quote.availableDateTime}</strong></span>
                      </div>
                    )}
                    {quote.estimatedDuration && (
                      <div className="reqquotes-meta-pill">
                        <i className="far fa-clock"></i>
                        <span>Duration: <strong>{quote.estimatedDuration}</strong></span>
                      </div>
                    )}
                    {quote.validUntilDate && (
                      <div className="reqquotes-meta-pill">
                        <i className="fas fa-hourglass-half"></i>
                        <span>
                          Valid until{" "}
                          <strong>
                            {new Date(quote.validUntilDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {(quote.includedItems.length > 0 || quote.excludedItems.length > 0) && (
                    <div className="reqquotes-deliverables-wrap">
                      {quote.includedItems.length > 0 && (
                        <div className="reqquotes-deliverables-row">
                          <span className="reqquotes-deliv-heading">Includes:</span>
                          <div className="reqquotes-chips-wrap">
                            {quote.includedItems.map((inc, i) => (
                              <span key={i} className="reqquotes-deliv-chip inc">
                                <i className="fas fa-check"></i> {inc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {quote.excludedItems.length > 0 && (
                        <div className="reqquotes-deliverables-row">
                          <span className="reqquotes-deliv-heading">Excludes:</span>
                          <div className="reqquotes-chips-wrap">
                            {quote.excludedItems.map((exc, i) => (
                              <span key={i} className="reqquotes-deliv-chip exc">
                                <i className="fas fa-times"></i> {exc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {quote.extraChargePolicy && (
                    <div className="reqquotes-policy-card">
                      <i className="fas fa-info-circle"></i>
                      <span>Policy: {quote.extraChargePolicy}</span>
                    </div>
                  )}

                  <div className="reqquotes-card-footer">
                    <button
                      type="button"
                      className="reqquotes-btn-chat"
                      onClick={() => handleChat(quote)}
                    >
                      <i className="far fa-comment-dots"></i>
                      <span>Chat with Provider</span>
                    </button>

                    <div className="reqquotes-actions-group">
                      {isAccepted && (
                        <div className="reqquotes-accepted-badge">
                          <i className="fas fa-check-circle"></i>
                          <span>Quotation Accepted</span>
                        </div>
                      )}

                      {isPending && (
                        <>
                          <button
                            type="button"
                            className="reqquotes-btn-decline"
                            disabled={isRequestClosed || isProcessingPayment || rejectMutation.isPending}
                            onClick={() => setConfirmRejectQuote(quote)}
                          >
                            <i className="fas fa-times"></i>
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            className="reqquotes-btn-accept"
                            disabled={isRequestClosed || isProcessingPayment || rejectMutation.isPending}
                            onClick={() => setConfirmAcceptQuote(quote)}
                          >
                            <i className="fas fa-check"></i>
                            <span>Accept Quote</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pastQuotations.length > 0 && (
          <div className="reqquotes-past-section">
            <div className="reqquotes-past-header">
              <div className="reqquotes-past-title-wrap">
                <i className="fas fa-history reqquotes-past-icon"></i>
                <h4 className="reqquotes-past-title">Previous Quotations & Cancelled Bookings</h4>
              </div>
              <span className="reqquotes-past-count-badge">
                {pastQuotations.length} {pastQuotations.length === 1 ? "Past Quote" : "Past Quotes"}
              </span>
            </div>
            <p className="reqquotes-past-desc">
              These quotations were withdrawn due to booking cancellation, expired, or declined. They cannot be accepted again.
            </p>
            <div className="reqquotes-list reqquotes-past-list">
              {pastQuotations.map((quote) => {
                const typeConfig = getTypeLabel(quote.quotationType);
                const isWithdrawn = quote.status === "WITHDRAWN";
                const isRejected = quote.status === "REJECTED";
                const isExpired = isQuoteExpired(quote);
                const cancelReason = isWithdrawn
                  ? requestItem?.latest_booking?.cancellation_reason
                  : null;

                return (
                  <div
                    key={quote.id}
                    className={`reqquotes-item ${
                      isWithdrawn
                        ? "status-withdrawn"
                        : isRejected
                        ? "status-rejected"
                        : isExpired
                        ? "status-expired"
                        : ""
                    }`}
                  >
                    <div className="reqquotes-item-header">
                      <div className="reqquotes-provider-info">
                        {quote.provider.profileImage ? (
                          <img
                            src={quote.provider.profileImage}
                            alt={quote.provider.businessName}
                            className="reqquotes-avatar"
                          />
                        ) : (
                          <div className="reqquotes-avatar-fallback">
                            {(quote.provider.businessName || quote.provider.name || "P").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="reqquotes-provider-details">
                          <div className="reqquotes-provider-name-row">
                            <span className="reqquotes-business-name">
                              {quote.provider.businessName || quote.provider.name}
                            </span>
                            <i className="fas fa-check-circle reqquotes-verified-badge" title="Verified Provider"></i>
                          </div>
                          <div className="reqquotes-provider-sub">
                            {quote.provider.experience && (
                              <span className="reqquotes-sub-pill">{quote.provider.experience}</span>
                            )}
                            <span className="reqquotes-sub-date">
                              Quoted{" "}
                              {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric"
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="reqquotes-price-container">
                        <span className="reqquotes-price-val">
                          ₹{quote.amount.toLocaleString("en-IN")}
                        </span>
                        <span className={`reqquotes-price-type-pill ${typeConfig.className}`}>
                          {typeConfig.label}
                        </span>
                      </div>
                    </div>

                    {cancelReason && (
                      <div className="reqquotes-cancellation-callout">
                        <i className="fas fa-ban"></i>
                        <span>Technician Cancellation Reason: <strong>"{cancelReason}"</strong></span>
                      </div>
                    )}

                    <div className="reqquotes-work-box">
                      <div className="reqquotes-work-icon">
                        <i className="fas fa-quote-left"></i>
                      </div>
                      <p className="reqquotes-work-text">{quote.workDescription}</p>
                    </div>

                    <div className="reqquotes-meta-grid">
                      {quote.availableDateTime && (
                        <div className="reqquotes-meta-pill">
                          <i className="far fa-calendar-alt"></i>
                          <span>Available: <strong>{quote.availableDateTime}</strong></span>
                        </div>
                      )}
                      {quote.estimatedDuration && (
                        <div className="reqquotes-meta-pill">
                          <i className="far fa-clock"></i>
                          <span>Duration: <strong>{quote.estimatedDuration}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="reqquotes-card-footer">
                      <button
                        type="button"
                        className="reqquotes-btn-chat"
                        onClick={() => handleChat(quote)}
                      >
                        <i className="far fa-comment-dots"></i>
                        <span>Chat with Provider</span>
                      </button>

                      <div className="reqquotes-actions-group">
                        {isWithdrawn && (
                          <div className="reqquotes-withdrawn-badge">
                            <i className="fas fa-undo-alt"></i>
                            <span>Withdrawn / Cancelled</span>
                          </div>
                        )}

                        {isRejected && (
                          <span className="reqquotes-rejected-badge">
                            Declined by Customer
                          </span>
                        )}

                        {isExpired && (
                          <span className="reqquotes-expired-badge">
                            Expired
                          </span>
                        )}

                        {quote.rejectionReason && (
                          <div className="reqquotes-rejected-reason-box">
                            <i className="fas fa-info-circle"></i>
                            <span>Reason: {quote.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {confirmAcceptQuote && (
        <div
          className="reqquotes-modal-overlay"
          onClick={() => !isProcessingPayment && setConfirmAcceptQuote(null)}
        >
          <div
            className="reqquotes-modal-content reqquotes-payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reqquotes-modal-header">
              <div className="reqquotes-modal-icon accept">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h3 className="reqquotes-modal-title">Confirm Booking & Payment</h3>
                <span className="reqquotes-modal-subtitle">Secure escrow payment with 15-day warranty</span>
              </div>
            </div>

            <div className="reqquotes-modal-body">
              <div className="reqquotes-modal-provider-card">
                {confirmAcceptQuote.provider.profileImage ? (
                  <img
                    src={confirmAcceptQuote.provider.profileImage}
                    alt={confirmAcceptQuote.provider.businessName}
                    className="reqquotes-modal-avatar"
                  />
                ) : (
                  <div className="reqquotes-modal-avatar-fallback">
                    {(confirmAcceptQuote.provider.businessName || confirmAcceptQuote.provider.name || "P").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="reqquotes-modal-prov-name">
                    {confirmAcceptQuote.provider.businessName || confirmAcceptQuote.provider.name}
                  </h4>
                  <span className="reqquotes-modal-prov-exp">
                    {confirmAcceptQuote.provider.experience ? `${confirmAcceptQuote.provider.experience} exp` : "Verified Provider"}
                  </span>
                </div>
              </div>

              <div className="reqquotes-pay-breakdown">
                <div className="reqquotes-pay-row">
                  <span>Service Quote</span>
                  <span>₹{confirmAcceptQuote.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="reqquotes-pay-row">
                  <span>Platform Fee (5%)</span>
                  <span>+₹{Math.round(confirmAcceptQuote.amount * 0.05).toLocaleString("en-IN")}</span>
                </div>
                <div className="reqquotes-pay-divider" />
                <div className="reqquotes-pay-row total">
                  <span>Total Payable Amount</span>
                  <span className="reqquotes-pay-total-val">
                    ₹{Math.round(confirmAcceptQuote.amount * 1.05).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="reqquotes-warranty-box">
                <div className="reqquotes-warranty-item">
                  <i className="fas fa-certificate"></i>
                  <div>
                    <strong>15-Day Service Warranty</strong>
                    <p>If any issue reoccurs within 15 days, we coordinate a free inspection or re-service.</p>
                  </div>
                </div>
                <div className="reqquotes-warranty-item">
                  <i className="fas fa-lock"></i>
                  <div>
                    <strong>Escrow Protected Payment</strong>
                    <p>Your payment is held safely and released to the provider only after completion through the platform.</p>
                  </div>
                </div>
              </div>

              <div className="reqquotes-compliance-notice">
                <i className="fas fa-info-circle"></i>
                <span>To ensure your 15-day warranty and dispute protection stay active, payments must be completed through the platform website.</span>
              </div>
            </div>

            <div className="reqquotes-modal-actions">
              <button
                type="button"
                className="reqquotes-btn-cancel"
                onClick={() => setConfirmAcceptQuote(null)}
                disabled={isProcessingPayment}
              >
                Cancel
              </button>
              <button
                type="button"
                className="reqquotes-btn-pay"
                onClick={handlePayAndAccept}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Connecting Razorpay...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-lock"></i>
                    <span>Pay ₹{Math.round(confirmAcceptQuote.amount * 1.05).toLocaleString("en-IN")} with Razorpay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRejectQuote && (
        <div className="reqquotes-modal-overlay" onClick={() => setConfirmRejectQuote(null)}>
          <div className="reqquotes-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reqquotes-modal-header">
              <div className="reqquotes-modal-icon reject">
                <i className="fas fa-times-circle"></i>
              </div>
              <h3 className="reqquotes-modal-title">Decline Quotation</h3>
            </div>
            <div className="reqquotes-modal-body">
              <p>
                Are you sure you want to decline this quote of{" "}
                <strong>₹{confirmRejectQuote.amount.toLocaleString("en-IN")}</strong> from{" "}
                <strong>{confirmRejectQuote.provider.businessName || confirmRejectQuote.provider.name}</strong>?
              </p>
              <div className="reqquotes-decline-reasons">
                <label className="text-xs font-semibold text-slate-600">Select reason for declining:</label>
                {[
                  "Price is higher than expected",
                  "Schedule or timing does not work",
                  "Scope of work does not match",
                  "Chose another provider",
                  "Other"
                ].map((reasonOption) => (
                  <button
                    key={reasonOption}
                    type="button"
                    className={`reqquotes-decline-chip ${declineReason === reasonOption ? "selected" : ""}`}
                    onClick={() => setDeclineReason(reasonOption)}
                  >
                    <i className={declineReason === reasonOption ? "fas fa-check-circle" : "far fa-circle"} />
                    <span>{reasonOption}</span>
                  </button>
                ))}
                {declineReason === "Other" && (
                  <input
                    type="text"
                    className="reqquotes-decline-custom-input"
                    placeholder="Enter specific reason..."
                    value={customDeclineReason}
                    onChange={(e) => setCustomDeclineReason(e.target.value)}
                  />
                )}
              </div>
            </div>
            <div className="reqquotes-modal-actions">
              <button
                type="button"
                className="reqquotes-btn-cancel"
                onClick={() => setConfirmRejectQuote(null)}
                disabled={rejectMutation.isPending}
              >
                Keep Quote
              </button>
              <button
                type="button"
                className="reqquotes-btn-decline"
                onClick={handleConfirmReject}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Declining...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-times"></i>
                    <span>Confirm Decline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {redirectOverlay.show && (
        <div className="reqquotes-overlay-backdrop">
          <div className="reqquotes-overlay-box">
            <div className={`reqquotes-overlay-spinner ${redirectOverlay.type === "SUCCESS" ? "success" : "cancelled"}`}>
              {redirectOverlay.type === "SUCCESS" ? (
                <i className="fas fa-check-circle reqquotes-overlay-icon success"></i>
              ) : (
                <i className="fas fa-spinner fa-spin reqquotes-overlay-icon cancelled"></i>
              )}
            </div>
            <h3 className="reqquotes-overlay-title">
              {redirectOverlay.type === "SUCCESS" ? "Payment Successful!" : "Payment Cancelled"}
            </h3>
            <p className="reqquotes-overlay-text">{redirectOverlay.message}</p>
            <div className="reqquotes-overlay-timer">
              <span>Redirecting in </span>
              <strong>{redirectOverlay.countdown}s</strong>
            </div>
          </div>
        </div>
      )}

      <AiQuotationComparisonModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        serviceRequestId={requestId}
        quotations={activeQuotations}
        comparisonData={aiComparisonData}
        isLoading={compareAiMutation.isPending}
        onRefresh={handleRefreshAiComparison}
        onAcceptQuote={(quote) => setConfirmAcceptQuote(quote)}
        onChatWithProvider={(quote) => handleChat(quote)}
        requestTitle={requestItem?.title}
        errorMessage={aiError}
      />
    </>
  );
};

export const RequestQuotationsSkeleton: React.FC = () => {
  return (
    <div className="srdetails-card reqquotes-card-wrapper">
      <div className="srdetails-card-header">
        <div className="srdetails-card-header-left">
          <i className="fas fa-file-invoice-dollar srdetails-card-icon"></i>
          <h3 className="srdetails-card-title">Provider Quotations</h3>
        </div>
        <div className="reqquotes-sk-pill srdetails-shimmer" style={{ width: "95px", height: "24px" }} />
      </div>

      <div className="reqquotes-list">
        {[1, 2].map((idx) => (
          <div key={idx} className="reqquotes-item reqquotes-sk-item">
            <div className="reqquotes-item-header">
              <div className="reqquotes-provider-info">
                <div className="reqquotes-avatar srdetails-shimmer" />
                <div className="reqquotes-provider-details" style={{ gap: "0.45rem" }}>
                  <div className="reqquotes-sk-line srdetails-shimmer" style={{ width: "150px", height: "16px" }} />
                  <div className="reqquotes-sk-line srdetails-shimmer" style={{ width: "210px", height: "12px" }} />
                </div>
              </div>
              <div className="reqquotes-price-container" style={{ alignItems: "flex-end", gap: "0.4rem" }}>
                <div className="reqquotes-sk-line srdetails-shimmer" style={{ width: "90px", height: "24px" }} />
                <div className="reqquotes-sk-line srdetails-shimmer" style={{ width: "75px", height: "14px" }} />
              </div>
            </div>

            <div className="reqquotes-sk-box srdetails-shimmer" style={{ height: "48px", marginBottom: "0.95rem" }} />

            <div className="reqquotes-meta-grid">
              <div className="reqquotes-sk-pill srdetails-shimmer" style={{ width: "160px", height: "28px" }} />
              <div className="reqquotes-sk-pill srdetails-shimmer" style={{ width: "120px", height: "28px" }} />
              <div className="reqquotes-sk-pill srdetails-shimmer" style={{ width: "145px", height: "28px" }} />
            </div>

            <div className="reqquotes-card-footer" style={{ marginTop: "0.85rem" }}>
              <div className="reqquotes-sk-btn srdetails-shimmer" style={{ width: "140px", height: "36px" }} />
              <div className="reqquotes-actions-group">
                <div className="reqquotes-sk-btn srdetails-shimmer" style={{ width: "80px", height: "36px" }} />
                <div className="reqquotes-sk-btn srdetails-shimmer" style={{ width: "115px", height: "36px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
