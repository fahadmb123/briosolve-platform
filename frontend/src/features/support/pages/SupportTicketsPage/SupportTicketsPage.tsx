import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetCustomerBookings, useGetProviderBookings } from "../../../bookings/hooks/useBookingMutations";
import { useSupportStore } from "../../stores/support.store";
import type { SupportTicket } from "../../types/support.types";
import "./SupportTicketsPage.css";

type ConcernType = "BOOKING" | "GENERAL";

interface MappedBookingItem {
  id: string;
  bookingNumber: string;
  serviceTitle: string;
  totalAmount: number;
  status: string;
}

export const SupportTicketsPage: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isProvider = location.pathname.startsWith("/provider") || user?.role === "PROVIDER";

  const customerBookingsQuery = useGetCustomerBookings(undefined, { enabled: !isProvider });
  const providerBookingsQuery = useGetProviderBookings(undefined, { enabled: isProvider });

  const activeBookings = useMemo<MappedBookingItem[]>(() => {
    const rawList: any[] = isProvider
      ? providerBookingsQuery.data?.data?.bookings || []
      : customerBookingsQuery.data?.data?.bookings || [];

    return rawList.map((b: any): MappedBookingItem => ({
      id: b.booking?.id || b.id,
      bookingNumber: b.booking?.booking_number || b.bookingNumber,
      serviceTitle: b.serviceRequestTitle || b.booking?.service_request?.title || "Service Job",
      totalAmount: Number(b.booking?.total_amount || b.totalAmount || 0),
      status: b.booking?.status || b.status
    }));
  }, [isProvider, customerBookingsQuery.data, providerBookingsQuery.data]);

  const allTickets = useSupportStore((state) => state.tickets || []);
  const addTicketToStore = useSupportStore((state) => state.addTicket);
  const addTicketMessage = useSupportStore((state) => state.addTicketMessage);

  const [activeTab, setActiveTab] = useState<"MY_TICKETS" | "NEW_TICKET">("MY_TICKETS");
  const [ticketFilter, setTicketFilter] = useState<"ALL" | "ACTIVE" | "RESOLVED">("ALL");
  const [ticketSearch, setTicketSearch] = useState<string>("");
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);

  const tickets = useMemo(() => {
    return allTickets.filter((t) => {
      const isRoleMatch = isProvider ? t.creatorRole === "PROVIDER" : t.creatorRole === "CUSTOMER";
      const isStatusMatch =
        ticketFilter === "ALL" ||
        (ticketFilter === "ACTIVE" && (t.status === "OPEN" || t.status === "UNDER_REVIEW")) ||
        (ticketFilter === "RESOLVED" && (t.status === "RESOLVED" || t.status === "CLOSED"));

      const q = ticketSearch.toLowerCase().trim();
      const isSearchMatch =
        !q ||
        t.ticketNumber?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        (t.bookingNumber && t.bookingNumber.toLowerCase().includes(q)) ||
        (t.serviceTitle && t.serviceTitle.toLowerCase().includes(q));

      return isRoleMatch && isStatusMatch && isSearchMatch;
    });
  }, [allTickets, isProvider, ticketFilter, ticketSearch]);

  const [concernType, setConcernType] = useState<ConcernType>("BOOKING");
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [generalTopic, setGeneralTopic] = useState<string>("Wallet & Payouts");
  const [issueReason, setIssueReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

  const selectedBooking = useMemo(
    () => activeBookings.find((b) => b.id === selectedBookingId),
    [activeBookings, selectedBookingId]
  );

  const bookingReasons = isProvider ? [
    "Customer absent at address / Unreachable",
    "Customer refusing remaining balance payment",
    "Customer demanding extra unpaid tasks",
    "Unsafe or inaccessible premises",
    "Emergency cancellation / Schedule conflict",
    "Other booking problem"
  ] : [
    "Technician did not show up on time",
    "Work done is incomplete or unsatisfactory",
    "Technician demanding cash outside app",
    "Dispute over final payment or refund",
    "Safety or unprofessional behavior",
    "Other booking problem"
  ];

  const generalTopics = [
    "Wallet & Payouts",
    "Refund Inquiry",
    "ID & KYC Verification",
    "Account & Login",
    "Technical App Glitch",
    "Feedback / Other"
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      let subjectLine = "";
      let linkedBookingNumber = undefined;
      let linkedServiceTitle = undefined;

      if (concernType === "BOOKING") {
        const found = activeBookings.find((b) => b.id === selectedBookingId);
        linkedBookingNumber = found?.bookingNumber;
        linkedServiceTitle = found?.serviceTitle;
        subjectLine = `${issueReason || "Booking Issue"} (${linkedBookingNumber || "Booking"})`;
      } else {
        subjectLine = `${generalTopic}: Issue Report`;
      }

      const newTicket: SupportTicket = {
        id: `tk-${Date.now()}`,
        ticketNumber: `TK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        creatorId: user?.id || "user",
        creatorName: user?.name || (isProvider ? "Provider" : "Customer"),
        creatorRole: isProvider ? "PROVIDER" : "CUSTOMER",
        bookingNumber: linkedBookingNumber,
        serviceTitle: linkedServiceTitle,
        category: concernType === "BOOKING" ? "PAYMENT_REFUND" : "GENERAL_INQUIRY",
        categoryLabel: concernType === "BOOKING" ? "Booking Dispute" : "Wallet & General Account",
        subject: subjectLine,
        description: description.trim(),
        priority: "HIGH",
        status: "OPEN",
        attachments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg-${Date.now()}`,
            authorName: user?.name || "You",
            authorRole: isProvider ? "PROVIDER" : "CUSTOMER",
            message: description.trim(),
            createdAt: new Date().toISOString()
          }
        ]
      };

      addTicketToStore(newTicket);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setDescription("");
      setIssueReason("");
      setSelectedBookingId("");

      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab("MY_TICKETS");
        setViewTicket(newTicket);
      }, 1000);
    }, 400);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !viewTicket) return;
    addTicketMessage(
      viewTicket.id,
      replyText.trim(),
      user?.name || (isProvider ? "Provider" : "Customer"),
      isProvider ? "PROVIDER" : "CUSTOMER"
    );
    const updated = (useSupportStore.getState().tickets || []).find((t) => t.id === viewTicket.id);
    if (updated) setViewTicket(updated);
    setReplyText("");
  };

  return (
    <div className={`clean-spt-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <div className="clean-spt-header">
        <div>
          <div className="clean-spt-badge">
            <i className="fas fa-headset"></i>
            <span>{isProvider ? "Provider Resolution Center" : "Customer Help Desk"}</span>
          </div>
          <h1 className="clean-spt-title">Help & Resolution Center</h1>
          <p className="clean-spt-subtitle">
            Need assistance or have an issue with an appointment? Submit your concern below.
          </p>
        </div>

        <div className="clean-spt-nav-tabs">
          <button
            type="button"
            className={`clean-nav-tab ${activeTab === "MY_TICKETS" ? "active" : ""}`}
            onClick={() => setActiveTab("MY_TICKETS")}
          >
            <i className="fas fa-ticket-alt"></i>
            <span>My Tickets ({tickets.length})</span>
          </button>
          <button
            type="button"
            className={`clean-nav-tab ${activeTab === "NEW_TICKET" ? "active" : ""}`}
            onClick={() => setActiveTab("NEW_TICKET")}
          >
            <i className="fas fa-plus-circle"></i>
            <span>Raise Concern</span>
          </button>
        </div>
      </div>

      {activeTab === "NEW_TICKET" ? (
        <div className="clean-wizard-layout">
          <div className="clean-ticket-wizard">
            {submitSuccess && (
              <div className="clean-alert-banner success">
                <i className="fas fa-check-circle"></i>
                <span>Ticket created successfully! Redirecting to ticket history...</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="clean-wizard-form">
              <div className="clean-section-block">
                <div className="clean-step-header">
                  <span className="clean-step-badge">Step 1</span>
                  <h3 className="clean-step-title">What is your issue regarding?</h3>
                </div>

                <div className="clean-type-selector">
                  <div
                    className={`clean-type-card ${concernType === "BOOKING" ? "active" : ""}`}
                    onClick={() => setConcernType("BOOKING")}
                  >
                    <div className="clean-type-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="clean-type-text">
                      <strong>A Specific Booking</strong>
                      <span>Technician arrival, quality of work, or payment dispute</span>
                    </div>
                    <div className="clean-radio-dot"></div>
                  </div>

                  <div
                    className={`clean-type-card ${concernType === "GENERAL" ? "active" : ""}`}
                    onClick={() => setConcernType("GENERAL")}
                  >
                    <div className="clean-type-icon">
                      <i className="fas fa-wallet"></i>
                    </div>
                    <div className="clean-type-text">
                      <strong>Wallet & Account</strong>
                      <span>Refunds, payout schedule, login, or general help</span>
                    </div>
                    <div className="clean-radio-dot"></div>
                  </div>
                </div>
              </div>

              <div className="clean-section-block">
                <div className="clean-step-header">
                  <span className="clean-step-badge">Step 2</span>
                  <h3 className="clean-step-title">
                    {concernType === "BOOKING" ? "Select the Booking" : "Select the Topic"}
                  </h3>
                </div>

                {concernType === "BOOKING" ? (
                  <div className="clean-selection-box">
                    {activeBookings.length === 0 ? (
                      <div className="clean-empty-selection">
                        <i className="fas fa-calendar-times"></i>
                        <span>No bookings found on your account.</span>
                      </div>
                    ) : (
                      <div className="clean-items-list">
                        {activeBookings.map((b) => {
                          const isChosen = selectedBookingId === b.id;
                          return (
                            <div
                              key={b.id}
                              className={`clean-item-row ${isChosen ? "chosen" : ""}`}
                              onClick={() => setSelectedBookingId(b.id)}
                            >
                              <div className="clean-item-radio">
                                <i className={isChosen ? "fas fa-check-circle" : "far fa-circle"}></i>
                              </div>
                              <div className="clean-item-info">
                                <div className="clean-item-meta-top">
                                  <span className="clean-item-num">#{b.bookingNumber}</span>
                                  <span className={`clean-item-status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                                </div>
                                <strong className="clean-item-title">{b.serviceTitle}</strong>
                              </div>
                              <div className="clean-item-price-pill">
                                ₹{b.totalAmount.toLocaleString("en-IN")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="clean-pills-row">
                    {generalTopics.map((top) => (
                      <button
                        key={top}
                        type="button"
                        className={`clean-topic-pill ${generalTopic === top ? "active" : ""}`}
                        onClick={() => setGeneralTopic(top)}
                      >
                        {top}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="clean-section-block">
                <div className="clean-step-header">
                  <span className="clean-step-badge">Step 3</span>
                  <h3 className="clean-step-title">Specify the Reason & Details</h3>
                </div>

                {concernType === "BOOKING" && (
                  <div className="clean-reasons-group">
                    <label className="clean-label">What is the primary issue?</label>
                    <div className="clean-chips-wrap">
                      {bookingReasons.map((r) => (
                        <button
                          key={r}
                          type="button"
                          className={`clean-reason-chip ${issueReason === r ? "active" : ""}`}
                          onClick={() => setIssueReason(r)}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="clean-form-group">
                  <label htmlFor="clean-description" className="clean-label">
                    Describe what happened *
                  </label>
                  <textarea
                    id="clean-description"
                    required
                    rows={5}
                    className="clean-textarea"
                    placeholder="Tell us what occurred, timing, or any attempts made to contact the other person..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="clean-wizard-footer">
                <button
                  type="button"
                  className="clean-btn-secondary"
                  onClick={() => setActiveTab("MY_TICKETS")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clean-btn-primary"
                  disabled={isSubmitting || !description.trim() || (concernType === "BOOKING" && !selectedBookingId)}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>Submit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <aside className="clean-wizard-sidebar">
            <div className="clean-sidebar-card">
              <div className="clean-sidebar-card-header">
                <i className="fas fa-clipboard-check"></i>
                <h4>Issue Overview</h4>
              </div>
              <div className="clean-sidebar-summary-body">
                <div className="clean-summary-field">
                  <span className="clean-summary-field-label">Target Category</span>
                  <span className="clean-summary-field-val highlight">
                    {concernType === "BOOKING" ? "Booking Dispute" : "Wallet & Account"}
                  </span>
                </div>

                {concernType === "BOOKING" ? (
                  <div className="clean-summary-field">
                    <span className="clean-summary-field-label">Linked Booking</span>
                    {selectedBooking ? (
                      <div className="clean-summary-linked-card">
                        <div className="clean-slc-num">#{selectedBooking.bookingNumber}</div>
                        <div className="clean-slc-title">{selectedBooking.serviceTitle}</div>
                        <div className="clean-slc-footer">
                          <span className="clean-slc-amount">₹{selectedBooking.totalAmount.toLocaleString("en-IN")}</span>
                          <span className={`clean-item-status-badge ${selectedBooking.status.toLowerCase()}`}>{selectedBooking.status}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="clean-summary-placeholder-text">
                        <i className="far fa-hand-pointer"></i> Please select a booking in Step 2
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="clean-summary-field">
                    <span className="clean-summary-field-label">Topic</span>
                    <span className="clean-summary-field-val">{generalTopic}</span>
                  </div>
                )}

                {concernType === "BOOKING" && issueReason && (
                  <div className="clean-summary-field">
                    <span className="clean-summary-field-label">Primary Issue</span>
                    <span className="clean-summary-reason-tag">{issueReason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="clean-sidebar-card guarantee-card">
              <div className="clean-sidebar-card-header">
                <i className="fas fa-shield-alt"></i>
                <h4>Resolution & Trust</h4>
              </div>
              <ul className="clean-guarantee-list">
                <li>
                  <div className="clean-gl-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="clean-gl-text">
                    <strong>Escrow Protected</strong>
                    <p>Booking funds stay locked in escrow until the dispute is resolved.</p>
                  </div>
                </li>
                <li>
                  <div className="clean-gl-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div className="clean-gl-text">
                    <strong>2 to 4 Hr Response</strong>
                    <p>Dedicated dispute agents investigate and review evidence swiftly.</p>
                  </div>
                </li>
                <li>
                  <div className="clean-gl-icon">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <div className="clean-gl-text">
                    <strong>Fair Mediation</strong>
                    <p>Unbiased evaluation of service terms, chats, and job agreements.</p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      ) : (
        <div className="clean-tickets-list-wrap">
          <div className="clean-tickets-toolbar">
            <div className="clean-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search ticket #, subject, or booking #..."
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
              />
            </div>

            <div className="clean-filter-pills">
              <button
                type="button"
                className={`clean-filter-pill ${ticketFilter === "ALL" ? "active" : ""}`}
                onClick={() => setTicketFilter("ALL")}
              >
                All
              </button>
              <button
                type="button"
                className={`clean-filter-pill ${ticketFilter === "ACTIVE" ? "active" : ""}`}
                onClick={() => setTicketFilter("ACTIVE")}
              >
                Active
              </button>
              <button
                type="button"
                className={`clean-filter-pill ${ticketFilter === "RESOLVED" ? "active" : ""}`}
                onClick={() => setTicketFilter("RESOLVED")}
              >
                Resolved
              </button>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div className="clean-empty-state">
              <div className="clean-empty-icon">
                <i className="fas fa-inbox"></i>
              </div>
              <h3>No tickets found</h3>
              <p>
                {ticketSearch
                  ? "No support tickets match your search criteria."
                  : "You do not have any open support or dispute tickets."}
              </p>
              <button
                type="button"
                className="clean-btn-primary"
                onClick={() => setActiveTab("NEW_TICKET")}
              >
                <i className="fas fa-plus"></i>
                <span>Raise a Concern</span>
              </button>
            </div>
          ) : (
            <div className="clean-table-responsive">
              <div className="clean-tickets-table-card">
                <div className="clean-table-header">
                  <span>Ticket ID</span>
                  <span>Category</span>
                  <span>Subject</span>
                  <span>Submitted</span>
                  <span>Status</span>
                  <span style={{ textAlign: "right" }}>Action</span>
                </div>
                <div className="clean-table-body">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="clean-table-row">
                      <div className="clean-col-id">
                        <strong>#{ticket.ticketNumber}</strong>
                        {ticket.bookingNumber && (
                          <span className="clean-sub-link">
                            <i className="fas fa-calendar-check"></i> #{ticket.bookingNumber}
                          </span>
                        )}
                      </div>
                      <div className="clean-col-cat">
                        <span className="clean-cat-tag">{ticket.categoryLabel}</span>
                      </div>
                      <div className="clean-col-subject">
                        <strong>{ticket.subject}</strong>
                        <p>{ticket.description}</p>
                      </div>
                      <div className="clean-col-date">
                        {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </div>
                      <div className="clean-col-status">
                        <span className={`clean-status-badge ${ticket.status.toLowerCase()}`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="clean-col-action" style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="clean-view-btn"
                          onClick={() => setViewTicket(ticket)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewTicket && (
        <div className="clean-modal-overlay" onClick={() => setViewTicket(null)}>
          <div className="clean-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="clean-modal-header">
              <div>
                <div className="clean-modal-top-row">
                  <span className="clean-modal-id">#{viewTicket.ticketNumber}</span>
                  <span className={`clean-status-badge ${viewTicket.status.toLowerCase()}`}>
                    {viewTicket.status.replace("_", " ")}
                  </span>
                </div>
                <h2 className="clean-modal-title">{viewTicket.subject}</h2>
              </div>
              <button
                type="button"
                className="clean-modal-close"
                onClick={() => setViewTicket(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="clean-modal-body">
              <div className="clean-ticket-stepper">
                <div className="clean-stepper-step completed">
                  <div className="clean-step-circle">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>1. Submitted</span>
                </div>
                <div className={`clean-stepper-line ${viewTicket.status !== "OPEN" ? "completed" : ""}`}></div>
                <div className={`clean-stepper-step ${viewTicket.status === "UNDER_REVIEW" ? "active" : viewTicket.status === "RESOLVED" || viewTicket.status === "CLOSED" ? "completed" : ""}`}>
                  <div className="clean-step-circle">
                    {viewTicket.status === "RESOLVED" || viewTicket.status === "CLOSED" ? <i className="fas fa-check"></i> : <span>2</span>}
                  </div>
                  <span>2. Under Review</span>
                </div>
                <div className={`clean-stepper-line ${viewTicket.status === "RESOLVED" || viewTicket.status === "CLOSED" ? "completed" : ""}`}></div>
                <div className={`clean-stepper-step ${viewTicket.status === "RESOLVED" || viewTicket.status === "CLOSED" ? "completed" : ""}`}>
                  <div className="clean-step-circle">
                    {viewTicket.status === "RESOLVED" || viewTicket.status === "CLOSED" ? <i className="fas fa-check"></i> : <span>3</span>}
                  </div>
                  <span>3. Resolved</span>
                </div>
              </div>

              {viewTicket.bookingNumber && (
                <div className="clean-booking-pill-bar">
                  <i className="fas fa-calendar-check"></i>
                  <strong>Booking Reference:</strong> #{viewTicket.bookingNumber}
                  {viewTicket.serviceTitle && <span> · {viewTicket.serviceTitle}</span>}
                </div>
              )}

              <div className="clean-dossier-box">
                <span className="clean-dossier-label">Your Statement</span>
                <p className="clean-dossier-content">{viewTicket.description}</p>
              </div>

              {viewTicket.resolutionNote && (
                <div className="clean-resolution-box">
                  <div className="clean-rb-title">
                    <i className="fas fa-check-circle"></i>
                    <span>Official Resolution Ruling</span>
                  </div>
                  <p className="clean-rb-text">{viewTicket.resolutionNote}</p>
                  {viewTicket.settlementDetails && (
                    <span className="clean-settlement-tag">
                      <i className="fas fa-wallet mr-1"></i> {viewTicket.settlementDetails}
                    </span>
                  )}
                </div>
              )}

              <div className="clean-messages-thread">
                <div className="clean-dossier-label">
                  <i className="fas fa-comments"></i> Case Activity ({(viewTicket.messages || []).length})
                </div>

                <div className="clean-msgs-list">
                  {(viewTicket.messages || []).map((msg) => {
                    const isAdmin = msg.authorRole === "ADMIN" || msg.authorRole === "SYSTEM";
                    return (
                      <div
                        key={msg.id}
                        className={`clean-msg-card ${isAdmin ? "admin" : "user"}`}
                      >
                        <div className="clean-msg-top">
                          <strong>{msg.authorName}</strong>
                          <span className="clean-msg-role">
                            {isAdmin ? "Support Desk" : msg.authorRole}
                          </span>
                          <span className="clean-msg-time">
                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <p className="clean-msg-text">{msg.message}</p>
                      </div>
                    );
                  })}
                </div>

                {viewTicket.status !== "RESOLVED" && viewTicket.status !== "CLOSED" && (
                  <div className="clean-reply-wrap">
                    <textarea
                      rows={2}
                      className="clean-textarea"
                      placeholder="Add an update or response to support..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="clean-reply-footer">
                      <button
                        type="button"
                        className="clean-btn-primary"
                        disabled={!replyText.trim()}
                        onClick={handleSendReply}
                      >
                        <i className="fas fa-paper-plane"></i>
                        <span>Send Message</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
