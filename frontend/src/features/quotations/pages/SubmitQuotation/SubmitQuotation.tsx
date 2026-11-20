import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetProviderServiceRequests } from "../../../service-requests/hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../../service-requests/types/serviceRequest.types";
import { QuotationForm } from "../../components/QuotationForm";
import { RequestBriefCard } from "../../components/RequestBriefCard";
import type { QuotationFormData, ProviderQuotationItem } from "../../types/quotation.types";
import { useSubmitQuotation, useUpdateQuotation, useGetMyQuotations } from "../../hooks/useQuotationMutations";
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

  const [request, setRequest] = useState<CustomerServiceRequestItem | null>(
    passedRequest || null
  );
  const [quotationToEdit, setQuotationToEdit] = useState<ProviderQuotationItem | null>(
    passedQuotation || null
  );
  const isEditing = Boolean((locationState?.isEditing || quotationToEdit) && quotationToEdit);

  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const { data: requestsRes } = useGetProviderServiceRequests({ page: 1, limit: 50 });
  const { data: quotationsRes } = useGetMyQuotations({ page: 1, limit: 50 });
  const submitQuotationMutation = useSubmitQuotation();
  const updateQuotationMutation = useUpdateQuotation();

  useEffect(() => {
    if (!request && requestId && requestsRes?.data?.requests) {
      const found = requestsRes.data.requests.find((r) => r.id === requestId);
      if (found) {
        setRequest(found);
      }
    }
  }, [requestId, request, requestsRes]);

  useEffect(() => {
    if (!quotationToEdit && requestId && locationState?.isEditing && quotationsRes?.data?.quotations) {
      const found = quotationsRes.data.quotations.find((q) => q.serviceRequestId === requestId);
      if (found) {
        setQuotationToEdit(found);
      }
    }
  }, [requestId, locationState?.isEditing, quotationToEdit, quotationsRes]);

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
    if (blockedInfo) {
      toast.error(blockedInfo.desc);
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid quotation amount");
      return;
    }

    if (isEditing && quotationToEdit) {
      updateQuotationMutation.mutate(
        {
          id: quotationToEdit.id,
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

  const formInitialValues = useMemo(() => {
    if (!isEditing || !quotationToEdit) return undefined;
    return {
      amount: quotationToEdit.amount,
      quotationType: quotationToEdit.quotationType,
      workDescription: quotationToEdit.workDescription,
      includedItems: quotationToEdit.includedItems,
      excludedItems: quotationToEdit.excludedItems,
      estimatedDuration: quotationToEdit.estimatedDuration || "",
      availableDateTime: quotationToEdit.availableDateTime || "",
      validUntil: quotationToEdit.validUntil,
      extraChargePolicy: quotationToEdit.extraChargePolicy
    };
  }, [isEditing, quotationToEdit]);

  const blockedInfo = useMemo(() => {
    if (isEditing) {
      if (request?.status === "ACCEPTED" || request?.status === "IN_PROGRESS") {
        return {
          title: "Request Already Accepted",
          desc: "This service request has already been accepted and quotations cannot be modified.",
          icon: "fa-user-check"
        };
      }
      if (request?.status === "COMPLETED") {
        return {
          title: "Service Request Completed",
          desc: "This service request has been completed. Quotations cannot be modified.",
          icon: "fa-check-circle"
        };
      }
      if (request?.status === "EXPIRED") {
        return {
          title: "Service Request Expired",
          desc: "This service request has expired. Quotations cannot be modified.",
          icon: "fa-calendar-times"
        };
      }
      if (request?.status === "CANCELLED") {
        return {
          title: "Service Request Cancelled",
          desc: "This service request was cancelled by the customer. Quotations cannot be modified.",
          icon: "fa-ban"
        };
      }
      return null;
    }

    if (request?.my_quotation_status === "WITHDRAWN") {
      return {
        title: "Booking Cancelled — Cannot Re-quote",
        desc: "A previous booking or quotation for this request was cancelled. Marketplace policies do not permit submitting a new quotation for the same service request.",
        icon: "fa-ban"
      };
    }
    if (request?.has_quoted) {
      return {
        title: "Quotation Already Submitted",
        desc: "You have already submitted a quotation for this service request. You can check its status under My Quotations.",
        icon: "fa-check-circle"
      };
    }
    if (request?.status === "ACCEPTED" || request?.status === "IN_PROGRESS") {
      return {
        title: "Request Already Accepted",
        desc: "This service request has already been accepted by another service provider and is no longer accepting new quotations.",
        icon: "fa-user-check"
      };
    }
    if (request?.status === "COMPLETED") {
      return {
        title: "Service Request Completed",
        desc: "This service request has been completed and is closed for further quotations.",
        icon: "fa-check-circle"
      };
    }
    if (request?.status === "EXPIRED") {
      return {
        title: "Service Request Expired",
        desc: "This service request has expired and is no longer open for quotations.",
        icon: "fa-calendar-times"
      };
    }
    if (request?.status === "CANCELLED") {
      return {
        title: "Service Request Cancelled",
        desc: "This service request has been cancelled by the customer.",
        icon: "fa-ban"
      };
    }
    return null;
  }, [isEditing, request]);

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
          {blockedInfo ? (
            <div className="quote-cancelled-blocked-card">
              <div className="quote-blocked-icon">
                <i className={`fas ${blockedInfo.icon}`}></i>
              </div>
              <h2 className="quote-blocked-title">{blockedInfo.title}</h2>
              <p className="quote-blocked-desc">{blockedInfo.desc}</p>
              <div className="quote-blocked-actions">
                <button
                  type="button"
                  className="quote-blocked-primary-btn"
                  onClick={() => navigate("/provider/service-requests")}
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Browse Available Requests</span>
                </button>
                <button
                  type="button"
                  className="quote-blocked-secondary-btn"
                  onClick={() => navigate("/provider/quotations")}
                >
                  <i className="fas fa-file-alt"></i>
                  <span>View My Quotations</span>
                </button>
              </div>
            </div>
          ) : (
            <QuotationForm
              initialValues={formInitialValues}
              isEditing={isEditing}
              onSubmit={handleFormSubmit}
              isSubmitting={submitQuotationMutation.isPending || updateQuotationMutation.isPending}
              onCancel={handleBack}
              onChat={handleChatClick}
            />
          )}
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
