import React, { useState, useRef, useCallback } from 'react';
import { AdminModal } from '../../admin/components/AdminModal';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../shared/utils/cropImage';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; categoryId: string; categoryName: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedRawFile(file);
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    e.target.value = '';
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !selectedRawFile || !croppedAreaPixels) return;
    
    // Dummy categories for the dropdown selection
    const categories = [
      { id: '1', name: 'Plumbing' },
      { id: '2', name: 'Electrical' }
    ];

    try {
      const croppedImageFile = await getCroppedImg(URL.createObjectURL(selectedRawFile), croppedAreaPixels);
      if (croppedImageFile) {
        const categoryName = categories.find(c => c.id === categoryId)?.name || '';
        
        onAdd({ 
          name, 
          categoryId, 
          categoryName, 
          status,
          imageFile: croppedImageFile 
        });
        
        setName('');
        setCategoryId('');
        setStatus('ACTIVE');
        setSelectedRawFile(null);
        setCroppedAreaPixels(null);
        onClose();
      }
    } catch (err) {
      console.error("Error cropping image", err);
    }
  };

  const footer = (
    <>
      <button className="btn btn-secondary text-sm" onClick={onClose} type="button">
        Cancel
      </button>
      <button className="btn btn-primary text-sm" onClick={handleSubmit} type="button" disabled={!name || !categoryId || !selectedRawFile}>
        Add Service
      </button>
    </>
  );

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Add New Service" icon="fas fa-plus-circle" footer={footer}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Service Name <span className="text-error">*</span></label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Pipe Leak Repair" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Parent Category <span className="text-error">*</span></label>
          <select 
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="" disabled>Select a category...</option>
            {/* Dummy categories */}
            <option value="1">Plumbing</option>
            <option value="2">Electrical</option>
          </select>
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Service Image <span className="text-error">*</span></label>
          
          {selectedRawFile ? (
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden border border-border group">
                <Cropper
                  image={URL.createObjectURL(selectedRawFile)}
                  crop={crop}
                  zoom={zoom}
                  aspect={16/9}
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
                <i className="fas fa-image mr-2"></i> Change Image
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
        </div>

        <div className="form-group">
          <label className="text-sm font-semibold mb-1 block">Initial Status</label>
          <select 
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
          >
            <option value="ACTIVE">Active (Visible)</option>
            <option value="INACTIVE">Inactive (Hidden)</option>
          </select>
        </div>

      </form>
    </AdminModal>
  );
};
