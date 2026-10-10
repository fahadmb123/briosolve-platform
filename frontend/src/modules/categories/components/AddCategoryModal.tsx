import React from 'react';
import { AdminModal } from '../../admin/components/AdminModal';
import Cropper from 'react-easy-crop';
import { useAddCategory } from '../hooks/useAddCategory';

interface AddCategoryModalProps {
  isOpen: boolean;
  initialData?: { id?: string; name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; image?: string | null } | null;
  onClose: () => void;
  onAdd: (data: { name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, initialData, onClose, onAdd }) => {
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
    onSubmit,
    handleFieldChange,
    handleInteractionStart,
    hasChanges} = useAddCategory({ initialData, onAdd, onClose });

  const isEditing = !!initialData;

  const footer = (
    <>
      <button className="btn btn-secondary text-sm" onClick={onClose} type="button">
        Cancel
      </button>
      <button className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed" onClick={onSubmit} type="button" disabled={!isValid || (!isEditing && !selectedRawFile) || !hasChanges}>
        {isEditing ? 'Save Changes' : 'Add Category'}
      </button>
    </>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Category" : "Add New Category"} icon={isEditing ? "fas fa-edit" : "fas fa-plus-circle"} footer={footer}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" onChange={handleFieldChange}>
        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Category Name <span className="text-error">*</span></label>
          <input 
            type="text" 
            className={`form-control ${errors.name ? 'border-error' : ''}`}
            placeholder="e.g. Plumbing" 
            {...register('name')}
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
        </div>
        
        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Description</label>
          <textarea 
            className={`form-control min-h-[100px] ${errors.description ? 'border-error' : ''}`}
            placeholder="Provide a brief description of the category..."
            {...register('description')}
          ></textarea>
          {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Category Image {!isEditing && <span className="text-error">*</span>}</label>
          
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
                  onInteractionStart={handleInteractionStart}
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
                className={`btn btn-primary text-sm self-start ${errors.rawImage ? 'border-error border' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-plus mr-2"></i> Add Image
              </button>
            </div>
          )}
          {errors.rawImage && <p className="text-error text-xs mt-2">{errors.rawImage.message}</p>}
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Initial Status</label>
          <select 
            className={`form-control ${errors.status ? 'border-error' : ''}`}
            {...register('status')}
          >
            <option value="ACTIVE">Active (Visible)</option>
            <option value="INACTIVE">Inactive (Hidden)</option>
          </select>
          {errors.status && <p className="text-error text-xs mt-1">{errors.status.message}</p>}
        </div>
      </form>
    </AdminModal>
  );
};
