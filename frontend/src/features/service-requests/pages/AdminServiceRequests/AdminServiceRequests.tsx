import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import { AdminNoData } from "../../../../shared/components/ui/AdminNoData";
import { SpinnerOverlay } from "../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay";
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import {
  useGetAdminServiceRequests,
  useAdminCancelServiceRequest
} from "../../hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import "./AdminServiceRequests.css";

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CustomerServiceRequestItem | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<{ id: string; title: string } | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [limit] = useState<number>(10);
  const [, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const getRequests = useGetAdminServiceRequests();
  const cancelMutation = useAdminCancelServiceRequest();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchRequests = useCallback(() => {
    getRequests.mutate(
      {
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        status: filter || undefined
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            setRequests(res.data.requests || []);
            setTotal(res.data.total || 0);
            setTotalPages(res.data.totalPages || 0);
          }
        },
        onError: () => {
          toast.error("Failed to load service requests");
        }
      }
    );
  }, [page, limit, debouncedSearch, filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleReset = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setFilter("");
    setPage(1);
  }, []);

  const confirmCancel = useCallback(() => {
    if (!requestToCancel) return;
    cancelMutation.mutate(requestToCancel.id, {
      onSuccess: () => {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestToCancel.id ? { ...r, status: "CANCELLED" } : r))
        );
        if (selectedRequest?.id === requestToCancel.id) {
          setSelectedRequest((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
        }
        setRequestToCancel(null);
        toast.success("Service request cancelled");
      },
      onError: () => {
        toast.error("Failed to cancel service request");
      }
    });
  }, [requestToCancel, cancelMutation, selectedRequest]);

  const getStatusBadge = (status: CustomerServiceRequestItem["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <span className="admin-sr-badge badge-active"><i className="fas fa-check-circle"></i>Active</span>;
      case "PENDING":
        return <span className="admin-sr-badge badge-pending"><i className="fas fa-clock"></i>Pending</span>;
      case "ACCEPTED":
        return <span className="admin-sr-badge badge-accepted"><i className="fas fa-handshake"></i>Accepted</span>;
      case "IN_PROGRESS":
        return <span className="admin-sr-badge badge-in-progress"><i className="fas fa-tools"></i>In Progress</span>;
      case "COMPLETED":
        return <span className="admin-sr-badge badge-completed"><i className="fas fa-flag-checkered"></i>Completed</span>;
      case "CANCELLED":
        return <span className="admin-sr-badge badge-cancelled"><i className="fas fa-ban"></i>Cancelled</span>;
      case "EXPIRED":
        return <span className="admin-sr-badge badge-expired"><i className="fas fa-calendar-times"></i>Expired</span>;
      default:
        return <span className="admin-sr-badge">{status}</span>;
    }
  };

  return (
    <>
      {cancelMutation.isPending && <SpinnerOverlay isLoading={true} />}

      <div className="app-content">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: "2rem" }}>
              Service Requests Management
            </h1>
            <p className="text-secondary text-sm mb-0">
              Total platform requests submitted by customers across categories.
            </p>
          </div>
        </div>

        <div className="admin-filter-bar">
          <div className="admin-search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by request title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="admin-filters-group">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="admin-select"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>

            <button type="button" className="btn btn-secondary text-xs py-2" onClick={handleReset}>
              <i className="fas fa-undo mr-1"></i>Reset
            </button>
          </div>
        </div>

        <div className="admin-table-card" style={{ position: "relative", overflow: "hidden" }}>
          {getRequests.isPending && <div className="skeleton-progress-bar" />}
          <div className="admin-table-header">
            <div className="text-sm font-semibold text-text">
              {getRequests.isPending && (
                <span className="skeleton-loading-label">
                  <span className="skeleton-dot" />
                  <span className="skeleton-dot" />
                  <span className="skeleton-dot" />
                  Fetching records
                </span>
              )}
            </div>
            <div className="text-xs text-muted">
              <i className="fas fa-shield-alt mr-1 text-primary"></i>Admin Action Logging Active
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "24%" }}>Request Details</th>
                  <th style={{ width: "18%" }}>Customer</th>
                  <th style={{ width: "16%" }}>Budget & Timing</th>
                  <th style={{ width: "14%" }}>Location</th>
                  <th style={{ width: "12%" }}>Status</th>
                  <th style={{ width: "8%" }}>Posted</th>
                  <th className="text-right" style={{ width: "8%" }}>Governance</th>
                </tr>
              </thead>
              <tbody>
                {getRequests.isPending ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`sr-skel-${i}`} className="skeleton-row" style={{ opacity: 1 - i * 0.08 }}>
                      <td className="skeleton-shimmer-cell">
                        <Skeleton width={160} height={15} borderRadius={6} />
                        <div style={{ marginTop: 4 }}>
                          <Skeleton width={90} height={12} borderRadius={4} />
                        </div>
                      </td>
                      <td className="skeleton-shimmer-cell">
                        <Skeleton width={110} height={14} borderRadius={6} />
                        <div style={{ marginTop: 4 }}>
                          <Skeleton width={130} height={12} borderRadius={4} />
                        </div>
                      </td>
                      <td className="skeleton-shimmer-cell">
                        <Skeleton width={80} height={14} borderRadius={6} />
                        <div style={{ marginTop: 4 }}>
                          <Skeleton width={60} height={12} borderRadius={4} />
                        </div>
                      </td>
                      <td className="skeleton-shimmer-cell">
                        <Skeleton width={100} height={14} borderRadius={6} />
                      </td>
                      <td className="skeleton-shimmer-cell">
                        <Skeleton width={75} height={24} borderRadius={20} />
                      </td>
                      <td className="skeleton-shimmer-cell">
                        <Skeleton width={70} height={14} borderRadius={6} />
                      </td>
                      <td className="skeleton-shimmer-cell text-right">
                        <Skeleton width={50} height={28} borderRadius={6} />
                      </td>
                    </tr>
                  ))
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div className="font-semibold text-text">{req.title}</div>
                        {req.category_name && (
                          <span className="admin-sr-category-pill">
                            <i className="fas fa-tag mr-1 text-primary"></i>
                            {req.category_name}
                            {req.subservice_name ? ` · ${req.subservice_name}` : ""}
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold text-text">{req.customer_details?.name || "Customer"}</div>
                        <div className="text-xs text-muted">{req.customer_details?.email || "No email"}</div>
                      </td>
                      <td>
                        <div className="font-semibold text-text">
                          {req.budget_type === "FIXED" && req.budget_amount
                            ? `₹${Number(req.budget_amount).toLocaleString()}`
                            : "Open to Bids"}
                        </div>
                        <div className="text-xs text-muted">
                          <i className="far fa-clock mr-1"></i>
                          {req.urgency.replace("_", " ")}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-text">
                          {req.address_details?.city || req.address_details?.area || "Location specified"}
                        </div>
                        <div className="text-xs text-muted">
                          {req.address_details?.landmark || ""}
                        </div>
                      </td>
                      <td>{getStatusBadge(req.status)}</td>
                      <td className="text-xs text-muted">
                        {new Date(req.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            className="btn-icon"
                            title="View Details"
                            onClick={() => setSelectedRequest(req)}
                          >
                            <i className="fas fa-eye text-primary"></i>
                          </button>

                          {req.status !== "CANCELLED" && req.status !== "COMPLETED" && (
                            <button
                              type="button"
                              className="btn-icon"
                              title="Cancel Request"
                              onClick={() => setRequestToCancel({ id: req.id, title: req.title })}
                            >
                              <i className="fas fa-ban text-danger"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="admin-empty-table-cell">
                      <AdminNoData />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <div className={`admin-modal-overlay ${selectedRequest ? "active" : ""}`}>
        <div className="admin-modal" style={{ maxWidth: "680px" }}>
          <div className="admin-modal-header">
            <div className="flex items-center gap-2">
              <i className="fas fa-file-invoice text-primary"></i>
              <h3 className="h6 mb-0">Service Request Dossier</h3>
            </div>
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setSelectedRequest(null)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {selectedRequest && (
            <div className="admin-sr-modal-body">
              <div className="admin-sr-section">
                <div className="admin-sr-section-title">
                  <i className="fas fa-info-circle text-primary"></i>
                  <span>Requirement Details</span>
                </div>
                <div className="admin-sr-grid-2">
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Title</span>
                    <span className="admin-sr-info-val">{selectedRequest.title}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Current Status</span>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Category</span>
                    <span className="admin-sr-info-val">{selectedRequest.category_name || "N/A"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Subservice</span>
                    <span className="admin-sr-info-val">{selectedRequest.subservice_name || "General"}</span>
                  </div>
                </div>
                <div className="admin-sr-info-item mt-3">
                  <span className="admin-sr-info-label">Description</span>
                  <p className="text-sm text-text mb-0 mt-1" style={{ whiteSpace: "pre-wrap" }}>
                    {selectedRequest.description}
                  </p>
                </div>
              </div>

              <div className="admin-sr-section">
                <div className="admin-sr-section-title">
                  <i className="fas fa-user text-primary"></i>
                  <span>Customer Profile</span>
                </div>
                <div className="admin-sr-grid-2">
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Full Name</span>
                    <span className="admin-sr-info-val">{selectedRequest.customer_details?.name || "N/A"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Email</span>
                    <span className="admin-sr-info-val">{selectedRequest.customer_details?.email || "N/A"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Phone</span>
                    <span className="admin-sr-info-val">{selectedRequest.customer_details?.phone || "Not provided"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Matched Providers</span>
                    <span className="admin-sr-info-val">{selectedRequest.matched_providers_count ?? 0}</span>
                  </div>
                </div>
              </div>

              <div className="admin-sr-section">
                <div className="admin-sr-section-title">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                  <span>Location & Schedule</span>
                </div>
                <div className="admin-sr-grid-2">
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Area / Locality</span>
                    <span className="admin-sr-info-val">{selectedRequest.address_details?.area || "N/A"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">City</span>
                    <span className="admin-sr-info-val">{selectedRequest.address_details?.city || "N/A"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Landmark</span>
                    <span className="admin-sr-info-val">{selectedRequest.address_details?.landmark || "N/A"}</span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Urgency</span>
                    <span className="admin-sr-info-val">{selectedRequest.urgency.replace("_", " ")}</span>
                  </div>
                  {selectedRequest.specific_date && (
                    <div className="admin-sr-info-item">
                      <span className="admin-sr-info-label">Scheduled Date</span>
                      <span className="admin-sr-info-val">
                        {new Date(selectedRequest.specific_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Preferred Time</span>
                    <span className="admin-sr-info-val">
                      {selectedRequest.available_time_from} - {selectedRequest.available_time_to}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-sr-section">
                <div className="admin-sr-section-title">
                  <i className="fas fa-wallet text-primary"></i>
                  <span>Budget Terms</span>
                </div>
                <div className="admin-sr-grid-2">
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Budget Model</span>
                    <span className="admin-sr-info-val">
                      {selectedRequest.budget_type === "FIXED" ? "Fixed Budget" : "Open for Bids"}
                    </span>
                  </div>
                  <div className="admin-sr-info-item">
                    <span className="admin-sr-info-label">Amount</span>
                    <span className="admin-sr-info-val">
                      {selectedRequest.budget_type === "FIXED" && selectedRequest.budget_amount
                        ? `₹${Number(selectedRequest.budget_amount).toLocaleString()}`
                        : "Competitive Quotations"}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="admin-sr-section">
                  <div className="admin-sr-section-title">
                    <i className="fas fa-images text-primary"></i>
                    <span>Attached Photos ({selectedRequest.images.length})</span>
                  </div>
                  <div className="admin-sr-photos-grid">
                    {selectedRequest.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.image_key}
                        alt="Attachment"
                        className="admin-sr-photo-thumb"
                        onClick={() => setLightboxPhoto(img.image_key)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {lightboxPhoto && (
        <div className="admin-sr-lightbox" onClick={() => setLightboxPhoto(null)}>
          <img src={lightboxPhoto} alt="Full view" className="admin-sr-lightbox-img" />
          <button
            type="button"
            className="admin-sr-lightbox-close"
            onClick={() => setLightboxPhoto(null)}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(requestToCancel)}
        title="Cancel Service Request"
        message={`Are you sure you want to cancel the request "${requestToCancel?.title}"? This administrative action will mark it cancelled across customer and provider views.`}
        confirmText="Confirm Cancellation"
        cancelText="Keep Active"
        isDanger={true}
        isLoading={cancelMutation.isPending}
        onConfirm={confirmCancel}
        onCancel={() => setRequestToCancel(null)}
      />
    </>
  );
}
