import React, { useState, useRef, memo, useCallback, useMemo, useEffect } from 'react';
import type {
  VerificationDocument,
  KycEditSubmissionPayload,
} from '../types/kyc.types';
import {
  MAX_DOCUMENT_SIZE,
  ACCEPTED_DOCUMENT_MIME_TYPES,
} from '../schemas/verification.schema';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal/ConfirmModal';

interface KycEditModalProps {
  document: VerificationDocument;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: KycEditSubmissionPayload) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
  onPreviewImage: (url: string, title?: string) => void;
}

interface NewlySelectedFile {
  id: string;
  name: string;
  size: string;
  url: string;
  file: File;
  isImage: boolean;
}

export const KycEditModal = memo(({
  document,
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  onPreviewImage,
}: KycEditModalProps) => {
  const isIdentity = useMemo(() => document.document_type === 'IDENTITY', [document.document_type]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [documentName, setDocumentName] = useState(document.document_name);
  const [keptFileIds, setKeptFileIds] = useState<string[]>(
    (document.files || []).map((f) => f.id)
  );
  const [newFiles, setNewFiles] = useState<NewlySelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDocumentName(document.document_name);
      setKeptFileIds((document.files || []).map((f) => f.id));
      setNewFiles([]);
      setErrorMsg('');
      setIsSubmitting(false);
    }
  }, [isOpen, document]);

  const existingFiles = useMemo(() => {
    return document.files || [];
  }, [document.files]);

  const activeExistingFiles = useMemo(() => {
    return existingFiles.filter((f) => keptFileIds.includes(f.id));
  }, [existingFiles, keptFileIds]);

  const totalFilesCount = useMemo(() => {
    return activeExistingFiles.length + newFiles.length;
  }, [activeExistingFiles.length, newFiles.length]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }, []);

  const handleFilesAdded = useCallback((filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setErrorMsg('');

    const added: NewlySelectedFile[] = [];

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];

      if (file.size > MAX_DOCUMENT_SIZE) {
        setErrorMsg(`File "${file.name}" exceeds maximum allowed size (5MB).`);
        return;
      }

      if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(file.type)) {
        setErrorMsg(`File "${file.name}" has an unsupported format. Supported formats: JPG, PNG, and WEBP.`);
        return;
      }

      const isImg = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      added.push({
        id: `${file.name}-${Date.now()}-${i}`,
        name: file.name,
        size: formatFileSize(file.size),
        url,
        file,
        isImage: isImg,
      });
    }

    setNewFiles((prev) => [...prev, ...added]);
  }, [formatFileSize]);

  const handleRemoveExistingFile = useCallback((fileId: string) => {
    setKeptFileIds((prev) => prev.filter((id) => id !== fileId));
    setErrorMsg('');
  }, []);

  const handleRestoreExistingFile = useCallback((fileId: string) => {
    setKeptFileIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));
    setErrorMsg('');
  }, []);

  const handleRemoveNewFile = useCallback((id: string) => {
    setNewFiles((prev) => prev.filter((item) => item.id !== id));
    setErrorMsg('');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  }, [handleFilesAdded]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesAdded(e.target.files);
    if (e.target) {
      e.target.value = '';
    }
  }, [handleFilesAdded]);

  const handleDropzoneClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = documentName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Document name must be at least 2 characters.');
      return;
    }

    if (trimmedName.length > 100) {
      setErrorMsg('Document name cannot exceed 100 characters.');
      return;
    }

    if (totalFilesCount === 0) {
      setErrorMsg('At least one document file is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: document.id,
        document_type: document.document_type,
        document_name: trimmedName,
        kept_file_ids: keptFileIds,
        new_files: newFiles.map((f) => ({
          name: f.name,
          size: f.size,
          url: f.url,
          file: f.file,
        })),
      });
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  }, [documentName, totalFilesCount, onSubmit, document.id, document.document_type, keptFileIds, newFiles, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="kyc-modal-overlay" 
        onClick={isSubmitting || isDeleting ? undefined : onClose}
      >
        <div className="kyc-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="kyc-modal-header">
            <div>
              <h3 className="kyc-modal-header-title">
                Edit {isIdentity ? 'Identity Document' : 'Additional Certificate'}
              </h3>
              <p className="kyc-modal-header-subtitle">
                Update the document name or replace/add files for verification review.
              </p>
            </div>
            <button
              className="kyc-modal-close-btn"
              onClick={onClose}
              aria-label="Close edit modal"
              disabled={isSubmitting || isDeleting}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

        <form onSubmit={handleSubmit}>
          <div className="kyc-modal-body">
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg border text-xs flex items-center gap-2" style={{ background: 'var(--danger-bg)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                <i className="fas fa-exclamation-circle"></i>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold text-text uppercase tracking-wide mb-1">
                Verification Category
              </label>
              <div className="kyc-category-box">
                <span>{isIdentity ? 'Government Identity Document' : 'Professional Certificate'}</span>
                <span className="kyc-status-pill pending">
                  <i className="fas fa-shield-alt"></i> {document.document_type}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="edit-document-name" className="block text-xs font-semibold text-text uppercase tracking-wide mb-1">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-document-name"
                type="text"
                className="kyc-input"
                placeholder={isIdentity ? 'e.g. Passport, National ID Card' : 'e.g. Master Electrician License'}
                value={documentName}
                onChange={(e) => {
                  setDocumentName(e.target.value);
                  setErrorMsg('');
                }}
                disabled={isSubmitting || isDeleting}
              />
            </div>

            {existingFiles.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-text uppercase tracking-wide mb-2">
                  Existing Files ({activeExistingFiles.length} of {existingFiles.length} retained)
                </label>
                <div className="flex flex-col gap-2">
                  {existingFiles.map((file, idx) => {
                    const isKept = keptFileIds.includes(file.id);
                    const fileName = file.file_name || file.file_url.split('/').pop()?.split('?')[0] || `File ${idx + 1}`;
                    const isPdf = fileName.toLowerCase().endsWith('.pdf') || file.file_url.toLowerCase().endsWith('.pdf');

                    return (
                      <div
                        key={file.id}
                        className={`kyc-existing-file-item ${!isKept ? 'deleted' : ''}`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="kyc-existing-file-thumb">
                            {isPdf ? (
                              <i className="fas fa-file-pdf text-red-500 text-lg"></i>
                            ) : (
                              <img src={file.file_url} alt={fileName} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className={`text-xs font-medium truncate ${isKept ? 'text-text' : 'line-through text-secondary'}`}>
                              {fileName}
                            </p>
                            <span className="text-2xs text-secondary">
                              {isKept ? 'Currently Attached' : 'Marked for deletion'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isKept && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline py-1 px-2 text-xs rounded"
                              onClick={() => {
                                if (!isPdf) {
                                  onPreviewImage(file.file_url, fileName);
                                } else {
                                  window.open(file.file_url, '_blank');
                                }
                              }}
                              title="Preview file"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          )}
                          {isKept ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger py-1 px-2 text-xs rounded"
                              onClick={() => handleRemoveExistingFile(file.id)}
                              disabled={isSubmitting || isDeleting}
                              title="Remove file"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline py-1 px-2 text-xs rounded text-primary"
                              onClick={() => handleRestoreExistingFile(file.id)}
                              disabled={isSubmitting || isDeleting}
                              title="Restore file"
                            >
                              <i className="fas fa-undo"></i> Restore
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs font-semibold text-text uppercase tracking-wide mb-2">
                Upload New Files
              </label>
              <div
                className={`kyc-dropzone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleDropzoneClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={isSubmitting || isDeleting}
                />
                <i className="fas fa-cloud-upload-alt text-3xl text-primary mb-2"></i>
                <p className="text-sm font-semibold text-text mb-0.5">
                  Click to add images or drag and drop
                </p>
                <p className="text-xs text-secondary">
                  PNG, JPG, or WEBP up to 5MB each
                </p>
              </div>

              {newFiles.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  <span className="text-2xs font-semibold text-text uppercase tracking-wider">
                    New Files Added ({newFiles.length})
                  </span>
                  {newFiles.map((item) => (
                    <div
                      key={item.id}
                      className="kyc-new-file-item"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <i className={`fas ${item.isImage ? 'fa-image text-green-500' : 'fa-file-pdf text-red-500'}`}></i>
                        <span className="text-xs font-medium text-text truncate">{item.name}</span>
                        <span className="text-2xs text-secondary shrink-0">({item.size})</span>
                      </div>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer p-1"
                        onClick={() => handleRemoveNewFile(item.id)}
                        disabled={isSubmitting || isDeleting}
                        title="Remove"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="kyc-info-callout">
              <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
              <span>
                Saving changes will submit the document for review. Review typically takes 12-24 business hours.
              </span>
            </div>
          </div>

          <div className="kyc-modal-footer flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                className="btn btn-sm btn-danger py-2 px-3 text-xs rounded-lg flex items-center gap-1.5"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting || isDeleting}
              >
                <i className="fas fa-trash-alt"></i> Delete Document
              </button>
            ) : <div />}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-outline text-sm py-2 px-4 rounded-lg"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-sm py-2 px-5 rounded-lg flex items-center gap-2"
                disabled={isSubmitting || isDeleting || totalFilesCount === 0}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving Changes...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Save &amp; Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      isOpen={showDeleteConfirm}
      title="Delete Verification Document?"
      message={`Are you sure you want to delete "${document.document_name}"? This action will remove the document and its uploaded files. You will need to submit a new verification document for review.`}
      confirmText="Delete Document"
      cancelText="Cancel"
      isDanger={true}
      isLoading={isDeleting}
      onConfirm={async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
          await onDelete(document.id);
          setShowDeleteConfirm(false);
          onClose();
        } catch {
          setIsDeleting(false);
        }
      }}
      onCancel={() => {
        if (!isDeleting) {
          setShowDeleteConfirm(false);
        }
      }}
    />
  </>
);
});

KycEditModal.displayName = 'KycEditModal';
