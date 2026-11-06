import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetProviderServiceRequests } from "../../hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { ProviderRequestCard, ProviderRequestDetailsModal } from "../../components/provider-requests";
import { ServiceRequestCardSkeleton } from "../../components/ServiceRequestCardSkeleton";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { VerificationRequiredCard } from "../../../../shared/components/ui/VerificationRequiredCard/VerificationRequiredCard";
import "./ProviderServiceRequests.css";

export default function ProviderServiceRequests() {
  const navigate = useNavigate();
  const verifications = useAuthStore((state) => state.verifications);
  const isVerified =
    verifications !== null && Object.values(verifications).every(Boolean);
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [budgetFilter, setBudgetFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "BUDGET_HIGH" | "URGENT">("NEWEST");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [selectedRequest, setSelectedRequest] = useState<CustomerServiceRequestItem | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const getRequestsMutation = useGetProviderServiceRequests();

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
        urgency: urgencyFilter !== "ALL" ? urgencyFilter : undefined,
        budgetType: budgetFilter !== "ALL" ? budgetFilter : undefined,
        sortBy,
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
        },
      }
    );
  }, [page, limit, debouncedSearch, urgencyFilter, budgetFilter, sortBy]);

  useEffect(() => {
    if (!isVerified) return;
    fetchRequests();

    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail?.title_code === "SERVICE_REQUEST_CANCELLED" ||
        customEvent.detail?.title_code === "NEW_SERVICE_REQUEST"
      ) {
        fetchRequests();
      }
    };

    window.addEventListener("app:notification", handleNotification);
    return () => {
      window.removeEventListener("app:notification", handleNotification);
    };
  }, [isVerified, fetchRequests]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleUrgencyChange = (urgency: string) => {
    setUrgencyFilter(urgency);
    setPage(1);
  };

  const handleBudgetChange = (budget: string) => {
    setBudgetFilter(budget);
    setPage(1);
  };

  const handleSortChange = (sort: "NEWEST" | "BUDGET_HIGH" | "URGENT") => {
    setSortBy(sort);
    setPage(1);
  };

  const currentSelectedRequest = useMemo(() => {
    if (!selectedRequest) return null;
    return requests.find((r) => r.id === selectedRequest.id) || selectedRequest;
  }, [selectedRequest, requests]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  const handleQuoteClick = (req: CustomerServiceRequestItem) => {
    setSelectedRequest(req);
  };

  const handleChatClick = (req: CustomerServiceRequestItem) => {
    if (!req.customer_id) {
      toast.error("Customer details not available for this request");
      return;
    }

    const addressStr = req.address_details
      ? `${req.address_details.area || ""}, ${req.address_details.city || ""}`.trim().replace(/^,|,$/g, "")
      : "Service Location";

    navigate(`/provider/messages?recipientId=${req.customer_id}`, {
      state: {
        recipientId: req.customer_id,
        recipientName: "Customer",
        requestTitle: req.title,
        requestId: req.id,
        categoryName: req.category_name || "Services",
        urgency: req.urgency,
        budgetType: req.budget_type,
        budgetAmount: req.budget_amount || undefined,
        location: addressStr || "Service Location",
      },
    });
  };

  if (!isVerified) {
    return (
      <div className="provreq-page-container">
        <VerificationRequiredCard
          title="Complete Verification to View Service Requests"
          description="To maintain marketplace trust, protect customer details, and unlock lead opportunities, please complete your provider credentials and identity verification."
        />
      </div>
    );
  }

  return (
    <div className="provreq-page-container">
      <div className="provreq-hero-banner">
        <div className="provreq-hero-left">
          <span className="provreq-page-badge">
            <i className="fas fa-radar"></i>
            <span>Marketplace Leads</span>
          </span>
          <h1 className="provreq-hero-title">Service Request Opportunities</h1>
          <p className="provreq-hero-subtext">
            Browse and respond to customer service requests matched to your skills and operating radius
          </p>
        </div>

        <div className="provreq-hero-right">
          <button
            type="button"
            className="provreq-btn-refresh"
            onClick={fetchRequests}
            disabled={getRequestsMutation.isPending}
          >
            <i className={`fas fa-sync-alt ${getRequestsMutation.isPending ? "fa-spin" : ""}`}></i>
            <span>{getRequestsMutation.isPending ? "Refreshing..." : "Refresh Leads"}</span>
          </button>
        </div>
      </div>

      <div className="provreq-filter-bar">
        <div className="provreq-filter-top-row">
          <div className="provreq-search-box">
            <i className="fas fa-search provreq-search-icon"></i>
            <input
              type="text"
              placeholder="Search by title, location, category..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="provreq-search-input"
            />
          </div>

          <div className="provreq-filter-controls">
            <select
              value={budgetFilter}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className="provreq-sort-select"
            >
              <option value="ALL">All Budget Types</option>
              <option value="FIXED">Fixed Budget Only</option>
              <option value="OPEN_BID">Open to Bids Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="provreq-sort-select"
            >
              <option value="NEWEST">Newest First</option>
              <option value="URGENT">Most Urgent First</option>
              <option value="BUDGET_HIGH">Highest Budget</option>
            </select>
          </div>
        </div>

        <div className="provreq-filter-pills-row">
          {[
            { id: "ALL", label: "All Opportunities" },
            { id: "TODAY", label: "Needed Today" },
            { id: "THIS_WEEK", label: "This Week" },
            { id: "SPECIFIC_DATE", label: "Specific Date" },
            { id: "FLEXIBLE", label: "Flexible Timing" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              className={`provreq-filter-pill ${urgencyFilter === pill.id ? "active" : ""}`}
              onClick={() => handleUrgencyChange(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {getRequestsMutation.isPending && requests.length === 0 ? (
        <div className="provreq-cards-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <ServiceRequestCardSkeleton key={idx} variant="provider" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="provreq-empty-state">
          <div className="provreq-empty-icon">
            <i className="fas fa-inbox"></i>
          </div>
          <h3>No Matching Service Requests Found</h3>
          <p>
            Try adjusting your search terms or filter selections to view more opportunities.
          </p>
        </div>
      ) : (
        <>
          <div className="provreq-cards-grid">
            {requests.map((request) => (
              <ProviderRequestCard
                key={request.id}
                request={request}
                onViewDetails={setSelectedRequest}
                onSelectPhoto={setLightboxPhoto}
                onQuote={handleQuoteClick}
                onChat={handleChatClick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="provreq-pagination-row">
              <div className="provreq-pagination-controls">
                <button
                  type="button"
                  className="provreq-page-btn"
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
                    className={`provreq-page-btn ${page === pageNumber ? "active" : ""}`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  className="provreq-page-btn"
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

      <ProviderRequestDetailsModal
        request={currentSelectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        onQuote={handleQuoteClick}
        onSelectPhoto={setLightboxPhoto}
        onChat={handleChatClick}
      />

      {lightboxPhoto && (
        <div className="provreq-lightbox-overlay" onClick={() => setLightboxPhoto(null)}>
          <div className="provreq-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxPhoto} alt="Full view" className="provreq-lightbox-img" />
            <button
              type="button"
              className="provreq-lightbox-close"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close preview"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
