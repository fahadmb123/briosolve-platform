import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./MyRequests.css";
import {
  useGetMyServiceRequests,
  useCancelServiceRequest,
  useReopenServiceRequest
} from "../../hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import type { ReopenServiceRequestPayload } from "../../services/serviceRequest.service";
import {
  RequestFilterBar,
  RequestCard,
  RequestDetailsModal,
  CancelConfirmModal,
  EditRequestModal,
  ReopenRequestModal,
  type StatusFilterType,
  type SortOrderType
} from "../../components/my-requests";
import { ServiceRequestCardSkeleton } from "../../components/ServiceRequestCardSkeleton";

export default function MyRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [, setTotal] = useState<number>(0);
  const [counts, setCounts] = useState<Record<StatusFilterType, number>>({
    ALL: 0,
    DRAFT: 0,
    PENDING: 0,
    ACTIVE: 0,
    ACCEPTED: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    EXPIRED: 0
  });

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
  const [selectedRequestForReopen, setSelectedRequestForReopen] =
    useState<CustomerServiceRequestItem | null>(null);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState<boolean>(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const cancelMutation = useCancelServiceRequest();
  const reopenMutation = useReopenServiceRequest();

  const { data: requestsRes, isLoading: isQueryLoading, isFetching, refetch } = useGetMyServiceRequests({
    page,
    limit: 10,
    search: searchQuery.trim() || undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    sortBy
  });

  useEffect(() => {
    if (requestsRes?.data) {
      const data = requestsRes.data;
      if (Array.isArray(data)) {
        setRequests((prev) => {
          if (page === 1) return data;
          const existingIds = new Set(prev.map((r) => r.id));
          const newItems = data.filter((r) => !existingIds.has(r.id));
          return [...prev, ...newItems];
        });
      } else {
        const incoming = data.requests || [];
        setRequests((prev) => {
          if (page === 1) return incoming;
          const existingIds = new Set(prev.map((r) => r.id));
          const newItems = incoming.filter((r) => !existingIds.has(r.id));
          return [...prev, ...newItems];
        });
        if (data.counts) {
          setCounts((prev) => ({ ...prev, ...data.counts }));
        }
        if (data.total !== undefined) setTotal(data.total);
        if (data.totalPages !== undefined) setTotalPages(data.totalPages);
      }
    }
  }, [requestsRes, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedStatus, sortBy]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, totalPages, isFetching]);

  const handleStatusChange = (status: StatusFilterType) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleSortChange = (sort: SortOrderType) => {
    setSortBy(sort);
    setPage(1);
  };

  const handleOpenDetails = (request: CustomerServiceRequestItem) => {
    navigate(`/my-requests/${request.id}`, {
      state: { request }
    });
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

  const handleOpenReopen = (request: CustomerServiceRequestItem) => {
    setSelectedRequestForReopen(request);
    setIsReopenModalOpen(true);
  };

  const handleCloseReopen = () => {
    setIsReopenModalOpen(false);
    setSelectedRequestForReopen(null);
  };

  const handleConfirmReopen = (data: ReopenServiceRequestPayload) => {
    if (!selectedRequestForReopen) return;

    reopenMutation.mutate(
      {
        id: selectedRequestForReopen.id,
        data
      },
      {
        onSuccess: (res) => {
          toast.success("Service request reopened successfully");
          handleCloseReopen();
          setSelectedStatus("ALL");
          setPage(1);
          if (res?.data) {
            setRequests((prev) =>
              prev.map((r) => (r.id === res.data.id ? { ...r, ...res.data } : r))
            );
          }
          setPage(1);
          refetch();
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

  const handleEditSuccess = (updated: CustomerServiceRequestItem) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    if (selectedRequestForDetails?.id === updated.id) {
      setSelectedRequestForDetails(updated);
    }
    setPage(1);
    refetch();
  };

  const handleConfirmCancel = () => {
    if (!selectedRequestForCancel) return;

    cancelMutation.mutate(selectedRequestForCancel.id, {
      onSuccess: () => {
        toast.success("Service request cancelled");
        handleCloseCancel();
        setPage(1);
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || "Failed to cancel request");
      }
    });
  };

  const isLoading = isQueryLoading && requests.length === 0;

  return (
    <div className="app-content myreq-wrapper">
      <div className="myreq-top-header">
        <div className="myreq-header-info">
          <div className="myreq-title-badge-row">
            <h1 className="myreq-page-title">My Service Requests</h1>
            <span className="myreq-client-badge">Client Portal</span>
          </div>
          <p className="myreq-page-subtitle">
            Manage your posted requirements, evaluate contractor responses, and track real-time job progress.
          </p>
        </div>

        <div className="myreq-header-actions">
          <Link to="/request-service" className="myreq-btn-post">
            <i className="fas fa-plus"></i>
            <span>Post a Request</span>
          </Link>
        </div>
      </div>

      <RequestFilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        counts={counts}
      />

      {isLoading ? (
        <div className="myreq-cards-stack">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ServiceRequestCardSkeleton key={idx} variant="customer" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="myreq-empty-panel">
          <img
            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
            alt="No data found"
            className="myreq-empty-img"
          />
          {searchQuery === "" && selectedStatus === "ALL" ? (
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
                  setPage(1);
                }}
              >
                Reset filters
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="myreq-cards-stack">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onViewDetails={handleOpenDetails}
                onEditRequest={handleOpenEdit}
                onCancelRequest={handleOpenCancel}
                onReopenRequest={handleOpenReopen}
              />
            ))}
            {isFetching && page > 1 &&
              Array.from({ length: 2 }).map((_, idx) => (
                <ServiceRequestCardSkeleton key={`skeleton-${idx}`} variant="customer" />
              ))}
          </div>

          {page < totalPages && <div ref={sentinelRef} className="myreq-sentinel" />}

          {page >= totalPages && requests.length > 0 && totalPages > 1 && (
            <div className="myreq-end-message">
              <span>You've reached the end of your service requests</span>
            </div>
          )}
        </>
      )}

      <RequestDetailsModal
        request={selectedRequestForDetails}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        onEditRequest={handleOpenEdit}
        onCancelRequest={handleOpenCancel}
        onReopenRequest={handleOpenReopen}
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

      <ReopenRequestModal
        request={selectedRequestForReopen}
        isOpen={isReopenModalOpen}
        isReopening={reopenMutation.isPending}
        onClose={handleCloseReopen}
        onConfirm={handleConfirmReopen}
      />
    </div>
  );
}
