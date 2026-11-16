import React, { useState } from 'react';
import { AdminModal } from '../../admin/components/AdminModal';
import Cropper from 'react-easy-crop';
import { useAddService } from '../hooks/useAddService';
import type { ServiceQuestion } from '../hooks/useServiceFormData';

interface AddServiceModalProps {
  isOpen: boolean;
  initialData?: {
    id?: string;
    categoryId: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    image?: string | null;
    questions?: ServiceQuestion[] | null;
  } | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
  onAdd: (data: {
    name: string;
    categoryId: string;
    categoryName: string;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
    imageFile: File | null;
    questions?: ServiceQuestion[] | null;
  }) => void;
  isLoading?: boolean;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  initialData,
  categories,
  onClose,
  onAdd,
  isLoading = false
}) => {
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
    hasChanges,
    questions,
    handleAddQuestion,
    handleRemoveQuestion,
    handleUpdateQuestion,
    handleAddQuestionOption,
    handleRemoveQuestionOption
  } = useAddService({ initialData, onAdd, onClose, categories });

  const [optionInputs, setOptionInputs] = useState<Record<string, string>>({});

  const handleOptionInputChange = (questionId: string, val: string) => {
    setOptionInputs((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleAddOptionSubmit = (questionId: string) => {
    const val = (optionInputs[questionId] || '').trim();
    if (val) {
      handleAddQuestionOption(questionId, val);
      setOptionInputs((prev) => ({ ...prev, [questionId]: '' }));
    }
  };

  const isEditing = !!initialData;

  const footer = (
    <>
      <button className="btn btn-secondary text-sm" onClick={onClose} type="button">
        Cancel
      </button>
      <button
        className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSubmit}
        type="button"
        disabled={isLoading || !isValid || (!isEditing && !selectedRawFile) || !hasChanges}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-1"></i> Saving...
          </>
        ) : (
          isEditing ? 'Save Changes' : 'Add Service'
        )}
      </button>
    </>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Service" : "Add New Service"}
      icon={isEditing ? "fas fa-edit" : "fas fa-plus-circle"}
      footer={footer}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" onChange={handleFieldChange}>
        
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

        <div className="form-group border-t border-border pt-4 mt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-semibold block text-text">Custom Service Questionnaire</label>
              <p className="text-xs text-secondary mt-0.5">
                Define specific questions customers must answer when booking this service.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary text-xs py-1.5 px-3"
              onClick={handleAddQuestion}
            >
              <i className="fas fa-plus mr-1.5 text-primary"></i> Add Question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="p-4 border border-dashed border-border rounded-lg text-center bg-surface/50">
              <i className="fas fa-question-circle text-2xl text-secondary/40 mb-1 block"></i>
              <p className="text-xs text-secondary">No custom questions added yet.</p>
              <p className="text-[11px] text-secondary/70 mt-0.5">e.g. "What type of AC?", "Appliance age", "Warranty status"</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-surface rounded-lg border border-border flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text uppercase tracking-wider">
                      Question #{idx + 1}
                    </span>
                    <button
                      type="button"
                      className="text-error hover:text-error/80 text-xs font-medium flex items-center gap-1"
                      onClick={() => handleRemoveQuestion(q.id)}
                    >
                      <i className="fas fa-trash-alt"></i> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-secondary mb-1 block font-medium">Question Label</label>
                      <input
                        type="text"
                        className="form-control text-xs"
                        placeholder="e.g. What type of AC?"
                        value={q.label}
                        onChange={(e) => handleUpdateQuestion(q.id, { label: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-secondary mb-1 block font-medium">Answer Type</label>
                      <select
                        className="form-control text-xs"
                        value={q.type}
                        onChange={(e) => handleUpdateQuestion(q.id, { type: e.target.value as ServiceQuestion['type'] })}
                      >
                        <option value="TEXT">Short Text</option>
                        <option value="NUMBER">Number</option>
                        <option value="SELECT">Single Choice (Dropdown)</option>
                        <option value="MULTI_SELECT">Multiple Choice</option>
                        <option value="BOOLEAN">Yes / No</option>
                      </select>
                    </div>
                  </div>

                  {(q.type === 'TEXT' || q.type === 'NUMBER') && (
                    <div>
                      <label className="text-xs text-secondary mb-1 block font-medium">Placeholder (Optional)</label>
                      <input
                        type="text"
                        className="form-control text-xs"
                        placeholder="e.g. e.g. Split, Window, or Central"
                        value={q.placeholder || ''}
                        onChange={(e) => handleUpdateQuestion(q.id, { placeholder: e.target.value })}
                      />
                    </div>
                  )}

                  {(q.type === 'SELECT' || q.type === 'MULTI_SELECT') && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-secondary font-medium">Options</label>
                      {q.options && q.options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {q.options.map((opt, optIdx) => (
                            <span
                              key={optIdx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-surface-hover border border-border text-text"
                            >
                              <span>{opt}</span>
                              <button
                                type="button"
                                className="text-secondary hover:text-error ml-1"
                                onClick={() => handleRemoveQuestionOption(q.id, optIdx)}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="form-control text-xs flex-1"
                          placeholder="Type option and click Add"
                          value={optionInputs[q.id] || ''}
                          onChange={(e) => handleOptionInputChange(q.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOptionSubmit(q.id);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary text-xs px-3"
                          onClick={() => handleAddOptionSubmit(q.id)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id={`req_${q.id}`}
                      checked={q.is_required}
                      onChange={(e) => handleUpdateQuestion(q.id, { is_required: e.target.checked })}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor={`req_${q.id}`} className="text-xs text-text cursor-pointer select-none font-medium">
                      Customer must answer this question (Required)
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </form>
    </AdminModal>
  );
};
