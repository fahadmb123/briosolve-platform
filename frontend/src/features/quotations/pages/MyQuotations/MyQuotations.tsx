import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetMyQuotations } from "../../hooks/useQuotationMutations";
import type { ProviderQuotationItem } from "../../types/quotation.types";
import QuotationCard from "../../components/QuotationCard/QuotationCard";
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
  const isLoadingMoreRef = useRef<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const getMyQuotationsMutation = useGetMyQuotations();

  const fetchQuotations = useCallback((pageNum: number, isReset: boolean = false) => {
    if (pageNum > 1) {
      isLoadingMoreRef.current = true;
    }
    getMyQuotationsMutation.mutate(
      {
        page: pageNum,
        limit,
        status: activeStatus,
        sortBy
      },
      {
        onSuccess: (res) => {
          isLoadingMoreRef.current = false;
          if (res.data) {
            const newItems = res.data.quotations || [];
            setQuotations((prev) => {
              if (isReset || pageNum === 1) return newItems;
              const existingIds = new Set(prev.map((q) => q.id));
              return [...prev, ...newItems.filter((q) => !existingIds.has(q.id))];
            });
            setCounts(res.data.counts || {});
            setTotalPages(res.data.totalPages || 0);
            setHasMore(pageNum < (res.data.totalPages || 0));
          }
        },
        onError: () => {
          isLoadingMoreRef.current = false;
          toast.error("Failed to load quotations");
        }
      }
    );
  }, [limit, activeStatus, sortBy]);

  useEffect(() => {
    setPage(1);
    fetchQuotations(1, true);
  }, [activeStatus, sortBy]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMoreRef.current && !getMyQuotationsMutation.isPending) {
          setPage((prev) => {
            const next = prev + 1;
            fetchQuotations(next, false);
            return next;
          });
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, fetchQuotations, getMyQuotationsMutation.isPending]);

  const handleViewRequest = (serviceRequestId: string) => {
    navigate(`/provider/service-requests`, {
      state: { highlightRequestId: serviceRequestId }
    });
  };

  const isInitialLoading = getMyQuotationsMutation.isPending && quotations.length === 0;

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
              fetchQuotations(1, true);
            }}
            disabled={getMyQuotationsMutation.isPending}
          >
            <i className={`fas fa-sync-alt ${getMyQuotationsMutation.isPending && page === 1 ? "fa-spin" : ""}`} />
            <span>{getMyQuotationsMutation.isPending && page === 1 ? "Refreshing..." : "Refresh"}</span>
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
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="myquote-skeleton-card">
              <div className="myquote-skeleton-row">
                <div className="myquote-skeleton-block myquote-sk-amount" />
                <div className="myquote-skeleton-block myquote-sk-type" />
                <div className="myquote-skeleton-block myquote-sk-badge" />
              </div>
              <div className="myquote-skeleton-block myquote-sk-title" />
              <div className="myquote-skeleton-block myquote-sk-desc" />
              <div className="myquote-skeleton-block myquote-sk-desc myquote-sk-short" />
              <div className="myquote-skeleton-row myquote-sk-meta-row">
                <div className="myquote-skeleton-block myquote-sk-meta" />
                <div className="myquote-skeleton-block myquote-sk-meta" />
              </div>
              <div className="myquote-skeleton-row myquote-sk-tags-row">
                <div className="myquote-skeleton-block myquote-sk-tag" />
                <div className="myquote-skeleton-block myquote-sk-tag" />
                <div className="myquote-skeleton-block myquote-sk-tag" />
              </div>
              <div className="myquote-skeleton-footer">
                <div className="myquote-skeleton-block myquote-sk-btn" />
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
          <div className="myquote-cards-grid">
            {quotations.map((quotation) => (
              <QuotationCard
                key={quotation.id}
                quotation={quotation}
                onViewRequest={handleViewRequest}
              />
            ))}
            {getMyQuotationsMutation.isPending && page > 1 &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="myquote-skeleton-card">
                  <div className="myquote-skeleton-row">
                    <div className="myquote-skeleton-block myquote-sk-amount" />
                    <div className="myquote-skeleton-block myquote-sk-type" />
                    <div className="myquote-skeleton-block myquote-sk-badge" />
                  </div>
                  <div className="myquote-skeleton-block myquote-sk-title" />
                  <div className="myquote-skeleton-block myquote-sk-desc" />
                  <div className="myquote-skeleton-footer">
                    <div className="myquote-skeleton-block myquote-sk-btn" />
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
    </div>
  );
}
