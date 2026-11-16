import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetProviderServiceRequests } from "../../../service-requests/hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../../service-requests/types/serviceRequest.types";
import { QuotationForm } from "../../components/QuotationForm";
import { QuotationSummaryPreview } from "../../components/QuotationSummaryPreview";
import { RequestBriefCard } from "../../components/RequestBriefCard";
import type { QuotationFormData } from "../../types/quotation.types";
import "./SubmitQuotation.css";

export default function SubmitQuotation() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);

  const passedRequest = (location.state as { request?: CustomerServiceRequestItem } | null)?.request;

  const [request, setRequest] = useState<CustomerServiceRequestItem | null>(
    passedRequest || null
  );
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedQuote, setSubmittedQuote] = useState<QuotationFormData | null>(null);

  const [livePreviewData, setLivePreviewData] = useState<Partial<QuotationFormData>>({
    amount: 2500,
    quotationType: "FIXED",
    workDescription: "AC gas refill and basic service. Complete vacuuming, leak check, high-grade refrigerant refilling and filter cleaning.",
    includedItems: ["Labour charges", "Basic service inspection", "Gas check"],
    excludedItems: ["Spare parts & materials", "Major repair"],
    estimatedDuration: "1–2 hours",
    availableDateTime: "Today 6:00 PM",
    messageToCustomer: "I can come today evening.",
    validUntil: "24_HOURS",
    extraChargePolicy: "Spare parts at actual cost"
  });

  const getRequestsMutation = useGetProviderServiceRequests();

  useEffect(() => {
    if (!request && requestId) {
      getRequestsMutation.mutate(
        { page: 1, limit: 50 },
        {
          onSuccess: (res) => {
            const found = res.data?.requests?.find((r) => r.id === requestId);
            if (found) {
              setRequest(found);
            }
          }
        }
      );
    }
  }, [requestId, request]);

  const handleFormChange = (data: Partial<QuotationFormData>) => {
    setLivePreviewData((prev) => ({
      ...prev,
      ...data
    }));
  };

  const handleFormSubmit = async (formData: QuotationFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedQuote(formData);
      toast.success("Quotation submitted successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/provider/service-requests");
  };

  const readinessScore = [
    Boolean(livePreviewData.amount && Number(livePreviewData.amount) >= 50),
    Boolean(livePreviewData.quotationType),
    Boolean((livePreviewData.workDescription || "").trim().length >= 15),
    Boolean((livePreviewData.includedItems || []).length > 0),
    Boolean((livePreviewData.excludedItems || []).length > 0),
    Boolean(livePreviewData.validUntil),
    Boolean((livePreviewData.extraChargePolicy || "").trim().length >= 5),
    Boolean(livePreviewData.estimatedDuration),
    Boolean(livePreviewData.availableDateTime),
    Boolean(livePreviewData.messageToCustomer)
  ].filter(Boolean).length * 10;

  return (
    <div className="quote-page-container">
      <div className="quote-breadcrumb-bar">
        <button
          type="button"
          className="quote-back-btn"
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Service Requests</span>
        </button>
      </div>

      <div className="quote-page-header">
        <div className="quote-header-left">
          <span className="quote-header-badge">
            <i className="fas fa-file-invoice-dollar"></i> Provider Quotation Portal
          </span>
          <h1 className="quote-header-title">Submit Quotation</h1>
          <p className="quote-header-subtext">
            Send a transparent, competitive quote directly to the customer
          </p>
        </div>
      </div>

      {submittedQuote && (
        <div className="quote-success-banner">
          <div className="quote-success-left">
            <i className="fas fa-check-circle quote-success-icon"></i>
            <div>
              <h4 className="quote-success-title">Quotation Submitted Successfully!</h4>
              <p className="quote-success-sub">
                The customer has been notified with your offer of ₹
                {Number(submittedQuote.amount).toLocaleString("en-IN")}.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="quote-btn-cancel"
            onClick={handleBack}
          >
            Return to Requests
          </button>
        </div>
      )}

      <div className="quote-layout-grid">
        <div className="quote-form-column">
          <QuotationForm
            initialValues={livePreviewData}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            onCancel={handleBack}
            onFormChange={handleFormChange}
          />
        </div>

        <div className="quote-side-column">
          <div className="quote-card quote-readiness-card">
            <div className="quote-readiness-header">
              <div className="quote-readiness-left">
                <i className="fas fa-chart-pie quote-readiness-icon"></i>
                <span className="quote-readiness-title">Quote Quality Score</span>
              </div>
              <span className={`quote-readiness-percent ${readinessScore === 100 ? "perfect" : ""}`}>
                {readinessScore}%
              </span>
            </div>
            <div className="quote-progress-bar-track">
              <div
                className="quote-progress-bar-fill"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span className="quote-readiness-hint">
              {readinessScore === 100
                ? "Perfect! Your quotation covers all essential and recommended fields."
                : "Complete all recommended fields to improve customer response rate."}
            </span>
          </div>

          <RequestBriefCard
            request={request}
            onSelectPhoto={setLightboxPhoto}
          />

          <QuotationSummaryPreview
            quote={livePreviewData}
            providerName={user?.name || "You"}
          />

          <div className="quote-card quote-pro-tips-card">
            <div className="quote-tips-header">
              <i className="fas fa-lightbulb"></i>
              <span>Winning Quotation Tips</span>
            </div>
            <ul className="quote-tips-list">
              <li>Detailed inclusions reduce customer doubts by 65%.</li>
              <li>Always clarify what is not included to avoid payment disputes.</li>
              <li>Add a friendly personal note to build immediate trust.</li>
              <li>Clear extra-charge policy creates professional transparency.</li>
            </ul>
          </div>
        </div>
      </div>

      {lightboxPhoto && (
        <div
          className="quote-lightbox-overlay"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="quote-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto}
              alt="Requirement preview"
              className="quote-lightbox-img"
            />
            <button
              type="button"
              className="quote-lightbox-close"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close image"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
