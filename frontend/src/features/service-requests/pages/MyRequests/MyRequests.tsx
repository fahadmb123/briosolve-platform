import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./MyRequests.css";
import {
  useGetMyServiceRequests,
  useCancelServiceRequest
} from "../../hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import {
  RequestStatsCards,
  RequestFilterBar,
  RequestCard,
  RequestDetailsModal,
  CancelConfirmModal,
  EditRequestModal,
  type StatusFilterType,
  type SortOrderType
} from "../../components/my-requests";

export default function MyRequests() {
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>("ALL");
  const [sortBy, setSortBy] = useState<SortOrderType>("NEWEST");
  const [selectedRequestForDetails, setSelectedRequestForDetails] =
    useState<CustomerServiceRequestItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedRequestForCancel, setSelectedRequestForCancel] =
    useState<CustomerServiceRequestItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [selectedRequestForEdit, setSelectedRequestForEdit] =
    useState<CustomerServiceRequestItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const getRequestsMutation = useGetMyServiceRequests();
  const cancelMutation = useCancelServiceRequest();

  const fetchRequests = useCallback(() => {
    getRequestsMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.data) {
          setRequests(res.data);
        }
      },
      onError: () => {
        toast.error("Failed to load your service requests");
      }
    });
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const counts: Record<StatusFilterType, number> = useMemo(() => {
    const map: Record<StatusFilterType, number> = {
      ALL: requests.length,
      DRAFT: 0,
      PENDING: 0,
      ACTIVE: 0,
      ACCEPTED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      EXPIRED: 0
    };

    requests.forEach((r) => {
      if (r.status in map) {
        map[r.status as StatusFilterType] += 1;
      }
    });

    return map;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const result = requests.filter((req) => {
      if (selectedStatus !== "ALL" && req.status !== selectedStatus) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = req.title.toLowerCase().includes(query);
        const descMatch = req.description.toLowerCase().includes(query);
        const categoryMatch = (req.category_name || "").toLowerCase().includes(query);
        const subserviceMatch = (req.subservice_name || "").toLowerCase().includes(query);
        const locationMatch = req.address_details
          ? `${req.address_details.area} ${req.address_details.city} ${req.address_details.landmark || ""}`
            .toLowerCase()
            .includes(query)
          : false;

        return titleMatch || descMatch || categoryMatch || subserviceMatch || locationMatch;
      }

      return true;
    });

    result.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sortBy === "NEWEST" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [requests, selectedStatus, searchQuery, sortBy]);

  const handleOpenDetails = (request: CustomerServiceRequestItem) => {
    setSelectedRequestForDetails(request);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedRequestForDetails(null);
  };

  const handleOpenCancel = (request: CustomerServiceRequestItem) => {
    setSelectedRequestForCancel(request);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancel = () => {
    setIsCancelModalOpen(false);
    setSelectedRequestForCancel(null);
  };

  const handleOpenEdit = (request: CustomerServiceRequestItem) => {
    setSelectedRequestForEdit(request);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedRequestForEdit(null);
  };

  const handleEditSuccess = (updated: CustomerServiceRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    if (selectedRequestForDetails?.id === updated.id) {
      setSelectedRequestForDetails(updated);
    }
  };

  const handleConfirmCancel = () => {
    if (!selectedRequestForCancel) return;

    cancelMutation.mutate(selectedRequestForCancel.id, {
      onSuccess: () => {
        toast.success("Service request cancelled");
        setRequests((prev) =>
          prev.map((r) =>
            r.id === selectedRequestForCancel.id
              ? { ...r, status: "CANCELLED" }
              : r
          )
        );
        handleCloseCancel();
        if (selectedRequestForDetails?.id === selectedRequestForCancel.id) {
          setSelectedRequestForDetails((prev) =>
            prev ? { ...prev, status: "CANCELLED" } : null
          );
        }
      },
      onError: () => {
        toast.error("Failed to cancel request");
      }
    });
  };

  const isLoading = getRequestsMutation.isPending && requests.length === 0;

  return (
    <div className="app-content myreq-wrapper">
      <div className="myreq-top-header">
        <div className="myreq-header-info">
          <h1 className="myreq-page-title">My Service Requests</h1>
          <p className="myreq-page-subtitle">
            Manage your posted requirements, evaluate responses, and keep track of job progress.
          </p>
        </div>

        <div className="myreq-header-actions">
          <Link to="/request-service" className="myreq-btn-post">
            <i className="fas fa-plus"></i>
            <span>Post a Request</span>
          </Link>
        </div>
      </div>

      <RequestStatsCards requests={requests} />

      <RequestFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        counts={counts}
      />

      {isLoading ? (
        <div className="myreq-loading-box">
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Loading your service requests...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="myreq-empty-panel">
          <div className="myreq-empty-symbol">
            <i className="fas fa-clipboard-list"></i>
          </div>
          {requests.length === 0 ? (
            <>
              <h3 className="myreq-empty-title">No service requests yet</h3>
              <p className="myreq-empty-text">
                Post your first service requirement to start receiving quotes from verified specialists in your neighborhood.
              </p>
              <Link to="/request-service" className="myreq-btn-post">
                <i className="fas fa-plus"></i>
                <span>Post Your First Request</span>
              </Link>
            </>
          ) : (
            <>
              <h3 className="myreq-empty-title">No matching requests</h3>
              <p className="myreq-empty-text">
                We couldn't find any requests matching your selected filters or search terms.
              </p>
              <button
                type="button"
                className="myreq-btn-subtle"
                onClick={() => {
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                }}
              >
                Reset filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="myreq-cards-grid">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onViewDetails={handleOpenDetails}
              onEditRequest={handleOpenEdit}
              onCancelRequest={handleOpenCancel}
            />
          ))}
        </div>
      )}

      <RequestDetailsModal
        request={selectedRequestForDetails}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onEditRequest={handleOpenEdit}
        onCancelRequest={handleOpenCancel}
      />

      <EditRequestModal
        request={selectedRequestForEdit}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSuccess={handleEditSuccess}
      />

      <CancelConfirmModal
        request={selectedRequestForCancel}
        isOpen={isCancelModalOpen}
        isCancelling={cancelMutation.isPending}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
