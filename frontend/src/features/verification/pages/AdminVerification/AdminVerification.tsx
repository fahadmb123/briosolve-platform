import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "../../../admin/components/AdminPageHeader";
import { AdminTable, type TableColumn } from "../../../admin/components/AdminTable";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { SpinnerOverlay } from "../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay";
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";
import { VerificationReviewModal } from "../../components/admin/VerificationReviewModal";
import { RejectKycModal } from "../../components/admin/RejectKycModal";
import {
  useGetAdminVerifications,
  useUpdateKycStatus,
} from "../../hooks/useAdminVerifications";
import type {
  AdminKycDossier,
  AdminKycDocument,
  AdminKycStats,
} from "../../types/adminVerification.types";

export default function Verification() {
  const [dossiers, setDossiers] = useState<AdminKycDossier[]>([]);
  const [stats, setStats] = useState<AdminKycStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDossier, setSelectedDossier] = useState<AdminKycDossier | null>(
    null
  );
  const [docToApprove, setDocToApprove] = useState<{
    dossier: AdminKycDossier;
    doc: AdminKycDocument;
  } | null>(null);
  const [docToReject, setDocToReject] = useState<{
    dossier: AdminKycDossier;
    doc: AdminKycDocument;
  } | null>(null);

  const getVerifications = useGetAdminVerifications();
  const updateKycStatus = useUpdateKycStatus();

  const fetchVerifications = useCallback(() => {
    getVerifications.mutate(
      {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        sort: sortOrder,
      },
      {
        onSuccess: (res) => {
          if (res?.data) {
            setDossiers(res.data.dossiers || []);
            setTotalPages(res.data.totalPages || 1);
            if (res.data.stats) {
              setStats(res.data.stats);
            }
          }
        },
      }
    );
  }, [page, search, statusFilter, sortOrder]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);


  const handleApproveDocument = useCallback(
    (dossier: AdminKycDossier, doc: AdminKycDocument) => {
      setDocToApprove({ dossier, doc });
    },
    []
  );

  const confirmApproveDocument = useCallback(() => {
    if (!docToApprove) return;
    updateKycStatus.mutate(
      {
        providerId: docToApprove.dossier.id,
        documentId: docToApprove.doc.id,
        status: "APPROVED",
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Document approved successfully.");
          setDocToApprove(null);
          setSelectedDossier(null);
          fetchVerifications();
        },
      }
    );
  }, [docToApprove, updateKycStatus, fetchVerifications]);

  const handleRejectDocument = useCallback(
    (dossier: AdminKycDossier, doc: AdminKycDocument) => {
      setDocToReject({ dossier, doc });
    },
    []
  );

  const confirmRejectDocument = useCallback(
    (reason: string) => {
      if (!docToReject) return;
      updateKycStatus.mutate(
        {
          providerId: docToReject.dossier.id,
          documentId: docToReject.doc.id,
          status: "REJECTED",
          rejectionReason: reason,
        },
        {
          onSuccess: (res) => {
            toast.success(res?.message || "Document rejected successfully.");
            setDocToReject(null);
            setSelectedDossier(null);
            fetchVerifications();
          },
        }
      );
    },
    [docToReject, updateKycStatus, fetchVerifications]
  );

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("PENDING");
    setSortOrder("desc");
    setPage(1);
  }, []);

  const columns: TableColumn<AdminKycDossier>[] = useMemo(
    () => [
      {
        key: "specialist",
        header: "Applicant Specialist",
        render: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary border border-border shrink-0 overflow-hidden">
              {item.profile_image ? (
                <img
                  src={item.profile_image}
                  alt={item.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                item.user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="font-semibold text-sm text-text">
                {item.user.name}
              </div>
              <div className="text-xs text-secondary">
                {item.business_name || "Independent Specialist"}
              </div>
              <div className="text-[11px] text-muted">{item.user.email}</div>
            </div>
          </div>
        ),
      },
      
      {
        key: "experience",
        header: "Trade Experience",
        render: (item) => (
          <span className="text-xs font-medium text-text">
            {item.experience || "Not Stated"}
          </span>
        ),
      },
      {
        key: "submitted",
        header: "Submission Date",
        render: (item) => (
          <span className="text-xs text-secondary">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        key: "documents",
        header: "Document Bundle",
        render: (item) => (
          <span className="badge badge-info text-xs inline-flex items-center gap-1">
            <i className="fas fa-paperclip"></i>
            <span>{item.documents.length} Credential(s)</span>
          </span>
        ),
      },
      {
        key: "status",
        header: "Audit State",
        render: (item) => (
          <span
            className={`badge text-xs uppercase px-2.5 py-1 rounded font-semibold ${
              item.kyc_status === "APPROVED"
                ? "bg-success/15 text-success border border-success/20"
                : item.kyc_status === "REJECTED"
                ? "bg-danger/15 text-danger border border-danger/20"
                : "bg-warning/15 text-warning border border-warning/20"
            }`}
          >
            {item.kyc_status}
          </span>
        ),
      },
      {
        key: "action",
        header: "Action",
        render: (item) => (
          <button
            type="button"
            className="btn btn-primary text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
            onClick={() => setSelectedDossier(item)}
          >
            <i className="fas fa-search-plus"></i>
            <span>Review Dossier</span>
          </button>
        ),
      },
    ],
    []
  );

  return (
    <>
      {updateKycStatus.isPending && <SpinnerOverlay isLoading={true} />}

      <div className="app-content p-6">
        <AdminPageHeader
          title="Provider Verification Queue"
          description="Evaluate trade diplomas, municipal licenses, and government IDs prior to granting marketplace Verified badges."
        />

        <div
          className="admin-kpi-grid mb-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
        >
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-warning-light text-warning">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{stats.pending}</div>
              <div className="admin-kpi-lbl">Pending Review</div>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-success-light text-success">
              <i className="fas fa-check-double"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{stats.approved}</div>
              <div className="admin-kpi-lbl">Total Verified</div>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-danger-light text-danger">
              <i className="fas fa-ban"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{stats.rejected}</div>
              <div className="admin-kpi-lbl">Total Rejected</div>
            </div>
          </div>
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-info-light text-info">
              <i className="fas fa-layer-group"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{stats.total}</div>
              <div className="admin-kpi-lbl">Total Applications</div>
            </div>
          </div>
        </div>

        <div className="admin-filter-bar mb-6">
          <div className="admin-search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by specialist name, business, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="admin-filters-group">
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved / Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              className="admin-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "desc" | "asc");
                setPage(1);
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            {(search || statusFilter !== "PENDING" || sortOrder !== "desc") && (
              <button
                type="button"
                className="btn btn-secondary text-xs py-2"
                onClick={handleResetFilters}
              >
                <i className="fas fa-undo mr-1"></i>Reset
              </button>
            )}
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={dossiers}
          isLoading={getVerifications.isPending}
          emptyMessage="No provider verification dossiers match the current filter criteria."
          keyExtractor={(item) => item.id}
        />

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <VerificationReviewModal
        isOpen={!!selectedDossier}
        onClose={() => setSelectedDossier(null)}
        dossier={selectedDossier}
        isLoading={updateKycStatus.isPending}
        onApproveDocument={handleApproveDocument}
        onRejectDocument={handleRejectDocument}
      />


      <ConfirmModal
        isOpen={!!docToApprove}
        title="Approve Document"
        message={`Approve the "${docToApprove?.doc.document_name || docToApprove?.doc.document_type}" submitted by ${docToApprove?.dossier.user.name || "this provider"}?`}
        confirmText="Approve Document"
        isLoading={updateKycStatus.isPending}
        onConfirm={confirmApproveDocument}
        onCancel={() => setDocToApprove(null)}
      />

      <RejectKycModal
        isOpen={!!docToReject}
        onClose={() => setDocToReject(null)}
        providerName={`${docToReject?.doc.document_name || docToReject?.doc.document_type} — ${docToReject?.dossier.user.name || "Provider"}`}
        isLoading={updateKycStatus.isPending}
        onConfirm={confirmRejectDocument}
      />
    </>
  );
}
