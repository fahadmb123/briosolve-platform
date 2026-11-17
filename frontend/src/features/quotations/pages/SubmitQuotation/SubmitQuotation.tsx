import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetProviderServiceRequests } from "../../../service-requests/hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../../service-requests/types/serviceRequest.types";
import { QuotationForm } from "../../components/QuotationForm";
import { RequestBriefCard } from "../../components/RequestBriefCard";
import type { QuotationFormData, ProviderQuotationItem } from "../../types/quotation.types";
import { useSubmitQuotation, useUpdateQuotation } from "../../hooks/useQuotationMutations";
import "./SubmitQuotation.css";

export default function SubmitQuotation() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as {
    request?: CustomerServiceRequestItem;
    quotation?: ProviderQuotationItem;
    isEditing?: boolean;
  } | null;

  const passedRequest = locationState?.request;
  const passedQuotation = locationState?.quotation;
  const isEditing = Boolean(locationState?.isEditing && passedQuotation);

  const [request, setRequest] = useState<CustomerServiceRequestItem | null>(
    passedRequest || null
  );
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const getRequestsMutation = useGetProviderServiceRequests();
  const submitQuotationMutation = useSubmitQuotation();
  const updateQuotationMutation = useUpdateQuotation();

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

  const handleChatClick = () => {
    if (!request?.customer_id) {
      toast.error("Customer details not available for this request");
      return;
    }

    const addressStr = request.address_details
      ? `${request.address_details.area || ""}, ${request.address_details.city || ""}`.trim().replace(/^,|,$/g, "")
      : "Service Location";

    navigate(`/provider/messages?recipientId=${request.customer_id}`, {
      state: {
        recipientId: request.customer_id,
        recipientName: request.customer_details?.name || "Customer",
        requestTitle: request.title,
        requestId: request.id,
        categoryName: request.category_name || "Services",
        urgency: request.urgency,
        budgetType: request.budget_type,
        budgetAmount: request.budget_amount || undefined,
        location: addressStr || "Service Location",
      },
    });
  };

  const handleFormSubmit = async (formData: QuotationFormData) => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid quotation amount");
      return;
    }

    if (isEditing && passedQuotation) {
      updateQuotationMutation.mutate(
        {
          id: passedQuotation.id,
          amount: Number(formData.amount),
          quotationType: formData.quotationType,
          workDescription: formData.workDescription,
          includedItems: formData.includedItems,
          excludedItems: formData.excludedItems,
          estimatedDuration: formData.estimatedDuration || undefined,
          availableDateTime: formData.availableDateTime || undefined,
          validUntil: formData.validUntil,
          extraChargePolicy: formData.extraChargePolicy
        },
        {
          onSuccess: () => {
            toast.success("Quotation updated successfully");
            navigate("/provider/quotations");
          },
          onError: (err: any) => {
            const errorMessage =
              err?.response?.data?.message || err?.message || "Failed to update quotation";
            toast.error(errorMessage);
          }
        }
      );
      return;
    }

    const targetRequestId = requestId || request?.id;
    if (!targetRequestId) {
      toast.error("Invalid service request ID");
      return;
    }

    submitQuotationMutation.mutate(
      {
        serviceRequestId: targetRequestId,
        amount: Number(formData.amount),
        quotationType: formData.quotationType,
        workDescription: formData.workDescription,
        includedItems: formData.includedItems,
        excludedItems: formData.excludedItems,
        estimatedDuration: formData.estimatedDuration || undefined,
        availableDateTime: formData.availableDateTime || undefined,
        validUntil: formData.validUntil,
        extraChargePolicy: formData.extraChargePolicy
      },
      {
        onSuccess: () => {
          toast.success("Quotation submitted successfully");
          navigate("/provider/quotations");
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.message || err?.message || "Failed to submit quotation";
          toast.error(errorMessage);
        }
      }
    );
  };

  const handleBack = () => {
    navigate("/provider/service-requests");
  };

  return (
    <div className="quote-page">
      <div className="quote-hero-banner">
        <div className="quote-hero-left">
          <button
            type="button"
            className="quote-back-btn"
            onClick={handleBack}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Service Requests</span>
          </button>
          <div className="quote-hero-title-row">
            <h1 className="quote-hero-title">{isEditing ? "Edit Quotation" : "Send Quotation"}</h1>
            {request?.category_name && (
              <span className="quote-hero-category-badge">
                <i className="fas fa-tag"></i>
                {request.category_name}
              </span>
            )}
          </div>
          <p className="quote-hero-subtext">
            {isEditing
              ? `Update your proposal terms and pricing for "${request?.title || "service request"}"`
              : request?.title
              ? `Submit your proposal and pricing for "${request.title}"`
              : "Submit your proposal, deliverables, and terms directly to the customer."}
          </p>
        </div>
      </div>

      <div className="quote-grid-container">
        <div className="quote-main-column">
          <QuotationForm
            initialValues={
              isEditing && passedQuotation
                ? {
                    amount: passedQuotation.amount,
                    quotationType: passedQuotation.quotationType,
                    workDescription: passedQuotation.workDescription,
                    includedItems: passedQuotation.includedItems,
                    excludedItems: passedQuotation.excludedItems,
                    estimatedDuration: passedQuotation.estimatedDuration || "",
                    availableDateTime: passedQuotation.availableDateTime || "",
                    validUntil: passedQuotation.validUntil,
                    extraChargePolicy: passedQuotation.extraChargePolicy
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            isSubmitting={submitQuotationMutation.isPending || updateQuotationMutation.isPending}
            onCancel={handleBack}
            onChat={handleChatClick}
          />
        </div>

        <div className="quote-sidebar-column">
          <RequestBriefCard
            request={request}
            onSelectPhoto={setLightboxPhoto}
            onChat={handleChatClick}
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
