import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useSupportStore } from "../../stores/support.store";
import type { SupportTicket } from "../../types/support.types";
import "./AdminSupportTicketsPage.css";

export const AdminSupportTicketsPage: React.FC = () => {
  const tickets = useSupportStore((state) => state.tickets);
  const updateTicketStatus = useSupportStore((state) => state.updateTicketStatus);
  const resolveTicket = useSupportStore((state) => state.resolveTicket);
  const addTicketMessage = useSupportStore((state) => state.addTicketMessage);

  const [activeStatusTab, setActiveStatusTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [adminReply, setAdminReply] = useState<string>("");
  const [resolutionNote, setResolutionNote] = useState<string>("");
  const [settlementDecision, setSettlementDecision] = useState<
    "FULL_REFUND_CUSTOMER" | "FULL_PAYOUT_PROVIDER" | "SPLIT_SETTLEMENT" | "NO_FINANCIAL_ACTION"
  >("FULL_REFUND_CUSTOMER");
  const [customSplitCustomer, setCustomSplitCustomer] = useState<string>("");
  const [customSplitProvider, setCustomSplitProvider] = useState<string>("");

  const stats = useMemo(() => {
    const total = tickets.length;
    const openCount = tickets.filter((t) => t.status === "OPEN").length;
    const reviewCount = tickets.filter((t) => t.status === "UNDER_REVIEW").length;
    const resolvedCount = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
    return { total, openCount, reviewCount, resolvedCount };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesStatus =
        activeStatusTab === "ALL" ||
        (activeStatusTab === "OPEN" && t.status === "OPEN") ||
        (activeStatusTab === "UNDER_REVIEW" && t.status === "UNDER_REVIEW") ||
        (activeStatusTab === "RESOLVED" && (t.status === "RESOLVED" || t.status === "CLOSED"));

      const matchesCategory =
        categoryFilter === "ALL" || t.category === categoryFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.ticketNumber.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.creatorName.toLowerCase().includes(q) ||
        (t.bookingNumber && t.bookingNumber.toLowerCase().includes(q)) ||
        (t.serviceTitle && t.serviceTitle.toLowerCase().includes(q));

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [tickets, activeStatusTab, categoryFilter, searchQuery]);

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setResolutionNote(ticket.resolutionNote || "");
    setSettlementDecision(ticket.settlementDecision || "FULL_REFUND_CUSTOMER");
    setAdminReply("");
  };

  const handleStartReview = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, "UNDER_REVIEW");
    addTicketMessage(
      selectedTicket.id,
      "An administrator has commenced formal investigation of this case. Escrow accounts are placed on temporary verification hold.",
      "Support Resolution Desk",
      "SYSTEM"
    );
    setSelectedTicket((prev) =>
      prev ? { ...prev, status: "UNDER_REVIEW", updatedAt: new Date().toISOString() } : null
    );
    toast.success("Ticket marked as Under Review.");
  };

  const handleSendAdminReply = () => {
    if (!adminReply.trim() || !selectedTicket) return;
    addTicketMessage(selectedTicket.id, adminReply.trim(), "Support Admin", "ADMIN");
    setAdminReply("");
    const updated = useSupportStore.getState().tickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
    toast.success("Reply added to case activity.");
  };

  const handleExecuteResolution = () => {
    if (!selectedTicket) return;
    if (!resolutionNote.trim()) {
      toast.error("Please enter a resolution note detailing the decision.");
      return;
    }

    let splitDetails = "";
    if (settlementDecision === "SPLIT_SETTLEMENT") {
      splitDetails = `Customer Refund: ₹${customSplitCustomer || "0"} | Provider Payout: ₹${customSplitProvider || "0"}`;
    }

    resolveTicket(selectedTicket.id, resolutionNote.trim(), settlementDecision, splitDetails);
    const updated = useSupportStore.getState().tickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
    toast.success("Case resolved and settlement recorded.");
  };

  const handleCloseTicket = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, "CLOSED");
    addTicketMessage(
      selectedTicket.id,
      "This support ticket is now officially closed.",
      "Support Resolution Desk",
      "SYSTEM"
    );
    const updated = useSupportStore.getState().tickets.find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
    toast.success("Ticket marked as closed.");
  };

  return (
    <div className="admin-spt-container">
      <div className="admin-spt-header">
        <div>
          <div className="admin-spt-badge">
            <i className="fas fa-gavel"></i>
            <span>Trust, Safety & Dispute Mediation</span>
          </div>
          <h1 className="admin-spt-title">Support & Dispute Resolutions</h1>
          <p className="admin-spt-subtitle">
            Review customer and provider dispute tickets, evaluate evidence dossiers, adjudicate financial settlements, and enforce marketplace policies.
          </p>
        </div>
      </div>

      <div className="admin-spt-kpi-grid">
        <div
          className={`admin-kpi-card ${activeStatusTab === "ALL" ? "selected" : ""}`}
          onClick={() => setActiveStatusTab("ALL")}
        >
          <div className="admin-kpi-icon total">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Total Disputes</span>
            <strong className="admin-kpi-val">{stats.total}</strong>
          </div>
        </div>

        <div
          className={`admin-kpi-card ${activeStatusTab === "OPEN" ? "selected" : ""}`}
          onClick={() => setActiveStatusTab("OPEN")}
        >
          <div className="admin-kpi-icon open">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Needs Review</span>
            <strong className="admin-kpi-val">{stats.openCount}</strong>
          </div>
        </div>

        <div
          className={`admin-kpi-card ${activeStatusTab === "UNDER_REVIEW" ? "selected" : ""}`}
          onClick={() => setActiveStatusTab("UNDER_REVIEW")}
        >
          <div className="admin-kpi-icon review">
            <i className="fas fa-search"></i>
          </div>
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Under Investigation</span>
            <strong className="admin-kpi-val">{stats.reviewCount}</strong>
          </div>
        </div>

        <div
          className={`admin-kpi-card ${activeStatusTab === "RESOLVED" ? "selected" : ""}`}
          onClick={() => setActiveStatusTab("RESOLVED")}
        >
          <div className="admin-kpi-icon resolved">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="admin-kpi-info">
            <span className="admin-kpi-label">Resolved & Settled</span>
            <strong className="admin-kpi-val">{stats.resolvedCount}</strong>
          </div>
        </div>
      </div>

      <div className="admin-spt-filter-bar">
        <div className="admin-search-wrap">
          <i className="fas fa-search"></i>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search ticket #, booking #, customer, or provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeStatusTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveStatusTab("ALL")}
          >
            All ({stats.total})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeStatusTab === "OPEN" ? "active" : ""}`}
            onClick={() => setActiveStatusTab("OPEN")}
          >
            Open ({stats.openCount})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeStatusTab === "UNDER_REVIEW" ? "active" : ""}`}
            onClick={() => setActiveStatusTab("UNDER_REVIEW")}
          >
            Under Review ({stats.reviewCount})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeStatusTab === "RESOLVED" ? "active" : ""}`}
            onClick={() => setActiveStatusTab("RESOLVED")}
          >
            Resolved ({stats.resolvedCount})
          </button>
        </div>

        <select
          className="admin-select-category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          <option value="PROVIDER_NO_SHOW">Provider No-Show</option>
          <option value="POOR_WORKMANSHIP">Quality / Incomplete Work</option>
          <option value="PAYMENT_REFUND">Payment & Escrow Discrepancy</option>
          <option value="CUSTOMER_ABSENT">Customer Absent / Unreachable</option>
          <option value="SCOPE_DISPUTE">Scope Discrepancy</option>
          <option value="SAFETY_CONDUCT">Safety / Conduct Violation</option>
          <option value="GENERAL_INQUIRY">General Inquiry</option>
        </select>
      </div>

      <div className="admin-table-container">
        {filteredTickets.length === 0 ? (
          <div className="admin-empty-table">
            <i className="fas fa-clipboard-check"></i>
            <h3>No tickets found matching current filters</h3>
            <p>Try resetting the search or selecting a different status filter.</p>
          </div>
        ) : (
          <div className="admin-spt-table">
            <div className="admin-table-head">
              <span>Ticket & Priority</span>
              <span>Complainant</span>
              <span>Linked Booking / Subject</span>
              <span>Category</span>
              <span>Status</span>
              <span>Created</span>
              <span>Action</span>
            </div>

            <div className="admin-table-body">
              {filteredTickets.map((t) => (
                <div key={t.id} className="admin-table-row">
                  <div className="admin-col-ticket">
                    <strong>#{t.ticketNumber}</strong>
                    <span className={`admin-priority-badge ${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                  </div>

                  <div className="admin-col-complainant">
                    <strong>{t.creatorName}</strong>
                    <span className={`admin-role-tag ${t.creatorRole.toLowerCase()}`}>
                      {t.creatorRole}
                    </span>
                  </div>

                  <div className="admin-col-subject">
                    <strong>{t.subject}</strong>
                    {t.bookingNumber && (
                      <span className="admin-linked-booking-pill">
                        <i className="fas fa-calendar-check"></i> #{t.bookingNumber}
                        {t.serviceTitle && ` · ${t.serviceTitle}`}
                      </span>
                    )}
                  </div>

                  <div className="admin-col-cat">
                    <span className="admin-cat-pill">{t.categoryLabel}</span>
                  </div>

                  <div className="admin-col-status">
                    <span className={`admin-status-badge ${t.status.toLowerCase()}`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="admin-col-date">
                    {new Date(t.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>

                  <div className="admin-col-action">
                    <button
                      type="button"
                      className="admin-review-btn"
                      onClick={() => handleOpenTicket(t)}
                    >
                      <i className="fas fa-sliders-h"></i>
                      <span>Adjudicate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="admin-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-header-left">
                <div className="admin-modal-meta">
                  <span className="admin-modal-id">#{selectedTicket.ticketNumber}</span>
                  <span className={`admin-priority-badge ${selectedTicket.priority.toLowerCase()}`}>
                    {selectedTicket.priority} Priority
                  </span>
                  <span className={`admin-status-badge ${selectedTicket.status.toLowerCase()}`}>
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                </div>
                <h2 className="admin-modal-title">{selectedTicket.subject}</h2>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedTicket(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="admin-modal-grid">
              <div className="admin-dossier-column">
                <div className="admin-dossier-box">
                  <div className="admin-dossier-header">
                    <i className="fas fa-user-shield"></i>
                    <h4>Complainant Statement</h4>
                  </div>
                  <div className="admin-complainant-meta">
                    <strong>{selectedTicket.creatorName}</strong>
                    <span className={`admin-role-tag ${selectedTicket.creatorRole.toLowerCase()}`}>
                      {selectedTicket.creatorRole}
                    </span>
                  </div>
                  <p className="admin-statement-body">{selectedTicket.description}</p>
                </div>

                {selectedTicket.bookingNumber && (
                  <div className="admin-dossier-box">
                    <div className="admin-dossier-header">
                      <i className="fas fa-receipt"></i>
                      <h4>Attached Booking Dossier</h4>
                    </div>
                    <div className="admin-booking-card">
                      <div className="admin-bc-row">
                        <span className="admin-bc-label">Booking Reference</span>
                        <strong className="admin-bc-val">#{selectedTicket.bookingNumber}</strong>
                      </div>
                      <div className="admin-bc-row">
                        <span className="admin-bc-label">Service Title</span>
                        <span className="admin-bc-val">{selectedTicket.serviceTitle || "Service Job"}</span>
                      </div>
                      {selectedTicket.counterpartyName && (
                        <div className="admin-bc-row">
                          <span className="admin-bc-label">Counterparty</span>
                          <span className="admin-bc-val">{selectedTicket.counterpartyName}</span>
                        </div>
                      )}
                      <div className="admin-bc-row">
                        <span className="admin-bc-label">Dispute Category</span>
                        <span className="admin-bc-val highlight">{selectedTicket.categoryLabel}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTicket.resolutionNote && (
                  <div className="admin-resolution-callout">
                    <div className="admin-rc-title">
                      <i className="fas fa-check-circle"></i>
                      <span>Official Resolution Decision</span>
                    </div>
                    <p className="admin-rc-note">{selectedTicket.resolutionNote}</p>
                    {selectedTicket.settlementDecision && (
                      <div className="admin-rc-decision">
                        <strong>Action: </strong>
                        <span>{selectedTicket.settlementDecision.replace(/_/g, " ")}</span>
                        {selectedTicket.settlementDetails && ` · ${selectedTicket.settlementDetails}`}
                      </div>
                    )}
                  </div>
                )}

                <div className="admin-thread-box">
                  <div className="admin-dossier-header">
                    <i className="fas fa-comments"></i>
                    <h4>Case Activity & Communications ({selectedTicket.messages.length})</h4>
                  </div>

                  <div className="admin-thread-messages">
                    {selectedTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`admin-msg-card ${m.authorRole.toLowerCase()}`}
                      >
                        <div className="admin-msg-top">
                          <strong>{m.authorName}</strong>
                          <span className={`admin-role-tag ${m.authorRole.toLowerCase()}`}>
                            {m.authorRole}
                          </span>
                          <span className="admin-msg-time">
                            {new Date(m.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <p className="admin-msg-text">{m.message}</p>
                      </div>
                    ))}
                  </div>

                  {selectedTicket.status !== "CLOSED" && (
                    <div className="admin-reply-box">
                      <textarea
                        rows={2}
                        className="admin-reply-textarea"
                        placeholder="Type instruction, evidence request, or mediator update..."
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                      />
                      <div className="admin-reply-actions">
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          disabled={!adminReply.trim()}
                          onClick={handleSendAdminReply}
                        >
                          <i className="fas fa-paper-plane"></i>
                          <span>Post Mediator Note</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-control-column">
                <div className="admin-control-card">
                  <div className="admin-cc-header">
                    <i className="fas fa-balance-scale"></i>
                    <h4>Adjudication & Settlement</h4>
                  </div>

                  {selectedTicket.status === "OPEN" && (
                    <div className="admin-action-row">
                      <button
                        type="button"
                        className="admin-start-investigation-btn"
                        onClick={handleStartReview}
                      >
                        <i className="fas fa-search"></i>
                        <span>Start Formal Investigation</span>
                      </button>
                    </div>
                  )}

                  <div className="admin-decision-section">
                    <label className="admin-control-label">Select Settlement Action</label>
                    <div className="admin-decision-options">
                      <label
                        className={`admin-decision-option ${settlementDecision === "FULL_REFUND_CUSTOMER" ? "chosen" : ""}`}
                      >
                        <input
                          type="radio"
                          name="settlementDecision"
                          value="FULL_REFUND_CUSTOMER"
                          checked={settlementDecision === "FULL_REFUND_CUSTOMER"}
                          onChange={() => setSettlementDecision("FULL_REFUND_CUSTOMER")}
                        />
                        <div className="admin-do-text">
                          <strong>100% Refund to Customer</strong>
                          <span>Return full escrow advance (Provider default / no-show)</span>
                        </div>
                      </label>

                      <label
                        className={`admin-decision-option ${settlementDecision === "FULL_PAYOUT_PROVIDER" ? "chosen" : ""}`}
                      >
                        <input
                          type="radio"
                          name="settlementDecision"
                          value="FULL_PAYOUT_PROVIDER"
                          checked={settlementDecision === "FULL_PAYOUT_PROVIDER"}
                          onChange={() => setSettlementDecision("FULL_PAYOUT_PROVIDER")}
                        />
                        <div className="admin-do-text">
                          <strong>Release Escrow to Provider</strong>
                          <span>Verify service completion and credit provider earnings</span>
                        </div>
                      </label>

                      <label
                        className={`admin-decision-option ${settlementDecision === "SPLIT_SETTLEMENT" ? "chosen" : ""}`}
                      >
                        <input
                          type="radio"
                          name="settlementDecision"
                          value="SPLIT_SETTLEMENT"
                          checked={settlementDecision === "SPLIT_SETTLEMENT"}
                          onChange={() => setSettlementDecision("SPLIT_SETTLEMENT")}
                        />
                        <div className="admin-do-text">
                          <strong>Split Settlement</strong>
                          <span>Pro-rate funds between labor performed and customer refund</span>
                        </div>
                      </label>

                      {settlementDecision === "SPLIT_SETTLEMENT" && (
                        <div className="admin-split-inputs">
                          <input
                            type="number"
                            placeholder="Customer Refund (₹)"
                            value={customSplitCustomer}
                            onChange={(e) => setCustomSplitCustomer(e.target.value)}
                          />
                          <input
                            type="number"
                            placeholder="Provider Payout (₹)"
                            value={customSplitProvider}
                            onChange={(e) => setCustomSplitProvider(e.target.value)}
                          />
                        </div>
                      )}

                      <label
                        className={`admin-decision-option ${settlementDecision === "NO_FINANCIAL_ACTION" ? "chosen" : ""}`}
                      >
                        <input
                          type="radio"
                          name="settlementDecision"
                          value="NO_FINANCIAL_ACTION"
                          checked={settlementDecision === "NO_FINANCIAL_ACTION"}
                          onChange={() => setSettlementDecision("NO_FINANCIAL_ACTION")}
                        />
                        <div className="admin-do-text">
                          <strong>Advisory Only / No Financial Transfer</strong>
                          <span>General inquiry or mutual cancellation without penalties</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="admin-decision-section">
                    <label className="admin-control-label">Official Resolution Note *</label>
                    <textarea
                      rows={4}
                      className="admin-resolution-textarea"
                      placeholder="Explain the mediation ruling, evidence reviewed, and wallet credit instructions..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    />
                  </div>

                  <div className="admin-decision-actions">
                    <button
                      type="button"
                      className="admin-resolve-btn"
                      disabled={!resolutionNote.trim()}
                      onClick={handleExecuteResolution}
                    >
                      <i className="fas fa-check-circle"></i>
                      <span>Execute & Resolve Case</span>
                    </button>

                    {selectedTicket.status === "RESOLVED" && (
                      <button
                        type="button"
                        className="admin-close-btn"
                        onClick={handleCloseTicket}
                      >
                        <i className="fas fa-archive"></i>
                        <span>Archive & Close Ticket</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
