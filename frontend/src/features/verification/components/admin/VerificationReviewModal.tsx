import React, { useState, useCallback } from "react";
import { AdminModal } from "../../../admin/components/AdminModal";
import { KycImageViewerModal } from "../KycImageViewerModal";
import "../kyc.css";
import type { AdminKycDossier, AdminKycDocument } from "../../types/adminVerification.types";

interface VerificationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: AdminKycDossier | null;
  isLoading?: boolean;
  onApproveDocument?: (dossier: AdminKycDossier, doc: AdminKycDocument) => void;
  onRejectDocument?: (dossier: AdminKycDossier, doc: AdminKycDocument) => void;
}

const formatDocType = (type: string): string =>
  type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

export const VerificationReviewModal: React.FC<VerificationReviewModalProps> = ({
  isOpen,
  onClose,
  dossier,
  isLoading,
  onApproveDocument,
  onRejectDocument,
}) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; title?: string } | null>(null);

  const handlePreview = useCallback((url: string, title?: string) => {
    setPreviewImage({ url, title });
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  if (!dossier) return null;

  const isPending = dossier.kyc_status === "PENDING";

  const footer = (
    <div className="flex justify-between items-center w-full">
      <button
        type="button"
        className="btn btn-secondary text-xs"
        onClick={onClose}
        disabled={isLoading}
      >
        Close
      </button>
      {isPending && (
        <span className="text-[11px] text-muted italic">
          Review each document below to approve or reject individually.
        </span>
      )}
    </div>
  );

  return (
    <>
      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title="Review Provider Verification Dossier"
        icon="fas fa-user-check"
        footer={footer}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-surface-elevated rounded-md border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary border border-border shrink-0 overflow-hidden">
              {dossier.profile_image ? (
                <img
                  src={dossier.profile_image}
                  alt={dossier.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{dossier.user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-text truncate">
                {dossier.user.name}
              </h4>
              <div className="text-xs text-secondary truncate">
                {dossier.business_name || "Independent Specialist"} •{" "}
                {dossier.experience || "Experience N/A"}
              </div>
              <div className="text-xs text-muted truncate">
                {dossier.user.email}
                {dossier.user.phone ? ` • ${dossier.user.phone}` : ""}
              </div>
            </div>
            <span
              className={`badge text-xs uppercase px-2 py-0.5 rounded font-medium ${
                dossier.kyc_status === "APPROVED"
                  ? "bg-success/15 text-success border border-success/25"
                  : dossier.kyc_status === "REJECTED"
                  ? "bg-danger/15 text-danger border border-danger/25"
                  : "bg-warning/15 text-warning border border-warning/25"
              }`}
            >
              {dossier.kyc_status}
            </span>
          </div>

          {dossier.bio && (
            <div className="p-3 bg-surface border border-border rounded text-xs">
              <span className="font-semibold text-secondary block mb-1">
                Professional Summary:
              </span>
              <p className="text-text mb-0 leading-relaxed">{dossier.bio}</p>
            </div>
          )}

          {dossier.services && dossier.services.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-secondary uppercase mb-1.5">
                Associated Services
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {dossier.services.map((srv) => (
                  <span
                    key={srv.id}
                    className="badge badge-neutral text-xs px-2 py-0.5"
                  >
                    {srv.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 className="text-xs font-semibold text-secondary uppercase mb-2">
              Uploaded Verification Credentials ({dossier.documents.length})
            </h5>

            {dossier.documents.length === 0 ? (
              <div className="p-4 text-center text-xs text-secondary bg-surface rounded border border-border">
                No documents submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {dossier.documents.map((doc: AdminKycDocument) => {
                  return (
                    <div
                      key={doc.id}
                      className="p-3 bg-surface border border-border rounded-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-file-contract text-primary text-sm"></i>
                          <div>
                            <div className="text-xs font-semibold text-text">
                              {formatDocType(doc.document_type)}
                            </div>
                            <div className="text-[11px] text-muted">
                              {doc.document_name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`badge text-[10px] uppercase px-2 py-0.5 rounded ${
                              doc.status === "APPROVED"
                                ? "bg-success/15 text-success border border-success/20"
                                : doc.status === "REJECTED"
                                ? "bg-danger/15 text-danger border border-danger/20"
                                : "bg-warning/15 text-warning border border-warning/20"
                            }`}
                          >
                            {doc.status}
                          </span>
                          {doc.status === "PENDING" && onApproveDocument && onRejectDocument && (
                            <>
                              <button
                                type="button"
                                className="btn btn-xs text-success border border-success/30 bg-success/10 hover:bg-success/20 px-2 py-0.5 rounded text-[10px] font-medium"
                                disabled={isLoading}
                                onClick={() => onApproveDocument(dossier, doc)}
                              >
                                <i className="fas fa-check mr-0.5"></i>Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-xs text-danger border border-danger/30 bg-danger/10 hover:bg-danger/20 px-2 py-0.5 rounded text-[10px] font-medium"
                                disabled={isLoading}
                                onClick={() => onRejectDocument(dossier, doc)}
                              >
                                <i className="fas fa-times mr-0.5"></i>Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {doc.rejection_reason && (
                        <div className="mb-2 p-2 bg-danger-light border border-danger/20 rounded text-[11px] text-danger">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {doc.rejection_reason}
                        </div>
                      )}

                      {doc.files && doc.files.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5 pt-2 border-t border-border">
                            <span className="text-[11px] font-semibold text-secondary uppercase">
                              Files ({doc.files.length})
                            </span>
                            <span className="text-[10px] text-muted">
                              Click image to enlarge
                            </span>
                          </div>
                          <div className="kyc-images-grid">
                            {doc.files.map((file, idx) => {
                              const fileName =
                                file.file_url.split("/").pop()?.split("?")[0] ||
                                `File ${idx + 1}`;
                              const isFilePdf =
                                fileName.toLowerCase().endsWith(".pdf") ||
                                file.file_url.toLowerCase().includes(".pdf");
                              return (
                                <div
                                  key={file.id || idx}
                                  className="kyc-image-card"
                                  onClick={() => {
                                    if (!isFilePdf) {
                                      handlePreview(file.file_url, `${formatDocType(doc.document_type)} — File ${idx + 1}`);
                                    } else {
                                      window.open(file.file_url, "_blank");
                                    }
                                  }}
                                  title={isFilePdf ? "Click to open PDF" : "Click to preview full size"}
                                >
                                  {isFilePdf ? (
                                    <div
                                      className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                                      style={{ background: "var(--surface-hover)" }}
                                    >
                                      <i className="fas fa-file-pdf text-red-500 text-3xl mb-1"></i>
                                      <span className="text-xs text-text font-medium truncate w-full">
                                        {fileName}
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <img
                                        src={file.file_url}
                                        alt={`${formatDocType(doc.document_type)} file ${idx + 1}`}
                                      />
                                      <div className="kyc-image-overlay">
                                        <i className="fas fa-search-plus"></i>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AdminModal>

      {previewImage && (
        <KycImageViewerModal
          imageUrl={previewImage.url}
          imageTitle={previewImage.title}
          onClose={handleClosePreview}
        />
      )}
    </>
  );
};
