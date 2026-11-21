import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetCustomerBookings, useGetProviderBookings } from "../../../bookings/hooks/useBookingMutations";
import type { SupportTicket, TicketCategory, TicketPriority } from "../../types/support.types";
import "./SupportTicketsPage.css";

interface CategoryOption {
  value: TicketCategory;
  label: string;
  icon: string;
  desc: string;
  badge?: string;
}

const CUSTOMER_CATEGORIES: CategoryOption[] = [
  {
    value: "PROVIDER_NO_SHOW",
    label: "Technician No-Show / Absent",
    icon: "fas fa-user-clock",
    desc: "Technician missed the scheduled arrival time or is completely unresponsive.",
    badge: "Escrow Frozen"
  },
  {
    value: "POOR_WORKMANSHIP",
    label: "Substandard / Incomplete Work",
    icon: "fas fa-tools",
    desc: "Repairs were left unfinished, done unsafely, or caused secondary property damage.",
    badge: "Inspection Required"
  },
  {
    value: "UNAUTHORIZED_CHARGES",
    label: "Unapproved Cash Demand",
    icon: "fas fa-hand-holding-usd",
    desc: "Provider demanded unagreed offline cash outside platform escrow.",
    badge: "Compliance Risk"
  },
  {
    value: "PAYMENT_REFUND",
    label: "Escrow / Refund Discrepancy",
    icon: "fas fa-file-invoice-dollar",
    desc: "Dispute regarding advance refund, cancellation fees, or wallet deduction.",
    badge: "Financial Review"
  },
  {
    value: "SAFETY_CONDUCT",
    label: "Safety, Conduct & Harassment",
    icon: "fas fa-shield-alt",
    desc: "Hostile behavior, lack of safety compliance, or breach of trust.",
    badge: "High Priority"
  },
  {
    value: "GENERAL_INQUIRY",
    label: "General Platform Support",
    icon: "fas fa-question-circle",
    desc: "Account inquiries, invoice requests, or platform navigation guidance."
  }
];

const PROVIDER_CATEGORIES: CategoryOption[] = [
  {
    value: "CUSTOMER_ABSENT",
    label: "Customer Absent at Location",
    icon: "fas fa-house-user",
    desc: "Arrived at scheduled address, but customer is absent and unreachable by call or chat.",
    badge: "Visit Protected"
  },
  {
    value: "PAYMENT_DISPUTE",
    label: "Customer Refusing Balance Payment",
    icon: "fas fa-receipt",
    desc: "Service fully delivered, but client refuses to approve or pay the remaining balance.",
    badge: "Escrow Claim"
  },
  {
    value: "SCOPE_DISPUTE",
    label: "Demanding Unpaid Extra Tasks",
    icon: "fas fa-layer-group",
    desc: "Client insists on additional tasks beyond the quotation without agreeing to add-on costs.",
    badge: "Scope Mismatch"
  },
  {
    value: "SAFETY_PREMISES",
    label: "Unsafe / Inaccessible Premises",
    icon: "fas fa-exclamation-triangle",
    desc: "Job site has severe structural hazards, hostile environment, or blocked entry.",
    badge: "Immediate Halt"
  },
  {
    value: "GENERAL_INQUIRY",
    label: "Payout & Wallet Support",
    icon: "fas fa-wallet",
    desc: "Commission deduction inquiries, bank payout schedule, or account support."
  }
];

const INITIAL_MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tk-9041",
    ticketNumber: "TK-2026-9041",
    creatorId: "user-1",
    creatorName: "Fahad",
    creatorRole: "CUSTOMER",
    bookingId: "b64daea7-1e40-413a-a36e-51be0568bffe",
    bookingNumber: "BK-MWQGDQBP-9950",
    serviceTitle: "AC Repair & Check Cooling",
    counterpartyName: "Basheer M B (Apex Electrician)",
    category: "PAYMENT_REFUND",
    categoryLabel: "Escrow / Refund Discrepancy",
    subject: "Escrow settlement discrepancy on remaining balance",
    description: "I noticed the platform fee breakdown calculation on the balance settlement required clarification. The provider and I discussed on-site additions.",
    priority: "MEDIUM",
    status: "RESOLVED",
    attachments: [],
    createdAt: "2026-11-21T18:30:00.000Z",
    updatedAt: "2026-11-21T19:00:00.000Z",
    resolutionNote: "Escrow calculations confirmed. Payout logic verified to credit provider wallet net of 5% platform fee with full transparency.",
    messages: [
      {
        id: "m-1",
        authorName: "Support Team",
        authorRole: "ADMIN",
        message: "Hello! We have verified the breakdown. The platform fee is 5% on the base quote, and provider commission is 5% on completed earnings. No unauthorized deductions were made.",
        createdAt: "2026-11-21T18:45:00.000Z"
      },
      {
        id: "m-2",
        authorName: "Fahad",
        authorRole: "CUSTOMER",
        message: "Thank you for the prompt clarification, the numbers make total sense now.",
        createdAt: "2026-11-21T18:55:00.000Z"
      }
    ]
  }
];

export const SupportTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isProvider = location.pathname.startsWith("/provider") || user?.role === "PROVIDER";

  const customerBookingsQuery = useGetCustomerBookings(undefined, { enabled: !isProvider });
  const providerBookingsQuery = useGetProviderBookings(undefined, { enabled: isProvider });

  const activeBookings = useMemo(() => {
    const rawList = isProvider
      ? providerBookingsQuery.data?.data?.bookings || []
      : customerBookingsQuery.data?.data?.bookings || [];

    return rawList.map((b: any) => ({
      id: b.booking?.id || b.id,
      bookingNumber: b.booking?.booking_number || b.bookingNumber,
      serviceTitle: b.serviceRequestTitle || b.booking?.service_request?.title || "Service",
      totalAmount: Number(b.booking?.total_amount || b.totalAmount || 0),
      advanceAmount: Number(b.booking?.advance_amount || b.advanceAmount || 0),
      status: b.booking?.status || b.status
    }));
  }, [isProvider, customerBookingsQuery.data, providerBookingsQuery.data]);

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(INITIAL_MOCK_TICKETS[0]?.id || "");
  const [activeView, setActiveView] = useState<"TICKETS" | "CREATE">("TICKETS");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [replyText, setReplyText] = useState<string>("");

  const [formBookingId, setFormBookingId] = useState<string>("");
  const [formCategory, setFormCategory] = useState<TicketCategory>(
    isProvider ? "CUSTOMER_ABSENT" : "PROVIDER_NO_SHOW"
  );
  const [formPriority, setFormPriority] = useState<TicketPriority>("HIGH");
  const [formSubject, setFormSubject] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSubmitBanner, setShowSubmitBanner] = useState<boolean>(false);

  const categories = isProvider ? PROVIDER_CATEGORIES : CUSTOMER_CATEGORIES;

  const counts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === "OPEN").length,
      reviewing: tickets.filter((t) => t.status === "UNDER_REVIEW").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
      closed: tickets.filter((t) => t.status === "CLOSED").length,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.bookingNumber && t.bookingNumber.toLowerCase().includes(q)) ||
        (t.serviceTitle && t.serviceTitle.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const selectedTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0] || null;
  }, [tickets, selectedTicketId, filteredTickets]);

  const handleSelectBooking = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bId = e.target.value;
    setFormBookingId(bId);
    const found = activeBookings.find((b) => b.id === bId);
    if (found && !formSubject) {
      setFormSubject(`Concern regarding ${found.serviceTitle} (#${found.bookingNumber})`);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDescription.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const linkedBooking = activeBookings.find((b) => b.id === formBookingId);
      const catObj = categories.find((c) => c.value === formCategory);

      const newTicket: SupportTicket = {
        id: `tk-${Date.now()}`,
        ticketNumber: `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        creatorId: user?.id || "user",
        creatorName: user?.name || (isProvider ? "Provider" : "Customer"),
        creatorRole: isProvider ? "PROVIDER" : "CUSTOMER",
        bookingId: linkedBooking?.id,
        bookingNumber: linkedBooking?.bookingNumber,
        serviceTitle: linkedBooking?.serviceTitle,
        category: formCategory,
        categoryLabel: catObj?.label || formCategory,
        subject: formSubject.trim(),
        description: formDescription.trim(),
        priority: formPriority,
        status: "OPEN",
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            authorName: user?.name || "You",
            authorRole: isProvider ? "PROVIDER" : "CUSTOMER",
            message: formDescription.trim(),
            createdAt: new Date().toISOString()
          }
        ]
      };

      setTickets((prev) => [newTicket, ...prev]);
      setSelectedTicketId(newTicket.id);
      setIsSubmitting(false);
      setShowSubmitBanner(true);
      setFormSubject("");
      setFormDescription("");
      setFormBookingId("");

      setTimeout(() => {
        setShowSubmitBanner(false);
        setActiveView("TICKETS");
      }, 1200);
    }, 500);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: `reply-${Date.now()}`,
      authorName: user?.name || "You",
      authorRole: (isProvider ? "PROVIDER" : "CUSTOMER") as any,
      message: replyText.trim(),
      createdAt: new Date().toISOString()
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
    setReplyText("");
  };

  return (
    <div className={`spt-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <div className="spt-hero-section">
        <div className="spt-hero-content">
          <div className="spt-breadcrumb">
            <span>Portal</span>
            <i className="fas fa-chevron-right sep"></i>
            <span className={`spt-role-badge ${isProvider ? "provider" : "customer"}`}>
              {isProvider ? "Provider Resolution Hub" : "Customer Support"}
            </span>
            <i className="fas fa-chevron-right sep"></i>
            <span className="active">Dispute & Resolution Center</span>
          </div>

          <h1 className="spt-hero-title">Help, Disputes & Support Tickets</h1>
          <p className="spt-hero-subtitle">
            Report unfulfilled appointments, dispute incomplete services, or resolve payment & escrow queries with dedicated mediation.
          </p>
        </div>

        <div className="spt-hero-actions">
          {activeView === "CREATE" ? (
            <button
              type="button"
              className="spt-secondary-btn"
              onClick={() => setActiveView("TICKETS")}
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back to Tickets</span>
            </button>
          ) : (
            <button
              type="button"
              className="spt-action-primary-btn"
              onClick={() => setActiveView("CREATE")}
            >
              <i className="fas fa-plus-circle"></i>
              <span>File a Concern / Ticket</span>
            </button>
          )}
        </div>
      </div>

      {activeView === "CREATE" ? (
        <div className="spt-creation-container">
          <div className="spt-creation-header">
            <div className="spt-ch-badge">
              <i className="fas fa-flag"></i>
              <span>Official Grievance Dossier</span>
            </div>
            <h2 className="spt-creation-title">Submit a Booking Concern or Dispute</h2>
            <p className="spt-creation-desc">
              Please specify the booking and exact issue. Once submitted, escrow funds on active bookings are automatically secured under platform review.
            </p>
          </div>

          {showSubmitBanner && (
            <div className="spt-alert-banner success">
              <i className="fas fa-check-circle"></i>
              <div>
                <strong>Ticket Registered Successfully!</strong>
                <span>Opening your ticket thread...</span>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="spt-creation-form">
            <div className="spt-form-section">
              <h3 className="spt-fs-title">1. Link an Active Booking (Recommended)</h3>
              <div className="spt-form-group">
                <label htmlFor="booking-select">Select Affected Booking</label>
                <select
                  id="booking-select"
                  className="spt-form-control"
                  value={formBookingId}
                  onChange={handleSelectBooking}
                >
                  <option value="">General Platform Concern (No specific booking)</option>
                  {activeBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      #{b.bookingNumber} — {b.serviceTitle} ({b.status})
                    </option>
                  ))}
                </select>
                <span className="spt-field-help">
                  Linking your booking allows administrators to review the quotation, chat history, and audit timeline instantly.
                </span>
              </div>
            </div>

            <div className="spt-form-section">
              <h3 className="spt-fs-title">2. Choose Issue Category</h3>
              <div className="spt-category-grid">
                {categories.map((c) => {
                  const isChecked = formCategory === c.value;
                  return (
                    <div
                      key={c.value}
                      className={`spt-cat-card ${isChecked ? "selected" : ""}`}
                      onClick={() => setFormCategory(c.value)}
                    >
                      <div className="spt-cat-card-top">
                        <div className="spt-cat-icon">
                          <i className={c.icon}></i>
                        </div>
                        {c.badge && <span className="spt-cat-badge">{c.badge}</span>}
                      </div>
                      <h4 className="spt-cat-title">{c.label}</h4>
                      <p className="spt-cat-desc">{c.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="spt-form-section">
              <h3 className="spt-fs-title">3. Provide Problem Details</h3>
              <div className="spt-form-row">
                <div className="spt-form-group flex-2">
                  <label htmlFor="spt-subject-input">Subject Summary *</label>
                  <input
                    id="spt-subject-input"
                    type="text"
                    required
                    className="spt-form-control"
                    placeholder="e.g. Technician failed to show up at scheduled 10:00 AM visit"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                  />
                </div>

                <div className="spt-form-group flex-1">
                  <label>Urgency Level</label>
                  <div className="spt-segmented-control">
                    {(["MEDIUM", "HIGH", "URGENT"] as TicketPriority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        className={`spt-seg-btn ${formPriority === p ? "active" : ""}`}
                        onClick={() => setFormPriority(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="spt-form-group">
                <label htmlFor="spt-desc-input">Comprehensive Explanation *</label>
                <textarea
                  id="spt-desc-input"
                  required
                  rows={5}
                  className="spt-form-control textarea"
                  placeholder="Provide precise chronological details: what time was agreed, attempts made to contact via in-app chat or phone, and the current on-site status..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="spt-form-actions-bar">
              <button
                type="button"
                className="spt-secondary-btn"
                onClick={() => setActiveView("TICKETS")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="spt-action-primary-btn"
                disabled={isSubmitting || !formSubject.trim() || !formDescription.trim()}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-alt"></i>
                    <span>Submit & Protect Escrow</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="spt-main-split-view">
          <div className="spt-tickets-column">
            <div className="spt-toolbar">
              <div className="spt-search-input-wrap">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search by ticket #, booking, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>

              <div className="spt-tabs-container">
                <button
                  type="button"
                  className={`spt-tab-pill ${statusFilter === "ALL" ? "active" : ""}`}
                  onClick={() => setStatusFilter("ALL")}
                >
                  <span>All</span>
                  <span className="count">{counts.all}</span>
                </button>
                <button
                  type="button"
                  className={`spt-tab-pill ${statusFilter === "OPEN" ? "active" : ""}`}
                  onClick={() => setStatusFilter("OPEN")}
                >
                  <span>Open</span>
                  <span className="count">{counts.open}</span>
                </button>
                <button
                  type="button"
                  className={`spt-tab-pill ${statusFilter === "UNDER_REVIEW" ? "active" : ""}`}
                  onClick={() => setStatusFilter("UNDER_REVIEW")}
                >
                  <span>In Review</span>
                  <span className="count">{counts.reviewing}</span>
                </button>
                <button
                  type="button"
                  className={`spt-tab-pill ${statusFilter === "RESOLVED" ? "active" : ""}`}
                  onClick={() => setStatusFilter("RESOLVED")}
                >
                  <span>Resolved</span>
                  <span className="count">{counts.resolved}</span>
                </button>
              </div>
            </div>

            <div className="spt-ticket-feed">
              {filteredTickets.length === 0 ? (
                <div className="spt-empty-feed-card">
                  <div className="spt-empty-icon-wrap">
                    <i className="fas fa-inbox"></i>
                  </div>
                  <h3>No Tickets Found</h3>
                  <p>There are no support tickets matching your current search or filter selection.</p>
                  <button
                    type="button"
                    className="spt-action-primary-btn"
                    onClick={() => setActiveView("CREATE")}
                  >
                    <i className="fas fa-plus"></i>
                    <span>File a Concern</span>
                  </button>
                </div>
              ) : (
                filteredTickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`spt-feed-item ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedTicketId(t.id)}
                    >
                      <div className="spt-feed-header">
                        <span className="spt-feed-num">#{t.ticketNumber}</span>
                        <div className="spt-feed-badges">
                          <span className={`spt-priority-tag ${t.priority.toLowerCase()}`}>
                            {t.priority}
                          </span>
                          <span className={`spt-status-tag ${t.status.toLowerCase()}`}>
                            {t.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <h4 className="spt-feed-subject">{t.subject}</h4>
                      <p className="spt-feed-snippet">{t.description}</p>

                      <div className="spt-feed-footer">
                        {t.bookingNumber ? (
                          <span className="spt-meta-chip booking">
                            <i className="fas fa-calendar-check"></i>
                            {t.bookingNumber}
                          </span>
                        ) : (
                          <span className="spt-meta-chip general">
                            <i className="fas fa-info-circle"></i>
                            General Support
                          </span>
                        )}
                        <span className="spt-meta-chip date">
                          <i className="fas fa-clock"></i>
                          {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short"
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="spt-detail-column">
            {selectedTicket ? (
              <div className="spt-dossier-card">
                <div className="spt-dossier-header">
                  <div className="spt-dossier-id-row">
                    <div className="spt-dossier-tag">
                      <i className="fas fa-ticket-alt"></i>
                      <span>Case #{selectedTicket.ticketNumber}</span>
                    </div>
                    <span className={`spt-status-pill ${selectedTicket.status.toLowerCase()}`}>
                      {selectedTicket.status.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="spt-dossier-title">{selectedTicket.subject}</h2>
                  <span className="spt-dossier-date">
                    Filed on {new Date(selectedTicket.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>

                {selectedTicket.bookingNumber && (
                  <div className="spt-disputed-booking-card">
                    <div className="spt-dbc-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div className="spt-dbc-info">
                      <span className="spt-dbc-label">Linked Booking Record</span>
                      <strong className="spt-dbc-title">
                        #{selectedTicket.bookingNumber} — {selectedTicket.serviceTitle || "Service Booking"}
                      </strong>
                      <span className="spt-dbc-sub">
                        Counterparty: {selectedTicket.counterpartyName || "Assigned Partner"} · Escrow Protected
                      </span>
                    </div>
                    {selectedTicket.bookingId && (
                      <button
                        type="button"
                        className="spt-view-booking-btn"
                        onClick={() => navigate(isProvider ? `/provider/bookings/${selectedTicket.bookingId}` : `/bookings/${selectedTicket.bookingId}`)}
                      >
                        <span>View Booking</span>
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    )}
                  </div>
                )}

                <div className="spt-dossier-block">
                  <h4 className="spt-db-heading">Original Grievance Dossier</h4>
                  <div className="spt-grievance-text">
                    {selectedTicket.description}
                  </div>
                </div>

                {selectedTicket.resolutionNote && (
                  <div className="spt-resolution-card">
                    <div className="spt-rc-header">
                      <i className="fas fa-check-circle"></i>
                      <span>Official Resolution & Settlement</span>
                    </div>
                    <p className="spt-rc-body">{selectedTicket.resolutionNote}</p>
                  </div>
                )}

                <div className="spt-timeline-block">
                  <h4 className="spt-db-heading">Activity & Mediation Log</h4>
                  <div className="spt-timeline-list">
                    {selectedTicket.messages.map((m) => {
                      const isAdminMsg = m.authorRole === "ADMIN";
                      return (
                        <div key={m.id} className={`spt-tl-item ${isAdminMsg ? "admin" : "user"}`}>
                          <div className="spt-tl-meta">
                            <span className="spt-tl-author">{m.authorName}</span>
                            <span className={`spt-tl-role ${isAdminMsg ? "admin" : "member"}`}>
                              {m.authorRole}
                            </span>
                            <span className="spt-tl-time">
                              {new Date(m.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <div className="spt-tl-bubble">{m.message}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedTicket.status !== "CLOSED" && (
                  <div className="spt-reply-section">
                    <textarea
                      rows={3}
                      className="spt-reply-input"
                      placeholder="Add supplementary information or response for the support team..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="spt-reply-footer">
                      <span className="spt-reply-hint">
                        <i className="fas fa-lock"></i> All replies are logged to the official resolution record.
                      </span>
                      <button
                        type="button"
                        className="spt-send-reply-btn"
                        disabled={!replyText.trim()}
                        onClick={handleSendReply}
                      >
                        <i className="fas fa-reply"></i>
                        <span>Send Response</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="spt-no-selection-card">
                <i className="fas fa-ticket-alt"></i>
                <h3>Select a Ticket to Review</h3>
                <p>Pick a ticket from the list on the left to inspect its mediation status, activity log, and resolutions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
