import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./MyRequests.css";
import {
  useGetMyServiceRequests,
  useCancelServiceRequest
} from "../../hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import {
  RequestFilterBar,
  RequestCard,
  RequestDetailsModal,
  CancelConfirmModal,
  EditRequestModal,
  type StatusFilterType,
  type SortOrderType
} from "../../components/my-requests";
import { ServiceRequestCardSkeleton } from "../../components/ServiceRequestCardSkeleton";

export default function MyRequests() {
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>("ALL");
  const [sortBy, setSortBy] = useState<SortOrderType>("NEWEST");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRequests = useCallback(() => {
    getRequestsMutation.mutate(
      {
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        status: selectedStatus !== "ALL" ? selectedStatus : undefined,
        sortBy
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            setRequests(res.data.requests);
            setTotal(res.data.total);
            setTotalPages(res.data.totalPages);
            if (res.data.counts) {
              setCounts(res.data.counts as Record<StatusFilterType, number>);
            }
          }
        },
        onError: () => {
          toast.error("Failed to load your service requests");
        }
      }
    );
  }, [page, limit, debouncedSearch, selectedStatus, sortBy]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleStatusChange = (status: StatusFilterType) => {
    setSelectedStatus(status);
    setPage(1);
  };

  const handleSortChange = (sort: SortOrderType) => {
    setSortBy(sort);
    setPage(1);
  };

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
    fetchRequests();
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
        fetchRequests();
      },
      onError: () => {
        toast.error("Failed to cancel request");
      }
    });
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

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
        <div className="myreq-cards-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ServiceRequestCardSkeleton key={idx} variant="customer" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="myreq-empty-panel">
          <div className="myreq-empty-symbol">
            <i className="fas fa-clipboard-list"></i>
          </div>
          {counts.ALL === 0 && !searchQuery ? (
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
          <div className="myreq-cards-grid">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onViewDetails={handleOpenDetails}
                onEditRequest={handleOpenEdit}
                onCancelRequest={handleOpenCancel}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="myreq-pagination-row">
              <div className="myreq-pagination-controls">
                <button
                  type="button"
                  className="myreq-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous Page"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`myreq-page-btn ${page === pageNumber ? "active" : ""}`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  className="myreq-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next Page"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
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
