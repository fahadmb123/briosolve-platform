import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import {
  useGetMyServiceRequests,
  useCancelServiceRequest,
  useReopenServiceRequest
} from "../../hooks/useServiceRequestMutations";
import type { ReopenServiceRequestPayload } from "../../services/serviceRequest.service";
import { checkRequestEditPermission } from "../../utils/serviceRequestEdit.utils";
import {
  CancelConfirmModal,
  EditRequestModal,
  ReopenRequestModal
} from "../../components/my-requests";
import { ServiceRequestDetailsView } from "../../components/ServiceRequestDetailsView/ServiceRequestDetailsView";

export default function CustomerServiceRequestDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const stateRequest = (location.state as { request?: CustomerServiceRequestItem } | null)?.request;

  const [request, setRequest] = useState<CustomerServiceRequestItem | null>(
    stateRequest || null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState<boolean>(false);

  const { data: requestsRes, refetch } = useGetMyServiceRequests({ page: 1, limit: 50 });
  const cancelMutation = useCancelServiceRequest();
  const reopenMutation = useReopenServiceRequest();

  useEffect(() => {
    if (stateRequest) {
      setRequest(stateRequest);
    }
  }, [stateRequest]);

  useEffect(() => {
    if (requestId && requestsRes?.data) {
      const list = requestsRes.data.requests || [];
      const found = list.find((r: CustomerServiceRequestItem) => r.id === requestId);
      if (found) {
        setRequest(found);
      }
    }
  }, [requestId, requestsRes]);

  const permission = request ? checkRequestEditPermission(request) : { canEdit: false };
  const canCancel = request ? request.status === "PENDING" || request.status === "ACTIVE" : false;
  const canReopen = request ? request.status === "CANCELLED" || request.status === "EXPIRED" : false;

  const handleBack = () => {
    navigate("/my-requests");
  };

  const handleEditSuccess = (updated: CustomerServiceRequestItem) => {
    setRequest(updated);
    setIsEditModalOpen(false);
    toast.success("Service request updated successfully");
  };

  const handleConfirmCancel = () => {
    if (!request) return;
    cancelMutation.mutate(request.id, {
      onSuccess: () => {
        toast.success("Service request cancelled");
        setIsCancelModalOpen(false);
        setRequest((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || "Failed to cancel request");
      }
    });
  };

  const handleConfirmReopen = (data: ReopenServiceRequestPayload) => {
    if (!request) return;
    reopenMutation.mutate(
      {
        id: request.id,
        data
      },
      {
        onSuccess: (res) => {
          toast.success("Service request reopened successfully");
          setIsReopenModalOpen(false);
          if (res?.data) {
            setRequest((prev) => (prev ? { ...prev, ...res.data } : null));
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to reopen service request"
          );
        }
      }
    );
  };

  const handleQuotationAccepted = () => {
    setRequest((prev) => (prev ? { ...prev, status: "ACCEPTED" } : null));
    if (requestId) {
      refetch();
    }
  };

  return (
    <>
      <ServiceRequestDetailsView
        role="CUSTOMER"
        request={request}
        onBack={handleBack}
        backLabel="Back to My Requests"
        canEdit={permission.canEdit}
        canCancel={canCancel}
        canReopen={canReopen}
        onEdit={() => setIsEditModalOpen(true)}
        onCancel={() => setIsCancelModalOpen(true)}
        onReopen={() => setIsReopenModalOpen(true)}
        onQuotationAccepted={handleQuotationAccepted}
      />

      {request && (
        <>
          <EditRequestModal
            isOpen={isEditModalOpen}
            request={request}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleEditSuccess}
          />

          <CancelConfirmModal
            isOpen={isCancelModalOpen}
            request={request}
            isCancelling={cancelMutation.isPending}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleConfirmCancel}
          />

          <ReopenRequestModal
            isOpen={isReopenModalOpen}
            request={request}
            isReopening={reopenMutation.isPending}
            onClose={() => setIsReopenModalOpen(false)}
            onConfirm={handleConfirmReopen}
          />
        </>
      )}
    </>
  );
}
