import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyQuotations } from "../../hooks/useQuotationMutations";
import type { ProviderQuotationItem } from "../../types/quotation.types";
import QuotationCard from "../../components/QuotationCard/QuotationCard";
import { QuotationDetailsModal } from "../../components/QuotationDetailsModal";
import "./MyQuotations.css";

const STATUS_TABS: { id: string; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "ACCEPTED", label: "Accepted" },
  { id: "REJECTED", label: "Rejected" },
  { id: "EXPIRED", label: "Expired" },
  { id: "WITHDRAWN", label: "Withdrawn" }
];

export default function MyQuotations() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<ProviderQuotationItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [selectedQuotation, setSelectedQuotation] = useState<ProviderQuotationItem | null>(null);

  const { data: quotationsRes, isLoading: isQueryLoading, isFetching, refetch } = useGetMyQuotations({
    page,
    limit,
    status: activeStatus,
    sortBy
  });

  useEffect(() => {
    if (quotationsRes?.data) {
      const newItems = quotationsRes.data.quotations || [];
      setQuotations((prev) => {
        if (page === 1) return newItems;
        const existingIds = new Set(prev.map((q) => q.id));
        return [...prev, ...newItems.filter((q) => !existingIds.has(q.id))];
      });
      setCounts(quotationsRes.data.counts || {});
      setTotalPages(quotationsRes.data.totalPages || 0);
      setHasMore(page < (quotationsRes.data.totalPages || 0));
    }
  }, [quotationsRes, page]);

  useEffect(() => {
    setPage(1);
  }, [activeStatus, sortBy]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const handleViewRequest = (serviceRequestId: string) => {
    navigate(`/provider/service-requests/${serviceRequestId}`);
  };

  const handleEditQuotation = (quotation: ProviderQuotationItem) => {
    navigate(`/provider/service-requests/${quotation.serviceRequestId}/quote`, {
      state: {
        quotation,
        isEditing: true
      }
    });
  };

  const isInitialLoading = isQueryLoading && quotations.length === 0;

  return (
    <div className="myquote-page-container">
      <div className="myquote-hero-banner">
        <div className="myquote-hero-left">
          <div className="myquote-title-badge-row">
            <h1 className="myquote-hero-title">My Quotations</h1>
            <span className="myquote-portal-badge">Provider Portal</span>
          </div>
          <p className="myquote-hero-subtext">
            Track all the quotations you have submitted and monitor their status.
          </p>
        </div>

        <div className="myquote-hero-right">
          <button
            type="button"
            className="myquote-btn-refresh"
            onClick={() => {
              setPage(1);
              refetch();
            }}
            disabled={isFetching}
          >
            <i className={`fas fa-sync-alt ${isFetching && page === 1 ? "fa-spin" : ""}`} />
            <span>{isFetching && page === 1 ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      <div className="myquote-filter-bar-container">
        <div className="myquote-status-tabs-list" role="tablist">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`myquote-status-tab-btn ${activeStatus === tab.id ? "active" : ""}`}
              onClick={() => setActiveStatus(tab.id)}
            >
              <span className="myquote-tab-label">{tab.label}</span>
              {counts[tab.id] !== undefined && counts[tab.id] > 0 && (
                <span className={`myquote-tab-bubble ${counts[tab.id] > 0 ? "has-items" : ""}`}>
                  {counts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="myquote-sort-wrapper">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="myquote-sort-select"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
          <i className="fas fa-chevron-down myquote-sort-chevron" />
        </div>
      </div>

      {isInitialLoading ? (
        <div className="myquote-skeleton-stack">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="myquote-skeleton-row-card">
              <div className="myquote-skeleton-block myquote-sk-avatar" />
              <div className="myquote-sk-center">
                <div className="myquote-skeleton-block myquote-sk-crumbs" />
                <div className="myquote-skeleton-block myquote-sk-title" />
                <div className="myquote-skeleton-block myquote-sk-desc" />
                <div className="myquote-sk-meta-row">
                  <div className="myquote-skeleton-block myquote-sk-pill" />
                  <div className="myquote-skeleton-block myquote-sk-pill" />
                </div>
              </div>
              <div className="myquote-sk-right">
                <div className="myquote-sk-badge-row">
                  <div className="myquote-skeleton-block myquote-sk-status-badge" />
                  <div className="myquote-skeleton-block myquote-sk-price" />
                </div>
                <div className="myquote-sk-actions">
                  <div className="myquote-skeleton-block myquote-sk-btn" />
                  <div className="myquote-skeleton-block myquote-sk-btn" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : quotations.length === 0 ? (
        <div className="myquote-empty-state">
          <img
            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
            alt="No quotations found"
            className="myquote-empty-img"
          />
          <h3>No Quotations Found</h3>
          <p>
            {activeStatus === "ALL"
              ? "You haven't submitted any quotations yet. Browse service requests and start sending proposals."
              : `No ${activeStatus.toLowerCase()} quotations found.`}
          </p>
          <button
            type="button"
            className="myquote-btn-browse"
            onClick={() => navigate("/provider/service-requests")}
          >
            <i className="fas fa-search" />
            <span>Browse Service Requests</span>
          </button>
        </div>
      ) : (
        <>
          <div className="myquote-cards-stack">
            {quotations.map((quotation) => (
              <QuotationCard
                key={quotation.id}
                quotation={quotation}
                onViewDetails={setSelectedQuotation}
                onViewRequest={handleViewRequest}
                onEdit={handleEditQuotation}
              />
            ))}
            {isFetching && page > 1 &&
              Array.from({ length: 2 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="myquote-skeleton-row-card">
                  <div className="myquote-skeleton-block myquote-sk-avatar" />
                  <div className="myquote-sk-center">
                    <div className="myquote-skeleton-block myquote-sk-crumbs" />
                    <div className="myquote-skeleton-block myquote-sk-title" />
                  </div>
                  <div className="myquote-sk-right">
                    <div className="myquote-sk-actions">
                      <div className="myquote-skeleton-block myquote-sk-btn" />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {hasMore && <div ref={sentinelRef} className="myquote-sentinel" />}

          {!hasMore && quotations.length > 0 && totalPages > 1 && (
            <div className="myquote-end-message">
              <span>All quotations loaded</span>
            </div>
          )}
        </>
      )}

      <QuotationDetailsModal
        quotation={selectedQuotation}
        isOpen={Boolean(selectedQuotation)}
        onClose={() => setSelectedQuotation(null)}
        onViewRequest={handleViewRequest}
        onEdit={handleEditQuotation}
      />
    </div>
  );
}
