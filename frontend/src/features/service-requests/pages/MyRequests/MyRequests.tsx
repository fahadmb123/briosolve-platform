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
  type StatusFilterType
} from "./components";

export default function MyRequests() {
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>("ALL");
  const [selectedRequestForDetails, setSelectedRequestForDetails] =
    useState<CustomerServiceRequestItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedRequestForCancel, setSelectedRequestForCancel] =
    useState<CustomerServiceRequestItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

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
      PENDING: 0,
      ACTIVE: 0,
      ACCEPTED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      EXPIRED: 0
    };

    requests.forEach((req) => {
      if (req.status in map) {
        map[req.status] = (map[req.status] || 0) + 1;
      }
    });

    return map;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      if (selectedStatus !== "ALL" && req.status !== selectedStatus) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(query);
        const matchesDesc = req.description.toLowerCase().includes(query);
        const matchesCategory = req.category_name?.toLowerCase().includes(query) ?? false;
        const matchesSubservice = req.subservice_name?.toLowerCase().includes(query) ?? false;
        const matchesCity = req.address_details?.city.toLowerCase().includes(query) ?? false;
        const matchesArea = req.address_details?.area.toLowerCase().includes(query) ?? false;

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesCategory &&
          !matchesSubservice &&
          !matchesCity &&
          !matchesArea
        ) {
          return false;
        }
      }

      return true;
    });
  }, [requests, selectedStatus, searchQuery]);

  const handleOpenDetails = (request: CustomerServiceRequestItem) => {
    setSelectedRequestForDetails(request);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedRequestForDetails(null);
    setIsDetailsModalOpen(false);
  };

  const handleOpenCancel = (request: CustomerServiceRequestItem) => {
    setSelectedRequestForCancel(request);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancel = () => {
    setSelectedRequestForCancel(null);
    setIsCancelModalOpen(false);
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
    <div className="app-content myreq-container">
      <div className="myreq-header">
        <div className="myreq-title-row">
          <div className="myreq-title-group">
            <div className="myreq-badge-pill">
              <span className="myreq-badge-dot"></span>
              <span>Customer Workspace</span>
            </div>
            <h1>My Service Requests</h1>
            <p>
              Track, inspect, and manage all your posted service requirements and provider responses.
            </p>
          </div>

          <div className="myreq-header-actions">
            <Link to="/request-service" className="myreq-btn-new-request">
              <i className="fas fa-plus-circle"></i>
              <span>Post New Request</span>
            </Link>
          </div>
        </div>
      </div>

      <RequestStatsCards requests={requests} />

      <RequestFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        counts={counts}
      />

      {isLoading ? (
        <div className="myreq-list-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="myreq-skeleton-card"></div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="myreq-empty-card">
          <div className="myreq-empty-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          {requests.length === 0 ? (
            <>
              <h3>No Service Requests Yet</h3>
              <p>
                You haven't posted any service requirements yet. Post a request to get matched with verified specialists in your local area.
              </p>
              <Link to="/request-service" className="myreq-btn-new-request">
                <i className="fas fa-plus"></i>
                <span>Post Your First Request</span>
              </Link>
            </>
          ) : (
            <>
              <h3>No Matching Requests</h3>
              <p>
                No requests found matching your current filter criteria or search keyword.
              </p>
              <button
                type="button"
                className="myreq-btn-secondary"
                onClick={() => {
                  setSelectedStatus("ALL");
                  setSearchQuery("");
                }}
              >
                <i className="fas fa-undo mr-1"></i>
                <span>Reset Filters</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="myreq-list-grid">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onViewDetails={handleOpenDetails}
              onCancelRequest={handleOpenCancel}
            />
          ))}
        </div>
      )}

      <RequestDetailsModal
        request={selectedRequestForDetails}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onCancelRequest={handleOpenCancel}
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
