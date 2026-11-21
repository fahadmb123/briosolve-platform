import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetCustomerBookings, useGetProviderBookings } from "../../../bookings/hooks/useBookingMutations";
import { useGetMyServiceRequests, useGetProviderServiceRequests } from "../../../service-requests/hooks/useServiceRequestMutations";
import type { SupportTicket } from "../../types/support.types";
import "./SupportTicketsPage.css";

type ConcernType = "BOOKING" | "REQUEST" | "GENERAL";

interface MappedBookingItem {
  id: string;
  bookingNumber: string;
  serviceTitle: string;
  totalAmount: number;
  status: string;
}

interface MappedRequestItem {
  id: string;
  title: string;
  category: string;
  status: string;
}

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
    categoryLabel: "Payment & Escrow Discrepancy",
    subject: "Remaining balance and platform fee clarification",
    description: "I noticed the platform fee breakdown calculation on the balance settlement needed review. I wanted to verify the exact wallet credit.",
    priority: "MEDIUM",
    status: "RESOLVED",
    attachments: [],
    createdAt: "2026-11-21T18:30:00.000Z",
    updatedAt: "2026-11-21T19:00:00.000Z",
    resolutionNote: "Escrow breakdown reviewed. Provider payout is verified net of the 5% platform fee with full wallet credit.",
    messages: [
      {
        id: "m-1",
        authorName: "Support Agent",
        authorRole: "ADMIN",
        message: "Hello! We reviewed the case. The 5% fee is calculated on base service value, and net earnings are credited upon customer settlement.",
        createdAt: "2026-11-21T18:45:00.000Z"
      }
    ]
  }
];

export const SupportTicketsPage: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isProvider = location.pathname.startsWith("/provider") || user?.role === "PROVIDER";

  const customerBookingsQuery = useGetCustomerBookings(undefined, { enabled: !isProvider });
  const providerBookingsQuery = useGetProviderBookings(undefined, { enabled: isProvider });

  const customerRequestsQuery = useGetMyServiceRequests();
  const providerRequestsQuery = useGetProviderServiceRequests();

  const activeBookings = useMemo<MappedBookingItem[]>(() => {
    const rawList: any[] = isProvider
      ? providerBookingsQuery.data?.data?.bookings || []
      : customerBookingsQuery.data?.data?.bookings || [];

    return rawList.map((b: any): MappedBookingItem => ({
      id: b.booking?.id || b.id,
      bookingNumber: b.booking?.booking_number || b.bookingNumber,
      serviceTitle: b.serviceRequestTitle || b.booking?.service_request?.title || "Service",
      totalAmount: Number(b.booking?.total_amount || b.totalAmount || 0),
      status: b.booking?.status || b.status
    }));
  }, [isProvider, customerBookingsQuery.data, providerBookingsQuery.data]);

  const activeRequests = useMemo<MappedRequestItem[]>(() => {
    const rawList: any[] = isProvider
      ? providerRequestsQuery.data?.data?.requests || []
      : customerRequestsQuery.data?.data?.requests || [];

    return rawList.map((r: any): MappedRequestItem => ({
      id: r.id,
      title: r.title,
      category: r.category?.name || "General Service",
      status: r.status
    }));
  }, [isProvider, customerRequestsQuery.data, providerRequestsQuery.data]);

  const [activeTab, setActiveTab] = useState<"MY_TICKETS" | "NEW_TICKET">("MY_TICKETS");
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_MOCK_TICKETS);
  const [viewTicket, setViewTicket] = useState<SupportTicket | null>(null);

  const [concernType, setConcernType] = useState<ConcernType>("BOOKING");
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [generalTopic, setGeneralTopic] = useState<string>("Wallet & Payouts");
  const [issueReason, setIssueReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");

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

  const requestReasons = [
    "Quotation amount discrepancy",
    "Unable to receive or review quotes",
    "Provider canceled agreed quotation",
    "Need to cancel or edit service request",
    "Other request question"
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
      } else if (concernType === "REQUEST") {
        const found = activeRequests.find((r) => r.id === selectedRequestId);
        subjectLine = `${issueReason || "Request Issue"} - ${found?.title || "Service Request"}`;
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
        category: "GENERAL_INQUIRY",
        categoryLabel: concernType === "BOOKING" ? "Booking Dispute" : concernType === "REQUEST" ? "Request Inquiry" : "General Support",
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

      setTickets([newTicket, ...tickets]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setDescription("");
      setIssueReason("");
      setSelectedBookingId("");
      setSelectedRequestId("");

      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab("MY_TICKETS");
        setViewTicket(newTicket);
      }, 1000);
    }, 400);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !viewTicket) return;

    const newMsg = {
      id: `reply-${Date.now()}`,
      authorName: user?.name || "You",
      authorRole: (isProvider ? "PROVIDER" : "CUSTOMER") as any,
      message: replyText.trim(),
      createdAt: new Date().toISOString()
    };

    const updated = {
      ...viewTicket,
      updatedAt: new Date().toISOString(),
      messages: [...viewTicket.messages, newMsg]
    };

    setTickets((prev) => prev.map((t) => (t.id === viewTicket.id ? updated : t)));
    setViewTicket(updated);
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
        <div className="clean-ticket-wizard">
          {submitSuccess && (
            <div className="clean-alert-banner success">
              <i className="fas fa-check-circle"></i>
              <span>Ticket created successfully! Redirecting to ticket history...</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="clean-wizard-form">
            <div className="clean-section-block">
              <span className="clean-step-number">Step 1</span>
              <h3 className="clean-step-title">What is your issue regarding?</h3>

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
                  className={`clean-type-card ${concernType === "REQUEST" ? "active" : ""}`}
                  onClick={() => setConcernType("REQUEST")}
                >
                  <div className="clean-type-icon">
                    <i className="fas fa-clipboard-list"></i>
                  </div>
                  <div className="clean-type-text">
                    <strong>A Service Request</strong>
                    <span>Quotations, matching, or request cancellation</span>
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
              <span className="clean-step-number">Step 2</span>
              <h3 className="clean-step-title">
                {concernType === "BOOKING" && "Select the Booking"}
                {concernType === "REQUEST" && "Select the Service Request"}
                {concernType === "GENERAL" && "Select the Topic"}
              </h3>

              {concernType === "BOOKING" && (
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
                              <span className="clean-item-num">#{b.bookingNumber}</span>
                              <strong className="clean-item-title">{b.serviceTitle}</strong>
                              <span className="clean-item-sub">Total: ₹{b.totalAmount.toLocaleString("en-IN")} · Status: {b.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {concernType === "REQUEST" && (
                <div className="clean-selection-box">
                  {activeRequests.length === 0 ? (
                    <div className="clean-empty-selection">
                      <i className="fas fa-folder-open"></i>
                      <span>No service requests found on your account.</span>
                    </div>
                  ) : (
                    <div className="clean-items-list">
                      {activeRequests.map((r) => {
                        const isChosen = selectedRequestId === r.id;
                        return (
                          <div
                            key={r.id}
                            className={`clean-item-row ${isChosen ? "chosen" : ""}`}
                            onClick={() => setSelectedRequestId(r.id)}
                          >
                            <div className="clean-item-radio">
                              <i className={isChosen ? "fas fa-check-circle" : "far fa-circle"}></i>
                            </div>
                            <div className="clean-item-info">
                              <strong className="clean-item-title">{r.title}</strong>
                              <span className="clean-item-sub">Category: {r.category} · Status: {r.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {concernType === "GENERAL" && (
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
              <span className="clean-step-number">Step 3</span>
              <h3 className="clean-step-title">Specify the Reason & Details</h3>

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

              {concernType === "REQUEST" && (
                <div className="clean-reasons-group">
                  <label className="clean-label">What is the problem?</label>
                  <div className="clean-chips-wrap">
                    {requestReasons.map((r) => (
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
                  rows={4}
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
                disabled={isSubmitting || !description.trim()}
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
      ) : (
        <div className="clean-tickets-list-wrap">
          {tickets.length === 0 ? (
            <div className="clean-empty-state">
              <div className="clean-empty-icon">
                <i className="fas fa-ticket-alt"></i>
              </div>
              <h3>No Tickets Yet</h3>
              <p>You have not filed any complaints or concerns. If you experience an issue, click Raise Concern.</p>
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
            <div className="clean-tickets-table-card">
              <div className="clean-table-header">
                <span>Ticket #</span>
                <span>Category</span>
                <span>Subject / Summary</span>
                <span>Status</span>
                <span>Date</span>
                <span>Action</span>
              </div>

              <div className="clean-table-body">
                {tickets.map((t) => (
                  <div key={t.id} className="clean-table-row">
                    <div className="clean-col-id">
                      <strong>#{t.ticketNumber}</strong>
                      {t.bookingNumber && <span className="clean-sub-link">Booking #{t.bookingNumber}</span>}
                    </div>
                    <div className="clean-col-cat">
                      <span className="clean-cat-tag">{t.categoryLabel}</span>
                    </div>
                    <div className="clean-col-subject">
                      <strong>{t.subject}</strong>
                      <p>{t.description}</p>
                    </div>
                    <div className="clean-col-status">
                      <span className={`clean-status-badge ${t.status.toLowerCase()}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="clean-col-date">
                      {new Date(t.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                      })}
                    </div>
                    <div className="clean-col-action">
                      <button
                        type="button"
                        className="clean-view-btn"
                        onClick={() => setViewTicket(t)}
                      >
                        View Ticket
                      </button>
                    </div>
                  </div>
                ))}
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
              {viewTicket.bookingNumber && (
                <div className="clean-booking-pill-bar">
                  <i className="fas fa-calendar-check"></i>
                  <span>Linked to Booking #{viewTicket.bookingNumber}</span>
                  {viewTicket.serviceTitle && <strong>· {viewTicket.serviceTitle}</strong>}
                </div>
              )}

              <div className="clean-dossier-box">
                <label className="clean-dossier-label">Your Statement</label>
                <p className="clean-dossier-content">{viewTicket.description}</p>
              </div>

              {viewTicket.resolutionNote && (
                <div className="clean-resolution-box">
                  <div className="clean-rb-title">
                    <i className="fas fa-check-circle"></i>
                    <span>Resolution Summary</span>
                  </div>
                  <p className="clean-rb-text">{viewTicket.resolutionNote}</p>
                </div>
              )}

              <div className="clean-messages-thread">
                <label className="clean-dossier-label">Activity & Responses</label>
                <div className="clean-msgs-list">
                  {viewTicket.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`clean-msg-card ${m.authorRole === "ADMIN" ? "admin" : "user"}`}
                    >
                      <div className="clean-msg-top">
                        <strong>{m.authorName}</strong>
                        <span className="clean-msg-role">{m.authorRole}</span>
                        <span className="clean-msg-time">
                          {new Date(m.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <p className="clean-msg-text">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {viewTicket.status !== "CLOSED" && (
                <div className="clean-reply-wrap">
                  <textarea
                    rows={3}
                    className="clean-textarea"
                    placeholder="Type an update or reply for the support team..."
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
                      <i className="fas fa-reply"></i>
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
