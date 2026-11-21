import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import type { SupportTicket, TicketCategory, TicketStatus, TicketPriority } from "../../types/support.types";
import "./SupportTicketsPage.css";

const CUSTOMER_CATEGORIES: { value: TicketCategory; label: string; desc: string }[] = [
  { value: "PROVIDER_NO_SHOW", label: "Technician Did Not Arrive", desc: "Technician is late or completely failed to show up at scheduled time" },
  { value: "POOR_WORKMANSHIP", label: "Incomplete / Poor Work", desc: "Work was left unfinished or done unsafely / improperly" },
  { value: "UNAUTHORIZED_CHARGES", label: "Demanding Extra Cash", desc: "Technician demanded offline unagreed cash outside the platform" },
  { value: "SAFETY_CONDUCT", label: "Behavior & Safety Concern", desc: "Unprofessional conduct, safety risk, or property damage" },
  { value: "PAYMENT_REFUND", label: "Payment or Refund Dispute", desc: "Escrow deduction, overcharge, or wallet refund issue" },
  { value: "GENERAL_INQUIRY", label: "General Support", desc: "Account, app, or general service questions" },
];

const PROVIDER_CATEGORIES: { value: TicketCategory; label: string; desc: string }[] = [
  { value: "CUSTOMER_ABSENT", label: "Customer Not at Location", desc: "Arrived on-site but customer is unavailable or not answering calls" },
  { value: "PAYMENT_DISPUTE", label: "Remaining Balance Refusal", desc: "Customer refuses to approve or pay the remaining balance" },
  { value: "SCOPE_DISPUTE", label: "Demanding Unpaid Extra Work", desc: "Customer insists on additional tasks beyond the quotation agreement" },
  { value: "SAFETY_PREMISES", label: "Premises Safety Hazard", desc: "Location is unsafe, hostile, or physically inaccessible" },
  { value: "GENERAL_INQUIRY", label: "General Support", desc: "Wallet payout, platform fees, or account inquiries" },
];

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tk-1",
    ticketNumber: "TK-2026-9041",
    creatorId: "user-1",
    creatorName: "Fahad",
    creatorRole: "CUSTOMER",
    bookingId: "b64daea7-1e40-413a-a36e-51be0568bffe",
    bookingNumber: "BK-MWQGDQBP-9950",
    serviceTitle: "AC Repair & Check Cooling",
    counterpartyName: "Apex Electrician (Basheer)",
    category: "PAYMENT_REFUND",
    categoryLabel: "Payment or Refund Dispute",
    subject: "Escrow settlement discrepancy on remaining balance",
    description: "I noticed the platform fee breakdown calculation on the balance settlement required clarification. Everything is now functioning smoothly.",
    priority: "MEDIUM",
    status: "RESOLVED",
    attachments: [],
    createdAt: "2026-11-21T18:30:00.000Z",
    updatedAt: "2026-11-21T19:00:00.000Z",
    resolutionNote: "Reviewed the escrow breakdown. Balance formula updated to correctly credit provider wallet net of 5% commission.",
    messages: [
      {
        id: "msg-1",
        authorName: "Support Team",
        authorRole: "ADMIN",
        message: "Your ticket has been reviewed and resolved. The fee calculations are verified.",
        createdAt: "2026-11-21T19:00:00.000Z"
      }
    ]
  }
];

export const SupportTicketsPage: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isProvider = location.pathname.startsWith("/provider") || user?.role === "PROVIDER";

  const [activeTab, setActiveTab] = useState<"LIST" | "NEW">("LIST");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);

  const [formBookingNumber, setFormBookingNumber] = useState("");
  const [formCategory, setFormCategory] = useState<TicketCategory>(
    isProvider ? "CUSTOMER_ABSENT" : "PROVIDER_NO_SHOW"
  );
  const [formPriority, setFormPriority] = useState<TicketPriority>("HIGH");
  const [formSubject, setFormSubject] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = isProvider ? PROVIDER_CATEGORIES : CUSTOMER_CATEGORIES;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.bookingNumber && t.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.serviceTitle && t.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [tickets, statusFilter, searchQuery]);

  const metrics = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "OPEN" || t.status === "UNDER_REVIEW").length,
      resolved: tickets.filter((t) => t.status === "RESOLVED").length,
    };
  }, [tickets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formDescription.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const selectedCatObj = categories.find((c) => c.value === formCategory);
      const newTicket: SupportTicket = {
        id: `tk-${Date.now()}`,
        ticketNumber: `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        creatorId: user?.id || "user",
        creatorName: user?.name || "User",
        creatorRole: isProvider ? "PROVIDER" : "CUSTOMER",
        bookingNumber: formBookingNumber.trim() || undefined,
        category: formCategory,
        categoryLabel: selectedCatObj?.label || formCategory,
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

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormSubject("");
      setFormDescription("");
      setFormBookingNumber("");
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab("LIST");
        setSelectedTicket(newTicket);
      }, 1500);
    }, 600);
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "OPEN":
        return <span className="spt-status-pill open"><i className="fas fa-clock"></i> Open</span>;
      case "UNDER_REVIEW":
        return <span className="spt-status-pill reviewing"><i className="fas fa-search"></i> Under Review</span>;
      case "RESOLVED":
        return <span className="spt-status-pill resolved"><i className="fas fa-check-circle"></i> Resolved</span>;
      case "CLOSED":
        return <span className="spt-status-pill closed"><i className="fas fa-times-circle"></i> Closed</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "URGENT":
        return <span className="spt-priority-pill urgent">Urgent</span>;
      case "HIGH":
        return <span className="spt-priority-pill high">High</span>;
      case "MEDIUM":
        return <span className="spt-priority-pill medium">Medium</span>;
      case "LOW":
        return <span className="spt-priority-pill low">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`spt-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <div className="spt-header-card">
        <div className="spt-header-info">
          <div className="spt-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Trust & Resolution Center</span>
          </div>
          <h1 className="spt-title">Help & Support Tickets</h1>
          <p className="spt-subtitle">
            Report unfulfilled bookings, dispute payments, raise safety concerns, or request platform assistance.
          </p>
        </div>

        <div className="spt-header-action">
          <button
            type="button"
            className={`spt-primary-btn ${activeTab === "NEW" ? "active" : ""}`}
            onClick={() => {
              setActiveTab(activeTab === "NEW" ? "LIST" : "NEW");
              setSelectedTicket(null);
            }}
          >
            <i className={activeTab === "NEW" ? "fas fa-list" : "fas fa-plus-circle"}></i>
            <span>{activeTab === "NEW" ? "View My Tickets" : "Raise a Concern"}</span>
          </button>
        </div>
      </div>

      <div className="spt-metrics-grid">
        <div className="spt-metric-card">
          <div className="spt-metric-icon total">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="spt-metric-data">
            <span className="spt-metric-count">{metrics.total}</span>
            <span className="spt-metric-label">Total Tickets</span>
          </div>
        </div>

        <div className="spt-metric-card">
          <div className="spt-metric-icon active">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="spt-metric-data">
            <span className="spt-metric-count">{metrics.open}</span>
            <span className="spt-metric-label">Active / In Review</span>
          </div>
        </div>

        <div className="spt-metric-card">
          <div className="spt-metric-icon resolved">
            <i className="fas fa-check-double"></i>
          </div>
          <div className="spt-metric-data">
            <span className="spt-metric-count">{metrics.resolved}</span>
            <span className="spt-metric-label">Resolved Issues</span>
          </div>
        </div>
      </div>

      {activeTab === "NEW" ? (
        <div className="spt-form-card">
          <div className="spt-form-header">
            <div className="spt-form-title-group">
              <i className="fas fa-life-ring"></i>
              <div>
                <h2>Submit a Support Ticket / Dispute</h2>
                <p>Provide details below. Our resolution team will review and secure your funds.</p>
              </div>
            </div>
          </div>

          {submitSuccess && (
            <div className="spt-success-banner">
              <i className="fas fa-check-circle"></i>
              <div>
                <strong>Ticket Submitted Successfully!</strong>
                <span>Redirecting to your ticket details...</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="spt-form">
            <div className="spt-form-row">
              <div className="spt-input-group">
                <label htmlFor="spt-category">What is this concern regarding? *</label>
                <select
                  id="spt-category"
                  className="spt-select"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as TicketCategory)}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="spt-input-hint">
                  {categories.find((c) => c.value === formCategory)?.desc}
                </span>
              </div>

              <div className="spt-input-group">
                <label htmlFor="spt-booking">Related Booking Number (Optional)</label>
                <input
                  id="spt-booking"
                  type="text"
                  placeholder="e.g. BK-MWQGDQBP-9950"
                  className="spt-input"
                  value={formBookingNumber}
                  onChange={(e) => setFormBookingNumber(e.target.value)}
                />
                <span className="spt-input-hint">
                  If this is about an active or past booking, enter its booking code.
                </span>
              </div>
            </div>

            <div className="spt-form-row">
              <div className="spt-input-group full">
                <label htmlFor="spt-subject">Subject / Brief Summary *</label>
                <input
                  id="spt-subject"
                  type="text"
                  required
                  placeholder="e.g. Technician did not arrive at 09:00 AM as scheduled"
                  className="spt-input"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                />
              </div>
            </div>

            <div className="spt-form-row">
              <div className="spt-input-group full">
                <label htmlFor="spt-desc">Detailed Description *</label>
                <textarea
                  id="spt-desc"
                  required
                  rows={5}
                  placeholder="Explain exactly what happened, times, calls made, or issues encountered..."
                  className="spt-textarea"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="spt-form-row">
              <div className="spt-input-group">
                <label>Priority</label>
                <div className="spt-priority-chips">
                  {(["LOW", "MEDIUM", "HIGH", "URGENT"] as TicketPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`spt-chip ${formPriority === p ? "active" : ""}`}
                      onClick={() => setFormPriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="spt-form-footer">
              <button
                type="button"
                className="spt-cancel-btn"
                onClick={() => setActiveTab("LIST")}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formSubject.trim() || !formDescription.trim()}
                className="spt-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>Submit Concern</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="spt-main-layout">
          <div className="spt-list-section">
            <div className="spt-filter-bar">
              <div className="spt-search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search by ticket #, booking, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="spt-status-tabs">
                {(["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`spt-status-tab ${statusFilter === s ? "active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="spt-empty-card">
                <i className="fas fa-check-shield"></i>
                <h3>No tickets found</h3>
                <p>You have no reported concerns matching this filter.</p>
                <button
                  type="button"
                  className="spt-primary-btn"
                  onClick={() => setActiveTab("NEW")}
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Raise a Concern</span>
                </button>
              </div>
            ) : (
              <div className="spt-ticket-cards">
                {filteredTickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`spt-ticket-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedTicket(t)}
                    >
                      <div className="spt-ticket-top">
                        <div className="spt-ticket-id">
                          <i className="fas fa-ticket-alt"></i>
                          <span>{t.ticketNumber}</span>
                        </div>
                        <div className="spt-ticket-pills">
                          {getPriorityBadge(t.priority)}
                          {getStatusBadge(t.status)}
                        </div>
                      </div>

                      <h3 className="spt-ticket-subject">{t.subject}</h3>
                      <p className="spt-ticket-desc-snippet">{t.description}</p>

                      <div className="spt-ticket-meta">
                        {t.bookingNumber && (
                          <span className="spt-meta-item booking">
                            <i className="fas fa-calendar-check"></i>
                            {t.bookingNumber}
                          </span>
                        )}
                        <span className="spt-meta-item category">
                          <i className="fas fa-tag"></i>
                          {t.categoryLabel}
                        </span>
                        <span className="spt-meta-item date">
                          <i className="fas fa-clock"></i>
                          {new Date(t.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="spt-detail-section">
            {selectedTicket ? (
              <div className="spt-detail-card">
                <div className="spt-detail-header">
                  <div>
                    <div className="spt-ticket-id-large">
                      <span>{selectedTicket.ticketNumber}</span>
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                    <h2 className="spt-detail-title">{selectedTicket.subject}</h2>
                  </div>
                  <button
                    type="button"
                    className="spt-close-detail"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="spt-detail-info-grid">
                  <div className="spt-info-item">
                    <span className="spt-info-label">Category</span>
                    <strong className="spt-info-value">{selectedTicket.categoryLabel}</strong>
                  </div>
                  <div className="spt-info-item">
                    <span className="spt-info-label">Priority</span>
                    <div>{getPriorityBadge(selectedTicket.priority)}</div>
                  </div>
                  {selectedTicket.bookingNumber && (
                    <div className="spt-info-item">
                      <span className="spt-info-label">Linked Booking</span>
                      <strong className="spt-info-value highlight">
                        {selectedTicket.bookingNumber}
                      </strong>
                    </div>
                  )}
                  <div className="spt-info-item">
                    <span className="spt-info-label">Submitted On</span>
                    <strong className="spt-info-value">
                      {new Date(selectedTicket.createdAt).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="spt-detail-block">
                  <h4 className="spt-block-title">Issue Description</h4>
                  <p className="spt-block-text">{selectedTicket.description}</p>
                </div>

                {selectedTicket.resolutionNote && (
                  <div className="spt-resolution-box">
                    <div className="spt-resolution-header">
                      <i className="fas fa-check-circle"></i>
                      <span>Official Resolution</span>
                    </div>
                    <p className="spt-resolution-text">{selectedTicket.resolutionNote}</p>
                  </div>
                )}

                <div className="spt-conversation-thread">
                  <h4 className="spt-block-title">Support Timeline & Messages</h4>
                  <div className="spt-messages-list">
                    {selectedTicket.messages.map((m) => (
                      <div key={m.id} className={`spt-msg-item ${m.authorRole === "ADMIN" ? "admin" : "user"}`}>
                        <div className="spt-msg-author">
                          <strong>{m.authorName}</strong>
                          <span className="spt-role-tag">{m.authorRole}</span>
                          <span className="spt-msg-time">
                            {new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="spt-msg-body">{m.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="spt-detail-placeholder">
                <i className="fas fa-hand-pointer"></i>
                <h3>Select a ticket to view details</h3>
                <p>Choose an item from the list on the left to review support responses and updates.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
