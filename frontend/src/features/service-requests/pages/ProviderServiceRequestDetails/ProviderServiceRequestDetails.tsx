import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { useGetProviderServiceRequests } from "../../hooks/useServiceRequestMutations";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { calculateDistanceKm } from "../../utils/distance.utils";
import { ServiceRequestDetailsView } from "../../components/ServiceRequestDetailsView/ServiceRequestDetailsView";

export default function ProviderServiceRequestDetails() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const stateRequest = (location.state as { request?: CustomerServiceRequestItem } | null)?.request;

  const [request, setRequest] = useState<CustomerServiceRequestItem | null>(
    stateRequest || null
  );

  const user = useAuthStore((s) => s.user);
  const { data: requestsRes } = useGetProviderServiceRequests({ page: 1, limit: 100 });

  useEffect(() => {
    if (!request && requestId && requestsRes?.data?.requests) {
      const found = requestsRes.data.requests.find((r) => r.id === requestId);
      if (found) {
        setRequest(found);
      }
    }
  }, [requestId, request, requestsRes]);

  const providerAddress = user?.current_address_id;
  const providerLat = providerAddress?.latitude != null ? Number(providerAddress.latitude) : null;
  const providerLng = providerAddress?.longitude != null ? Number(providerAddress.longitude) : null;
  const serviceRadiusKm = user?.provider_profile?.service_radius_km ?? 20;

  const address = request?.address_details;
  const reqLat = address?.latitude != null ? Number(address.latitude) : null;
  const reqLng = address?.longitude != null ? Number(address.longitude) : null;

  const computedDistance = useMemo(() => {
    if (!request) return null;
    return (
      request.distance_km ??
      (providerLat != null && providerLng != null && reqLat != null && reqLng != null
        ? calculateDistanceKm(providerLat, providerLng, reqLat, reqLng)
        : null)
    );
  }, [request, providerLat, providerLng, reqLat, reqLng]);

  const isWithinRadius = computedDistance !== null ? computedDistance <= serviceRadiusKm : true;

  const handleBack = () => {
    navigate("/provider/service-requests");
  };

  const handleQuoteClick = () => {
    if (!request) return;
    navigate(`/provider/service-requests/${request.id}/quote`, {
      state: { request }
    });
  };

  const handleViewQuotationClick = () => {
    navigate("/provider/quotations");
  };

  const handleChatClick = () => {
    if (!request?.customer_id) {
      toast.error("Customer details not available");
      return;
    }

    const addressStr = address
      ? `${address.area || ""}, ${address.city || ""}`.trim().replace(/^,|,$/g, "")
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

  return (
    <ServiceRequestDetailsView
      role="PROVIDER"
      request={request}
      onBack={handleBack}
      backLabel="Back to Service Requests"
      onQuote={handleQuoteClick}
      onViewQuotation={handleViewQuotationClick}
      onChat={handleChatClick}
      distanceKm={computedDistance}
      serviceRadiusKm={serviceRadiusKm}
      isWithinRadius={isWithinRadius}
    />
  );
}
