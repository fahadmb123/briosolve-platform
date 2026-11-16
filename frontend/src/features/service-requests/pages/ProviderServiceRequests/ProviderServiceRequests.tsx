import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "URGENT">("NEWEST");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<CustomerServiceRequestItem | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const getRequestsMutation = useGetProviderServiceRequests();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRequests = useCallback((pageNum: number, isReset: boolean = false) => {
    getRequestsMutation.mutate(
      {
        page: pageNum,
        limit,
        search: debouncedSearch.trim() || undefined,
        urgency: urgencyFilter !== "ALL" ? urgencyFilter : undefined,
        sortBy,
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            const newItems = res.data.requests || [];
            setRequests((prev) => {
              if (isReset || pageNum === 1) return newItems;
              const existingIds = new Set(prev.map((r) => r.id));
              const uniqueNewItems = newItems.filter((r) => !existingIds.has(r.id));
              return [...prev, ...uniqueNewItems];
            });
            setTotalPages(res.data.totalPages || 0);
            setHasMore(pageNum < (res.data.totalPages || 0));
          }
        },
        onError: () => {
          toast.error("Failed to load service requests");
        },
      }
    );
  }, [limit, debouncedSearch, urgencyFilter, sortBy]);

  useEffect(() => {
    if (!isVerified) return;
    setPage(1);
    fetchRequests(1, true);
  }, [isVerified, debouncedSearch, urgencyFilter, sortBy]);

  useEffect(() => {
    if (page > 1) {
      fetchRequests(page, false);
    }
  }, [page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || getRequestsMutation.isPending) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !getRequestsMutation.isPending) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, getRequestsMutation.isPending]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail?.title_code === "SERVICE_REQUEST_CANCELLED" ||
        customEvent.detail?.title_code === "NEW_SERVICE_REQUEST"
      ) {
        setPage(1);
        fetchRequests(1, true);
      }
    };

    window.addEventListener("app:notification", handleNotification);
    return () => {
      window.removeEventListener("app:notification", handleNotification);
    };
  }, [fetchRequests]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const handleUrgencyChange = (urgency: string) => {
    setUrgencyFilter(urgency);
  };

  const handleSortChange = (sort: "NEWEST" | "URGENT") => {
    setSortBy(sort);
  };

  const currentSelectedRequest = useMemo(() => {
    if (!selectedRequest) return null;
    return requests.find((r) => r.id === selectedRequest.id) || selectedRequest;
  }, [selectedRequest, requests]);

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
            onClick={() => {
              setPage(1);
              fetchRequests(1, true);
            }}
            disabled={getRequestsMutation.isPending}
          >
            <i className={`fas fa-sync-alt ${getRequestsMutation.isPending && page === 1 ? "fa-spin" : ""}`}></i>
            <span>{getRequestsMutation.isPending && page === 1 ? "Refreshing..." : "Refresh Leads"}</span>
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
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
              className="provreq-sort-select"
            >
              <option value="NEWEST">Newest First</option>
              <option value="URGENT">Most Urgent First</option>
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
          <img
            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
            alt="No data found"
            className="provreq-empty-img"
          />
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
            {getRequestsMutation.isPending && page > 1 &&
              Array.from({ length: 2 }).map((_, idx) => (
                <ServiceRequestCardSkeleton key={`skeleton-${idx}`} variant="provider" />
              ))}
          </div>

          {hasMore && <div ref={sentinelRef} className="provreq-sentinel" />}

          {!hasMore && requests.length > 0 && totalPages > 1 && (
            <div className="provreq-end-message">
              <span>You've reached the end of available service requests</span>
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
