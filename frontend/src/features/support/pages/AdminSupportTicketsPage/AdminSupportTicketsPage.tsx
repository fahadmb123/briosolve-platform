import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Modal } from "../../../../shared/components/ui/Modal";
import { useSupportStore } from "../../stores/support.store";
import type { SupportTicket } from "../../types/support.types";
import "./AdminSupportTicketsPage.css";

export const AdminSupportTicketsPage: React.FC = () => {
  const tickets = useSupportStore((state) => state.tickets || []);
  const updateTicketStatus = useSupportStore((state) => state.updateTicketStatus);
  const resolveTicket = useSupportStore((state) => state.resolveTicket);
  const addTicketMessage = useSupportStore((state) => state.addTicketMessage);

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const [adminReply, setAdminReply] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [settlementDecision, setSettlementDecision] = useState<
    "FULL_REFUND_CUSTOMER" | "FULL_PAYOUT_PROVIDER" | "SPLIT_SETTLEMENT" | "NO_FINANCIAL_ACTION"
  >("FULL_REFUND_CUSTOMER");
  const [splitCustomerAmount, setSplitCustomerAmount] = useState("600");
  const [splitProviderAmount, setSplitProviderAmount] = useState("550");
  const [isResolving, setIsResolving] = useState(false);

  const filteredTickets = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    return list.filter((t) => {
      const matchStatus = !statusFilter || t.status === statusFilter;
      const matchCategory = !categoryFilter || t.category === categoryFilter;
      const matchPriority = !priorityFilter || t.priority === priorityFilter;

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.creatorName?.toLowerCase().includes(q) ||
        (t.bookingNumber && t.bookingNumber.toLowerCase().includes(q));

      return matchStatus && matchCategory && matchPriority && matchSearch;
    });
  }, [tickets, statusFilter, categoryFilter, priorityFilter, search]);

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setResolutionNote(ticket.resolutionNote || "");
    setSettlementDecision(ticket.settlementDecision || "FULL_REFUND_CUSTOMER");
    setAdminReply("");
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    setAdminReply("");
    setResolutionNote("");
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setPriorityFilter("");
  };

  const handleStartReview = () => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, "UNDER_REVIEW");
    addTicketMessage(
      selectedTicket.id,
      "Administrator has placed this dispute under active review. Escrow disbursement is locked.",
      "Support Resolution Desk",
      "SYSTEM"
    );
    setSelectedTicket((prev) =>
      prev ? { ...prev, status: "UNDER_REVIEW", updatedAt: new Date().toISOString() } : null
    );
    toast.success("Case marked as Under Investigation.");
  };

  const handleSendReply = () => {
    if (!adminReply.trim() || !selectedTicket) return;
    addTicketMessage(selectedTicket.id, adminReply.trim(), "Support Administrator", "ADMIN");
    setAdminReply("");
    const updated = (useSupportStore.getState().tickets || []).find((t) => t.id === selectedTicket.id);
    if (updated) setSelectedTicket(updated);
    toast.success("Message posted to case thread.");
  };

  const handleExecuteResolution = () => {
    if (!selectedTicket) return;
    if (!resolutionNote.trim()) {
      toast.error("Please enter a resolution note.");
      return;
    }

    setIsResolving(true);
    setTimeout(() => {
      let custAmt = 0;
      let provAmt = 0;
      let details = "";

      if (settlementDecision === "FULL_REFUND_CUSTOMER") {
        custAmt = 1150;
        details = "100% Escrow refund credited to Customer Wallet (₹1,150.00)";
      } else if (settlementDecision === "FULL_PAYOUT_PROVIDER") {
        provAmt = 1092.5;
        details = "Escrow net payout released to Provider Wallet (₹1,092.50 net of 5% fee)";
      } else if (settlementDecision === "SPLIT_SETTLEMENT") {
        custAmt = Number(splitCustomerAmount) || 600;
        provAmt = Number(splitProviderAmount) || 550;
        details = `Split: Customer Refund ₹${custAmt} | Provider Payout ₹${provAmt}`;
      } else {
        details = "Advisory resolution issued without financial transfers.";
      }

      const receipt = {
        txnId: `ESCROW-TXN-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        type: settlementDecision,
        customerAmount: custAmt,
        providerAmount: provAmt,
        feeAmount: 57.5,
        ledgerNote: resolutionNote.trim(),
      };

      resolveTicket(selectedTicket.id, resolutionNote.trim(), settlementDecision, details, receipt);
      setIsResolving(false);
      handleCloseModal();
      toast.success("Case resolved and settlement executed successfully!");
    }, 400);
  };

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case "URGENT":
        return "badge-danger-alert";
      case "HIGH":
        return "badge-pending";
      case "LOW":
        return "badge-neutral";
      default:
        return "badge-admin";
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case "RESOLVED":
      case "CLOSED":
        return "badge-verified";
      case "UNDER_REVIEW":
        return "badge-pending";
      default:
        return "badge-danger-alert";
    }
  };

  return (
    <div className="app-content">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div>
          <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: "2rem" }}>
            Support & Disputes
          </h1>
          <p className="text-secondary text-sm mb-0">
            Review customer and provider dispute tickets, investigate evidence, and execute escrow settlements.
          </p>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search ticket #, complainant, booking #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filters-group">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="PROVIDER_NO_SHOW">Provider No-Show</option>
            <option value="POOR_WORKMANSHIP">Quality / Incomplete Work</option>
            <option value="PAYMENT_REFUND">Payment & Escrow Discrepancy</option>
            <option value="CUSTOMER_ABSENT">Customer Absent / Unreachable</option>
            <option value="SCOPE_DISPUTE">Scope Discrepancy</option>
            <option value="SAFETY_CONDUCT">Safety / Conduct Violation</option>
            <option value="GENERAL_INQUIRY">General Inquiry</option>
          </select>

          <select
            className="admin-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button className="btn btn-secondary text-xs py-2" onClick={handleResetFilters}>
            <i className="fas fa-undo mr-1"></i>Reset
          </button>
        </div>
      </div>

      <div className="admin-table-card" style={{ position: "relative", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Ticket & Priority</th>
                <th style={{ width: "18%" }}>Complainant</th>
                <th style={{ width: "26%" }}>Subject / Linked Booking</th>
                <th style={{ width: "14%" }}>Category</th>
                <th style={{ width: "12%" }}>Status</th>
                <th className="text-right" style={{ width: "14%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-secondary">
                    <i className="fas fa-inbox text-2xl mb-2 block"></i>
                    No support tickets found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold">#{t.ticketNumber}</strong>
                        <span className={`badge ${getPriorityBadgeClass(t.priority)} text-xs`}>
                          {t.priority}
                        </span>
                      </div>
                      <span className="text-xs text-secondary block mt-0.5">
                        {new Date(t.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td>
                      <strong className="text-sm block">{t.creatorName}</strong>
                      <span className="badge badge-admin text-xs mt-0.5">
                        {t.creatorRole}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm font-medium">{t.subject}</div>
                      {t.bookingNumber && (
                        <span className="text-xs text-primary inline-flex items-center gap-1 mt-0.5">
                          <i className="fas fa-calendar-check"></i> #{t.bookingNumber}
                          {t.serviceTitle && ` · ${t.serviceTitle}`}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="text-xs font-medium text-secondary">
                        {t.categoryLabel || t.category}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(t.status)} text-xs`}>
                        {(t.status || "OPEN").replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-warning text-xs py-1.5 px-3"
                        onClick={() => handleOpenTicket(t)}
                      >
                        <i className="fas fa-eye mr-1"></i>Review Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={handleCloseModal}
          title={`Review Dispute: #${selectedTicket.ticketNumber}`}
          icon="fas fa-clipboard-check"
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div>
                {selectedTicket.status === "OPEN" && (
                  <button
                    type="button"
                    className="btn btn-secondary text-xs"
                    onClick={handleStartReview}
                  >
                    <i className="fas fa-search mr-1"></i>Start Formal Review
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary text-xs"
                  disabled={isResolving || !resolutionNote.trim()}
                  onClick={handleExecuteResolution}
                >
                  {isResolving ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-1"></i>Executing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle mr-1"></i>Resolve & Execute
                    </>
                  )}
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-surface-elevated border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <strong>{selectedTicket.creatorName}</strong>
                  <span className="badge badge-admin text-xs">{selectedTicket.creatorRole}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${getPriorityBadgeClass(selectedTicket.priority)} text-xs`}>
                    {selectedTicket.priority}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(selectedTicket.status)} text-xs`}>
                    {(selectedTicket.status || "OPEN").replace("_", " ")}
                  </span>
                </div>
              </div>
              <p className="text-secondary mb-0 leading-relaxed">{selectedTicket.description}</p>
            </div>

            {selectedTicket.bookingNumber && (
              <div className="p-3 rounded-lg bg-surface-elevated border border-border">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-secondary mb-2">
                  <i className="fas fa-receipt mr-1"></i>Linked Booking Dossier
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-secondary block">Booking Reference:</span>
                    <strong>#{selectedTicket.bookingNumber}</strong>
                  </div>
                  <div>
                    <span className="text-secondary block">Service:</span>
                    <strong>{selectedTicket.serviceTitle || "Custom Service"}</strong>
                  </div>
                  {selectedTicket.counterpartyName && (
                    <div>
                      <span className="text-secondary block">Counterparty:</span>
                      <strong>{selectedTicket.counterpartyName}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-secondary block">Escrow Protection:</span>
                    <strong className="text-warning">LOCKED IN ESCROW (₹1,150.00)</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-surface-elevated border border-border">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-secondary mb-2">
                <i className="fas fa-comments mr-1"></i>Case Messages ({(selectedTicket.messages || []).length})
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1 mb-3">
                {(selectedTicket.messages || []).map((m) => (
                  <div key={m.id} className="p-2 rounded bg-surface border border-border text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-text">{m.authorName}</strong>
                      <span className="text-secondary text-[11px]">
                        {new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-secondary mb-0">{m.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-1 flex-wrap mb-2">
                <button
                  type="button"
                  className="btn btn-secondary text-[11px] py-1 px-2"
                  onClick={() => setAdminReply("Please submit clear photo evidence of the incomplete work.")}
                >
                  <i className="fas fa-camera mr-1"></i>Request Photos
                </button>
                <button
                  type="button"
                  className="btn btn-secondary text-[11px] py-1 px-2"
                  onClick={() => setAdminReply("Provider: Please provide proof of arrival timestamp.")}
                >
                  <i className="fas fa-map-marker-alt mr-1"></i>Arrival Proof
                </button>
                <button
                  type="button"
                  className="btn btn-secondary text-[11px] py-1 px-2"
                  onClick={() => setAdminReply("Both parties must respond within 12 hours before final ruling.")}
                >
                  <i className="fas fa-clock mr-1"></i>12h Notice
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="admin-input flex-1 text-xs"
                  placeholder="Post mediator note or evidence request..."
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary text-xs px-3"
                  disabled={!adminReply.trim()}
                  onClick={handleSendReply}
                >
                  Send
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-secondary mb-2">
                <i className="fas fa-balance-scale mr-1"></i>Escrow Settlement Decision
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="settlement"
                    value="FULL_REFUND_CUSTOMER"
                    checked={settlementDecision === "FULL_REFUND_CUSTOMER"}
                    onChange={() => setSettlementDecision("FULL_REFUND_CUSTOMER")}
                  />
                  <span>
                    <strong>100% Refund to Customer</strong> (₹1,150 back to customer wallet)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="settlement"
                    value="FULL_PAYOUT_PROVIDER"
                    checked={settlementDecision === "FULL_PAYOUT_PROVIDER"}
                    onChange={() => setSettlementDecision("FULL_PAYOUT_PROVIDER")}
                  />
                  <span>
                    <strong>Release Escrow to Provider</strong> (₹1,092.50 net payout)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="settlement"
                    value="SPLIT_SETTLEMENT"
                    checked={settlementDecision === "SPLIT_SETTLEMENT"}
                    onChange={() => setSettlementDecision("SPLIT_SETTLEMENT")}
                  />
                  <span>
                    <strong>Split Pro-Rate</strong> (Customer refund + Provider labor payout)
                  </span>
                </label>

                {settlementDecision === "SPLIT_SETTLEMENT" && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      className="admin-input flex-1 text-xs"
                      placeholder="Customer Refund (₹)"
                      value={splitCustomerAmount}
                      onChange={(e) => setSplitCustomerAmount(e.target.value)}
                    />
                    <input
                      type="number"
                      className="admin-input flex-1 text-xs"
                      placeholder="Provider Payout (₹)"
                      value={splitProviderAmount}
                      onChange={(e) => setSplitProviderAmount(e.target.value)}
                    />
                  </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="radio"
                    name="settlement"
                    value="NO_FINANCIAL_ACTION"
                    checked={settlementDecision === "NO_FINANCIAL_ACTION"}
                    onChange={() => setSettlementDecision("NO_FINANCIAL_ACTION")}
                  />
                  <span>
                    <strong>Advisory Only</strong> (Guidance note without escrow transfer)
                  </span>
                </label>
              </div>

              <div className="mt-3">
                <label className="text-xs font-semibold text-secondary block mb-1">
                  Official Ruling Note *
                </label>
                <textarea
                  rows={2}
                  className="admin-input w-full text-xs"
                  placeholder="Explain mediation ruling and findings..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSupportTicketsPage;
