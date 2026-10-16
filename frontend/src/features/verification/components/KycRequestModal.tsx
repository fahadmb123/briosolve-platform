import React, { useState, useRef, memo, useCallback, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  VerificationDocumentType,
  KycSubmissionPayload,
} from '../types/kyc.types';
import {
  verificationRequestSchema,
  type VerificationRequestFormData,
  MAX_DOCUMENT_SIZE,
  ACCEPTED_DOCUMENT_MIME_TYPES,
} from '../schemas/verification.schema';

interface KycRequestModalProps {
  documentType: VerificationDocumentType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: KycSubmissionPayload) => Promise<void> | void;
  onPreviewImage: (url: string, title?: string) => void;
}

interface SelectedFileItem {
  id: string;
  name: string;
  size: string;
  url: string;
  file?: File;
  isImage: boolean;
}

export const KycRequestModal = memo(({
  documentType,
  isOpen,
  onClose,
  onSubmit,
  onPreviewImage,
}: KycRequestModalProps) => {
  const isIdentity = useMemo(() => documentType === 'IDENTITY', [documentType]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  const defaultDocName = useMemo(() => {
    return isIdentity ? 'National ID Card' : '';
  }, [isIdentity]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VerificationRequestFormData>({
    resolver: zodResolver(verificationRequestSchema),
    defaultValues: {
      document_type: documentType,
      document_name: defaultDocName,
      files: [],
    },
    mode: 'onChange',
  });

  const selectedFiles = watch('files') as SelectedFileItem[];

  useEffect(() => {
    if (isOpen) {
      reset({
        document_type: documentType,
        document_name: isIdentity ? 'National ID Card' : '',
        files: [],
      });
      setFileError('');
    }
  }, [isOpen, documentType, isIdentity, reset]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }, []);

  const handleFilesAdded = useCallback((filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setFileError('');

    const currentFiles = [...(selectedFiles || [])];
    const newFiles: SelectedFileItem[] = [];

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];

      if (file.size > MAX_DOCUMENT_SIZE) {
        setFileError(`File "${file.name}" exceeds maximum allowed size (5MB).`);
        return;
      }

      if (!ACCEPTED_DOCUMENT_MIME_TYPES.includes(file.type)) {
        setFileError(`File "${file.name}" has an unsupported format. Supported formats: JPG, PNG, and WEBP.`);
        return;
      }

      const isImg = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      newFiles.push({
        id: `${file.name}-${Date.now()}-${i}`,
        name: file.name,
        size: formatFileSize(file.size),
        url,
        file,
        isImage: isImg,
      });
    }

    const updated = [...currentFiles, ...newFiles];
    setValue('files', updated, { shouldValidate: true, shouldDirty: true });
  }, [selectedFiles, setValue, formatFileSize]);

  const handleRemoveFile = useCallback((id: string) => {
    const updated = (selectedFiles || []).filter((item) => item.id !== id);
    setValue('files', updated, { shouldValidate: true, shouldDirty: true });
  }, [selectedFiles, setValue]);

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

  const onFormSubmit = useCallback(async (data: VerificationRequestFormData) => {
    try {
      await onSubmit({
        document_type: data.document_type,
        document_name: data.document_name,
        files: data.files.map((f) => ({
          name: f.name,
          size: f.size,
          url: f.url,
          file: f.file,
        })),
      });
      onClose();
    } catch {
      return;
    }
  }, [onSubmit, onClose]);

  if (!isOpen) return null;

  return (
    <div className="kyc-modal-overlay" onClick={onClose}>
      <div className="kyc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="kyc-modal-header">
          <div>
            <h3 className="kyc-modal-header-title">
              {isIdentity ? 'Request Identity Verification' : 'Request Certificate Verification'}
            </h3>
            <p className="kyc-modal-header-subtitle">
              {isIdentity
                ? 'Upload clear photos or scans of your official government ID'
                : 'Upload your trade license, vocational certificate, or professional credential'}
            </p>
          </div>
          <button className="kyc-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="kyc-modal-body">
          <input type="hidden" {...register('document_type')} />

          {fileError && (
            <div className="kyc-rejection-preview-box">
              <i className="fas fa-exclamation-circle"></i>
              <p className="kyc-rejection-preview-text">{fileError}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1.5">
              {isIdentity ? 'Identity Document Name' : 'Certificate / License Name'} <span className="text-danger">*</span>
            </label>
            {isIdentity ? (
              <select
                className={`kyc-input ${errors.document_name ? 'border-danger' : ''}`}
                {...register('document_name')}
              >
                <option value="National ID Card">National ID Card</option>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID Card">Voter ID Card</option>
                <option value="PAN Card">PAN Card</option>
              </select>
            ) : (
              <input
                type="text"
                className={`kyc-input ${errors.document_name ? 'border-danger' : ''}`}
                placeholder="e.g. Master HVAC Certificate, Trade License, Electrical Safety Accreditation"
                {...register('document_name')}
              />
            )}
            {errors.document_name && (
              <span className="text-danger text-xs mt-1 block">{errors.document_name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-text uppercase mb-1.5">
              Upload Files or Photos <span className="text-danger">*</span>
            </label>

            <div
              className={`kyc-dropzone ${isDragging ? 'active' : ''} ${errors.files ? 'border-danger' : ''}`}
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
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <div className="kyc-dropzone-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h4 className="kyc-dropzone-title">Click to upload or drag & drop</h4>
              <p className="kyc-dropzone-hint">
                Supported: JPG, PNG, WEBP (up to 5MB each)
              </p>
            </div>

            {errors.files && (
              <span className="text-danger text-xs mt-1.5 block">
                {errors.files.message}
              </span>
            )}

            {selectedFiles && selectedFiles.length > 0 && (
              <div className="kyc-file-preview-list">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="kyc-file-preview-item">
                    <div className="kyc-file-preview-info">
                      {file.isImage ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="kyc-file-preview-thumb cursor-pointer"
                          onClick={() => onPreviewImage(file.url, file.name)}
                          title="Click to zoom preview"
                        />
                      ) : (
                        <div className="kyc-file-preview-icon">
                          <i className="fas fa-file-pdf"></i>
                        </div>
                      )}
                      <div className="kyc-file-preview-text">
                        <p className="kyc-file-name">{file.name}</p>
                        <p className="kyc-file-size">{file.size}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="kyc-file-remove-btn"
                      onClick={() => handleRemoveFile(file.id)}
                      title="Remove file"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="kyc-modal-footer">
            <button
              type="button"
              className="btn btn-outline text-sm py-2 px-4 rounded-lg"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-sm py-2 px-5 rounded-lg flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

KycRequestModal.displayName = 'KycRequestModal';
