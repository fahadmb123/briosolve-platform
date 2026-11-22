import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Modal } from "../../../../shared/components/ui/Modal";
import { useGetAdminSupportTickets, useUpdateTicketStatus } from "../../hooks/useSupportTickets";
import type { SupportTicket } from "../../types/support.types";
import { updateTicketStatusSchema, type UpdateTicketStatusFormData } from "../../schemas/supportTicket.schema";
import "./AdminSupportTicketsPage.css";

export const AdminSupportTicketsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const updateTicketMutation = useUpdateTicketStatus();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<UpdateTicketStatusFormData>({
    resolver: zodResolver(updateTicketStatusSchema),
    mode: "onChange",
    defaultValues: {
      status: "OPEN",
      resolutionNote: ""
    }
  });

  const watchedStatus = watch("status");
  const watchedResolutionNote = watch("resolutionNote");

  const hasChanges = Boolean(
    selectedTicket &&
      (watchedStatus !== selectedTicket.status ||
        (watchedResolutionNote ?? "").trim() !== (selectedTicket.resolutionNote ?? "").trim())
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: ticketsResponse, isLoading } = useGetAdminSupportTickets({
    status: statusFilter || undefined,
    search: debouncedSearch || undefined
  });

  const tickets = ticketsResponse?.data?.tickets || [];

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    reset({
      status: ticket.status || "OPEN",
      resolutionNote: ticket.resolutionNote || ""
    });
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
    reset({
      status: "OPEN",
      resolutionNote: ""
    });
  };

  const onSubmitStatusUpdate = async (formData: UpdateTicketStatusFormData) => {
    if (!selectedTicket || updateTicketMutation.isPending) return;

    try {
      const res = await updateTicketMutation.mutateAsync({
        ticketId: selectedTicket.id,
        payload: {
          status: formData.status,
          resolutionNote: formData.resolutionNote?.trim() || null
        }
      });
      const updatedTicket = res.data ?? {
        ...selectedTicket,
        status: formData.status,
        resolutionNote: formData.resolutionNote?.trim() || undefined
      };
      setSelectedTicket(updatedTicket);
      reset({
        status: updatedTicket.status || "OPEN",
        resolutionNote: updatedTicket.resolutionNote || ""
      });
      toast.success(`Ticket status updated to ${formData.status.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update ticket status");
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
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
                <th style={{ width: "16%" }}>Ticket Number</th>
                <th style={{ width: "18%" }}>Complainant</th>
                <th style={{ width: "26%" }}>Subject / Linked Booking</th>
                <th style={{ width: "14%" }}>Category</th>
                <th style={{ width: "12%" }}>Status</th>
                <th className="text-right" style={{ width: "14%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td>
                      <div className="admin-skel-line" style={{ width: "70%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "40%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "60%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "35%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "80%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "50%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "60%", height: "16px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "50%", height: "20px", borderRadius: "12px" }}></div>
                    </td>
                    <td className="text-right">
                      <div className="admin-skel-line ml-auto" style={{ width: "90px", height: "28px", borderRadius: "6px" }}></div>
                    </td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty-ticket-cell">
                    <div className="admin-empty-ticket-box">
                      <img
                        src="/images/admin-no-data.png"
                        alt="No Support Tickets"
                        className="admin-empty-ticket-img"
                        onError={(e) => {
                          e.currentTarget.src = "https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png";
                        }}
                      />
                      <h3 className="font-semibold text-base mb-1 text-text">No Support Tickets Found</h3>
                      <p className="text-secondary text-xs mb-0">
                        There are no support or dispute tickets matching your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong className="text-sm font-semibold block">#{t.ticketNumber}</strong>
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
                      <strong className="text-sm block">{t.creatorName || (t.creatorRole === "PROVIDER" ? "Service Provider" : "Customer")}</strong>
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
                        <i className="fas fa-eye mr-1"></i>View Ticket
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
          title={`Support Ticket: #${selectedTicket.ticketNumber}`}
          icon="fas fa-headset"
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-secondary">
                Reference ID: {selectedTicket.id}
              </span>
              <button
                type="button"
                className="btn btn-secondary text-xs px-4"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="ticket-modal-content">
            <div className="ticket-detail-banner">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  <i className="fas fa-tag mr-1 text-primary"></i>
                  {selectedTicket.categoryLabel || selectedTicket.category}
                </span>
                {selectedTicket.bookingNumber && (
                  <span className="badge badge-admin text-xs">
                    Linked to Booking
                  </span>
                )}
              </div>
              <span className={`badge ${getStatusBadgeClass(selectedTicket.status)} text-xs px-2.5 py-0.5 rounded font-semibold`}>
                {(selectedTicket.status || "OPEN").replace("_", " ")}
              </span>
            </div>

            <div className="ticket-detail-section">
              <div className="ticket-section-title">
                <i className="fas fa-user-circle"></i>
                Complainant Details
              </div>
              <div className="ticket-info-grid">
                <div className="ticket-info-item">
                  <span className="ticket-info-label">Complainant Name</span>
                  <span className="ticket-info-value">{selectedTicket.creatorName}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-info-label">Account Role</span>
                  <span className="ticket-info-value">
                    <span className={`badge ${selectedTicket.creatorRole === "PROVIDER" ? "badge-primary" : "badge-secondary"} text-xs px-2 py-0.5 rounded`}>
                      {selectedTicket.creatorRole}
                    </span>
                  </span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-info-label">Date Submitted</span>
                  <span className="ticket-info-value">
                    {new Date(selectedTicket.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-info-label">Last Updated</span>
                  <span className="ticket-info-value">
                    {new Date(selectedTicket.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            </div>

            {selectedTicket.bookingNumber && (
              <div className="ticket-detail-section">
                <div className="ticket-section-title">
                  <i className="fas fa-receipt"></i>
                  Linked Booking Details
                </div>
                <div className="ticket-info-grid">
                  <div className="ticket-info-item">
                    <span className="ticket-info-label">Booking Reference</span>
                    <span className="ticket-info-value text-primary">#{selectedTicket.bookingNumber}</span>
                  </div>
                  <div className="ticket-info-item">
                    <span className="ticket-info-label">Service Title</span>
                    <span className="ticket-info-value">{selectedTicket.serviceTitle || "Custom Service"}</span>
                  </div>
                  {selectedTicket.counterpartyName && (
                    <div className="ticket-info-item">
                      <span className="ticket-info-label">Counterparty</span>
                      <span className="ticket-info-value">{selectedTicket.counterpartyName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="ticket-detail-section">
              <div className="ticket-section-title">
                <i className="fas fa-file-alt"></i>
                Subject & Statement
              </div>
              <div className="mb-2">
                <h4 className="font-bold text-sm text-text mb-0">{selectedTicket.subject}</h4>
              </div>
              <div className="ticket-description-box">
                {selectedTicket.description}
              </div>
            </div>

            {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
              <div className="ticket-detail-section">
                <div className="ticket-section-title">
                  <i className="fas fa-paperclip"></i>
                  Attached Evidence ({selectedTicket.attachments.length})
                </div>
                <div className="ticket-attachments-grid">
                  {selectedTicket.attachments.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={url}
                        alt={`Attachment ${i + 1}`}
                        className="ticket-attachment-thumb"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitStatusUpdate)} className="ticket-detail-section">
              <div className="ticket-section-title">
                <i className="fas fa-sliders-h"></i>
                Update Ticket Status
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className="ticket-info-label mb-1 block">Ticket Status</label>
                    <select
                      {...register("status")}
                      className={`admin-input ${errors.status ? "has-error" : ""}`}
                      disabled={updateTicketMutation.isPending}
                    >
                      <option value="OPEN">Open</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    {errors.status && (
                      <div className="clean-field-error mt-1">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{errors.status.message}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-5">
                    <button
                      type="submit"
                      className="btn btn-primary text-xs px-4 py-2"
                      disabled={updateTicketMutation.isPending || !hasChanges}
                    >
                      {updateTicketMutation.isPending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-1"></i>Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-1"></i>Save Status
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {(watchedStatus === "RESOLVED" || watchedStatus === "CLOSED" || selectedTicket.resolutionNote) && (
                  <div>
                    <label className="ticket-info-label mb-1 block">
                      Resolution Note {(watchedStatus === "RESOLVED" || watchedStatus === "CLOSED") && <span className="text-danger">*</span>}
                    </label>
                    <textarea
                      {...register("resolutionNote")}
                      rows={3}
                      className={`admin-input ${errors.resolutionNote ? "has-error" : ""}`}
                      placeholder="Provide details about how this ticket or dispute was resolved (at least 10 characters)..."
                      disabled={updateTicketMutation.isPending}
                    />
                    {errors.resolutionNote && (
                      <div className="clean-field-error mt-1">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{errors.resolutionNote.message}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSupportTicketsPage;
