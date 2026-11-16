import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetProviderServiceRequests } from "../../../service-requests/hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../../service-requests/types/serviceRequest.types";
import { QuotationForm } from "../../components/QuotationForm";
import { RequestBriefCard } from "../../components/RequestBriefCard";
import type { QuotationFormData } from "../../types/quotation.types";
import "./SubmitQuotation.css";

export default function SubmitQuotation() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const passedRequest = (location.state as { request?: CustomerServiceRequestItem } | null)?.request;

  const [request, setRequest] = useState<CustomerServiceRequestItem | null>(
    passedRequest || null
  );
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleFormSubmit = async (_formData: QuotationFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Quotation submitted successfully");
      navigate("/provider/service-requests");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/provider/service-requests");
  };

  return (
    <div className="quote-page">
      <div className="quote-top-bar">
        <button
          type="button"
          className="quote-back-button"
          onClick={handleBack}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Requests</span>
        </button>
      </div>

      <div className="quote-heading-section">
        <h1 className="quote-main-title">Send Quotation</h1>
        <p className="quote-main-subtitle">
          Submit your proposal, deliverables, and terms directly to the customer.
        </p>
      </div>

      <div className="quote-grid-container">
        <div className="quote-main-column">
          <QuotationForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            onCancel={handleBack}
          />
        </div>

        <div className="quote-sidebar-column">
          <RequestBriefCard
            request={request}
            onSelectPhoto={setLightboxPhoto}
          />
        </div>
      </div>

      {lightboxPhoto && (
        <div
          className="quote-lightbox-backdrop"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="quote-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto}
              alt="Requirement preview"
              className="quote-lightbox-image"
            />
            <button
              type="button"
              className="quote-lightbox-close-btn"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
