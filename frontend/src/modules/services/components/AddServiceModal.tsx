import React from 'react';
import { AdminModal } from '../../admin/components/AdminModal';
import Cropper from 'react-easy-crop';
import { useAddService } from '../hooks/useAddService';

interface AddServiceModalProps {
  isOpen: boolean;
  initialData?: { id?: string; categoryId: string; name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; image?: string | null } | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onAdd: (data: { name: string; categoryId: string; categoryName: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, initialData, categories, onClose, onAdd }) => {
  const {
    register,
    errors,
    isValid,
    selectedRawFile,
    crop,
    setCrop,
    zoom,
    setZoom,
    fileInputRef,
    handleImageChange,
    onCropComplete,
    onSubmit
  } = useAddService({ initialData, onAdd, onClose, categories });

  const isEditing = !!initialData;

  const footer = (
    <>
      <button className="btn btn-secondary text-sm" onClick={onClose} type="button">
        Cancel
      </button>
      <button className="btn btn-primary text-sm" onClick={onSubmit} type="button" disabled={!isValid || (!isEditing && !selectedRawFile)}>
        {isEditing ? 'Save Changes' : 'Add Service'}
      </button>
    </>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Service" : "Add New Service"} icon={isEditing ? "fas fa-edit" : "fas fa-plus-circle"} footer={footer}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        
        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Service Name <span className="text-error">*</span></label>
          <input 
            type="text" 
            className={`form-control ${errors.name ? 'border-error focus:ring-error' : ''}`}
            placeholder="e.g. Pipe Leak Repair" 
            {...register('name')}
          />
          {errors.name && <span className="text-error text-xs mt-1 block">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Parent Category <span className="text-error">*</span></label>
          <select 
            className={`form-control ${errors.categoryId ? 'border-error focus:ring-error' : ''}`}
            {...register('categoryId')}
          >
            <option value="" disabled>Select a category...</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <span className="text-error text-xs mt-1 block">{errors.categoryId.message}</span>}
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Description <span className="text-error">*</span></label>
          <textarea 
            className={`form-control ${errors.description ? 'border-error focus:ring-error' : ''}`}
            placeholder="Brief description of the service..." 
            rows={3}
            {...register('description')}
          ></textarea>
          {errors.description && <span className="text-error text-xs mt-1 block">{errors.description.message}</span>}
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Service Image {isEditing ? '' : <span className="text-error">*</span>}</label>
          
          {(selectedRawFile || initialData?.image) ? (
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden border border-border group">
                <Cropper
                  image={selectedRawFile ? URL.createObjectURL(selectedRawFile) : initialData?.image!}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <button 
                type="button" 
                className="btn btn-secondary text-sm self-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-image mr-2"></i> {selectedRawFile ? "Change Image" : "Replace Image"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div 
                className="w-full h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors overflow-hidden relative bg-surface"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center text-secondary">
                  <i className="fas fa-image text-3xl mb-2 opacity-50"></i>
                  <span className="text-sm opacity-70">No image selected</span>
                  <span className="text-xs opacity-50 mt-1">Supported formats: JPG, PNG, WEBP (Max 5MB)</span>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-primary text-sm self-start"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-plus mr-2"></i> Add Image
              </button>
            </div>
          )}
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
          />
          {errors.rawImage && <span className="text-error text-xs mt-2 block">{errors.rawImage.message}</span>}
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Initial Status</label>
          <select 
            className={`form-control ${errors.status ? 'border-error focus:ring-error' : ''}`}
            {...register('status')}
          >
            <option value="ACTIVE">Active (Visible)</option>
            <option value="INACTIVE">Inactive (Hidden)</option>
          </select>
          {errors.status && <span className="text-error text-xs mt-1 block">{errors.status.message}</span>}
        </div>

      </form>
    </AdminModal>
  );
};
