import { useState, useMemo, useCallback, useEffect } from 'react';
import type {VerificationDocument,VerificationDocumentType,KycSubmissionPayload,KycEditSubmissionPayload,} from '../../types/kyc.types';
import { KycStatusBanner } from '../../components/KycStatusBanner';
import { KycDocumentCard } from '../../components/KycDocumentCard';
import { KycRequestModal } from '../../components/KycRequestModal';
import { KycEditModal } from '../../components/KycEditModal';
import { KycDetailsModal } from '../../components/KycDetailsModal';
import { KycImageViewerModal } from '../../components/KycImageViewerModal';
import {
  useGetProviderVerifications,
  useUploadVerificationDocument,
  useUpdateVerificationDocument,
  useDeleteVerificationDocument,
} from '../../hooks/mutations/useVerification';

import { toast } from 'react-toastify';
import '../../components/kyc.css';
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal/ConfirmModal';
import { useAuthStore } from '../../../auth';



export default function Verification() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [activeRequestType, setActiveRequestType] = useState<VerificationDocumentType | null>(null);
  const [selectedDetailsDoc, setSelectedDetailsDoc] = useState<VerificationDocument | null>(null);
  const [selectedEditDoc, setSelectedEditDoc] = useState<VerificationDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<VerificationDocument | null>(null);
  const [previewImage, setPreviewImage] = useState<{ url: string; title?: string } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const getVerificationsMut = useGetProviderVerifications();
  const uploadDocMut = useUploadVerificationDocument();
  const updateDocMut = useUpdateVerificationDocument();
  const deleteDocMut = useDeleteVerificationDocument();
  const {fetchUser} = useAuthStore.getState()

  useEffect(() => {
    getVerificationsMut.mutate(undefined, {
      onSuccess: (res) => {
        if (res?.data) {
          setDocuments(res.data);
        }
      },
    });
  }, []);

  const identityDoc = useMemo(
    () => documents.find((d) => d.document_type === 'IDENTITY'),
    [documents]
  );

  const certificatesDoc = useMemo(
    () => documents.find((d) => d.document_type === 'CERTIFICATE'),
    [documents]
  );

  const handleOpenRequest = useCallback((type: VerificationDocumentType) => {
    setActiveRequestType(type);
  }, []);

  const handleCloseRequest = useCallback(() => {
    setActiveRequestType(null);
  }, []);

  const handleOpenDetails = useCallback((doc: VerificationDocument) => {
    setSelectedDetailsDoc(doc);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedDetailsDoc(null);
  }, []);

  const handleOpenEdit = useCallback((doc: VerificationDocument) => {
    setSelectedEditDoc(doc);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setSelectedEditDoc(null);
  }, []);

  const handleOpenDelete = useCallback((doc: VerificationDocument) => {
    setDocumentToDelete(doc);
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (!deleteDocMut.isPending) {
      setDocumentToDelete(null);
    }
  }, [deleteDocMut.isPending]);

  const handlePreviewImage = useCallback((url: string, title?: string) => {
    setPreviewImage({ url, title });
  }, []);

  const handleCloseImagePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const handleDismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleSubmission = useCallback(async (payload: KycSubmissionPayload) => {
    const formData = new FormData();
    formData.append('document_type', payload.document_type);
    formData.append('document_name', payload.document_name);
    payload.files.forEach((f) => {
      if (f.file) {
        formData.append('files', f.file);
      }
    });

    const res = await uploadDocMut.mutateAsync(formData);
    if (res?.data) {
      const savedDoc = res.data;
      fetchUser()
      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.document_type !== savedDoc.document_type);
        return [...filtered, savedDoc];
      });
      toast.success(`${savedDoc.document_name} Submitted!`);
      setNotification(
        `${savedDoc.document_name} Submitted!`
      );
    }
  }, [uploadDocMut,fetchUser]);

  const handleEditSubmission = useCallback(async (payload: KycEditSubmissionPayload) => {
    const formData = new FormData();
    formData.append('document_name', payload.document_name);
    formData.append('kept_file_ids', JSON.stringify(payload.kept_file_ids));
    payload.new_files.forEach((f) => {
      if (f.file) {
        formData.append('files', f.file);
      }
    });

    const res = await updateDocMut.mutateAsync({ id: payload.id, data: formData })
    if (res?.data) {
      fetchUser()
      const updatedDoc = res.data;
      setDocuments((prev) => {
        const exists = prev.some((d) => d.id === updatedDoc.id);
        if (exists) {
          return prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
        }
        const filtered = prev.filter((d) => d.document_type !== updatedDoc.document_type);
        return [...filtered, updatedDoc];
      });
      toast.success(`${updatedDoc.document_name} updated successfully!`);
      setNotification(
        `${updatedDoc.document_name} Updated!`
      );
    }
  }, [updateDocMut,fetchUser]);

  const handleDeleteSubmission = useCallback(async (id: string) => {
    try {
      const res = await deleteDocMut.mutateAsync(id)
      fetchUser()
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      const message = res?.message || 'Document deleted successfully';
      toast.success(message);
      setNotification(message);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, [deleteDocMut,fetchUser]);

  const handleConfirmDelete = useCallback(async () => {
    if (!documentToDelete) return;
    try {
      await handleDeleteSubmission(documentToDelete.id);
      setDocumentToDelete(null);
    } catch (err) {
      console.log(err);
    }
  }, [documentToDelete, handleDeleteSubmission]);

  return (
    <div className="app-content">
      <div className="kyc-container">
        <div className="kyc-header">
          <div>
            <h1 className="kyc-header-title">KYC &amp; Identity Verification</h1>
            <p className="kyc-header-subtitle">
              Upload your verification documents to unlock your Verified Provider badge and receive higher customer trust.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary py-1 px-3 text-xs rounded-full">
              <i className="fas fa-lock mr-1"></i> 256-Bit SSL Encrypted
            </span>
          </div>
        </div>

        {notification && (
          <div className="mb-4 p-3 rounded-xl bg-success-light border border-success text-success-dark flex items-center justify-between text-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-success"></i>
              <span>{notification}</span>
            </div>
            <button
              className="text-success hover:opacity-75 cursor-pointer bg-transparent border-0"
              onClick={handleDismissNotification}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <KycStatusBanner documents={documents} />

        {getVerificationsMut.isPending && documents.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
          </div>
        ) : (
          <div className="kyc-categories-grid">
            <KycDocumentCard
              documentType="IDENTITY"
              title="Identity Document"
              description="Official government photo ID (Aadhaar Card, Passport, or Driving License) to verify your individual legal identity."
              icon="fa-id-card"
              document={identityDoc}
              onRequestVerification={handleOpenRequest}
              onViewRequest={handleOpenDetails}
              onEditVerification={handleOpenEdit}
              onDeleteVerification={handleOpenDelete}
            />

            <KycDocumentCard
              documentType="CERTIFICATE"
              title="Additional Certificates"
              description="Vocational diplomas, trade licenses, safety badges, or brand certifications demonstrating your professional skills."
              icon="fa-certificate"
              document={certificatesDoc}
              onRequestVerification={handleOpenRequest}
              onViewRequest={handleOpenDetails}
              onEditVerification={handleOpenEdit}
              onDeleteVerification={handleOpenDelete}
            />
          </div>
        )}
      </div>

      {activeRequestType && (
        <KycRequestModal
          documentType={activeRequestType}
          isOpen={true}
          onClose={handleCloseRequest}
          onSubmit={handleSubmission}
          onPreviewImage={handlePreviewImage}
        />
      )}

      {selectedEditDoc && (
        <KycEditModal
          document={selectedEditDoc}
          isOpen={true}
          onClose={handleCloseEdit}
          onSubmit={handleEditSubmission}
          onDelete={handleDeleteSubmission}
          onPreviewImage={handlePreviewImage}
        />
      )}

      {selectedDetailsDoc && (
        <KycDetailsModal
          document={selectedDetailsDoc}
          isOpen={true}
          onClose={handleCloseDetails}
          onRequestNew={handleOpenRequest}
          onPreviewImage={handlePreviewImage}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <ConfirmModal
        isOpen={!!documentToDelete}
        title="Delete Verification Document?"
        message={`Are you sure you want to delete "${documentToDelete?.document_name}"? This action will remove the document and its uploaded files. You will need to submit a new verification document for review.`}
        confirmText="Delete Document"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteDocMut.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />

      {previewImage && (
        <KycImageViewerModal
          imageUrl={previewImage.url}
          imageTitle={previewImage.title}
          onClose={handleCloseImagePreview}
        />
      )}
    </div>
  );
}
