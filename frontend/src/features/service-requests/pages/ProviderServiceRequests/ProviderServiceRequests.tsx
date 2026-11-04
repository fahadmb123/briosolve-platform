import { useEffect, useState, useMemo } from "react";
import { useGetProviderServiceRequests } from "../../hooks/useServiceRequestMutations";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { ProviderRequestCard, ProviderRequestDetailsModal } from "./components";
import "./ProviderServiceRequests.css";

export default function ProviderServiceRequests() {
  const [requests, setRequests] = useState<CustomerServiceRequestItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("ALL");
  const [budgetFilter, setBudgetFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "BUDGET_HIGH" | "URGENT">("NEWEST");

  const [selectedRequest, setSelectedRequest] = useState<CustomerServiceRequestItem | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const getRequestsMutation = useGetProviderServiceRequests();

  const fetchRequests = () => {
    getRequestsMutation.mutate(undefined, {
      onSuccess: (res) => {
        const data = (res.data || []) as CustomerServiceRequestItem[];
        setRequests(data);
      },
    });
  };

  useEffect(() => {
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
  }, []);

  const currentSelectedRequest = useMemo(() => {
    if (!selectedRequest) return null;
    return requests.find((r) => r.id === selectedRequest.id) || selectedRequest;
  }, [selectedRequest, requests]);

  const stats = useMemo(() => {
    const total = requests.length;
    const urgent = requests.filter((r) => r.urgency === "TODAY" || r.urgency === "THIS_WEEK").length;
    const fixed = requests.filter((r) => r.budget_type === "FIXED").length;
    const openBids = requests.filter((r) => r.budget_type === "OPEN_BID").length;
    return { total, urgent, fixed, openBids };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = req.title.toLowerCase().includes(q);
          const matchDesc = req.description.toLowerCase().includes(q);
          const matchCat = (req.category_name || "").toLowerCase().includes(q);
          const matchArea = (req.address_details?.area || "").toLowerCase().includes(q);
          const matchCity = (req.address_details?.city || "").toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchArea && !matchCity) {
            return false;
          }
        }

        if (urgencyFilter !== "ALL" && req.urgency !== urgencyFilter) {
          return false;
        }

        if (budgetFilter !== "ALL" && req.budget_type !== budgetFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "BUDGET_HIGH") {
          const aAmt = a.budget_amount ?? 0;
          const bAmt = b.budget_amount ?? 0;
          return bAmt - aAmt;
        }
        if (sortBy === "URGENT") {
          const urgencyOrder = { TODAY: 1, THIS_WEEK: 2, SPECIFIC_DATE: 3, FLEXIBLE: 4 };
          return (urgencyOrder[a.urgency] ?? 5) - (urgencyOrder[b.urgency] ?? 5);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [requests, searchQuery, urgencyFilter, budgetFilter, sortBy]);

  const handleQuoteClick = (req: CustomerServiceRequestItem) => {
    setSelectedRequest(req);
  };

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

      <div className="provreq-stats-bar">
        <div className="provreq-stat-card">
          <div className="provreq-stat-top">
            <span className="provreq-stat-dot matched"></span>
            <span className="provreq-stat-name">Matched Leads</span>
          </div>
          <span className="provreq-stat-number">{stats.total}</span>
          <span className="provreq-stat-hint">In your service area</span>
        </div>

        <div className="provreq-stat-card">
          <div className="provreq-stat-top">
            <span className="provreq-stat-dot urgent"></span>
            <span className="provreq-stat-name">Urgent / This Week</span>
          </div>
          <span className="provreq-stat-number">{stats.urgent}</span>
          <span className="provreq-stat-hint">Immediate dispatch requests</span>
        </div>

        <div className="provreq-stat-card">
          <div className="provreq-stat-top">
            <span className="provreq-stat-dot fixed"></span>
            <span className="provreq-stat-name">Fixed Budget</span>
          </div>
          <span className="provreq-stat-number">{stats.fixed}</span>
          <span className="provreq-stat-hint">Pre-set customer budgets</span>
        </div>

        <div className="provreq-stat-card">
          <div className="provreq-stat-top">
            <span className="provreq-stat-dot bids"></span>
            <span className="provreq-stat-name">Open for Bids</span>
          </div>
          <span className="provreq-stat-number">{stats.openBids}</span>
          <span className="provreq-stat-hint">Competitive quotation scope</span>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="provreq-search-input"
            />
          </div>

          <div className="provreq-filter-controls">
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="provreq-sort-select"
            >
              <option value="ALL">All Budget Types</option>
              <option value="FIXED">Fixed Budget Only</option>
              <option value="OPEN_BID">Open to Bids Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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
              onClick={() => setUrgencyFilter(pill.id)}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {getRequestsMutation.isPending && requests.length === 0 ? (
        <div className="provreq-empty-state">
          <div className="provreq-empty-icon">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h3>Scanning Marketplace Opportunities...</h3>
          <p>Matching customer requests with your verified skill categories and radius</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="provreq-empty-state">
          <div className="provreq-empty-icon">
            <i className="fas fa-inbox"></i>
          </div>
          <h3>No Matching Service Requests Found</h3>
          <p>
            {requests.length === 0
              ? "New service requests posted by local customers within your radius will appear here."
              : "Try adjusting your search terms or filter selections to view more opportunities."}
          </p>
        </div>
      ) : (
        <div className="provreq-cards-grid">
          {filteredRequests.map((request) => (
            <ProviderRequestCard
              key={request.id}
              request={request}
              onViewDetails={setSelectedRequest}
              onSelectPhoto={setLightboxPhoto}
              onQuote={handleQuoteClick}
            />
          ))}
        </div>
      )}

      <ProviderRequestDetailsModal
        request={currentSelectedRequest}
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        onQuote={handleQuoteClick}
        onSelectPhoto={setLightboxPhoto}
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
