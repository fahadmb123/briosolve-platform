import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImg } from '../../../utils/cropImage';
import { toast } from 'react-hot-toast';

interface ImageCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentImageUrl?: string | null;
    onCropCompleteAction: (croppedFile: File) => void;
    onDeleteAction?: () => void;
    isLoading?: boolean;
    aspectRatio?: number;
    cropShape?: "round" | "rect";
    title?: string;
    initialFile?: File | null;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
    isOpen,
    onClose,
    currentImageUrl,
    onCropCompleteAction,
    onDeleteAction,
    isLoading = false,
    aspectRatio = 1,
    cropShape = "round",
    title = "Profile Photo",
    initialFile = null
}) => {
    const [imageFile, setImageFile] = useState<File | null>(initialFile);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setImageFile(initialFile);
            setZoom(1);
            setCrop({ x: 0, y: 0 });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && initialFile) {
            setImageFile(initialFile);
        }
    }, [isOpen, initialFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            if (!file.type.startsWith('image/')) {
                toast.error("Please select a valid image file.");
                e.target.value = '';
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB.");
                e.target.value = '';
                return;
            }
            
            setImageFile(file);
        }
        e.target.value = '';
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getFullImageUrl = (url: string | undefined | null) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
    };

    const handleSave = async () => {
        const targetImage = imageFile ? URL.createObjectURL(imageFile) : getFullImageUrl(currentImageUrl);
        if (!targetImage || !croppedAreaPixels) return;
        try {
            const croppedImageFile = await getCroppedImg(targetImage, croppedAreaPixels);
            if (croppedImageFile) {
                onCropCompleteAction(croppedImageFile);
            }
        } catch (e) {
            console.error("Error cropping image", e);
        }
    };

    const hasImageToCrop = !!imageFile || !!currentImageUrl;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface-container rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-surface-variant">
                    <h3 className="text-title-md font-semibold text-on-surface m-0 flex items-center gap-2">
                        <i className="fas fa-image text-primary"></i> {title}
                    </h3>
                    <button 
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                />

                {!hasImageToCrop ? (
                    <div className="p-6 flex flex-col items-center justify-center gap-6">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-surface-variant flex items-center justify-center bg-surface-container-highest">
                            <i className="fas fa-user text-6xl text-on-surface-variant opacity-50"></i>
                        </div>
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium shadow-md hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center gap-2"
                        >
                            <i className="fas fa-camera"></i>
                            Upload Photo
                        </button>
                        
                        <div className="text-center mt-1">
                            <p className="text-xs text-on-surface-variant opacity-70 m-0">
                                <i className="fas fa-info-circle mr-1"></i> Supported formats: JPG, PNG, WEBP
                            </p>
                            <p className="text-xs text-on-surface-variant opacity-70 m-0 mt-1">
                                Maximum file size: 5MB
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative w-full h-[300px] bg-black">
                            <Cropper
                                image={imageFile ? URL.createObjectURL(imageFile) : getFullImageUrl(currentImageUrl)}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspectRatio}
                                cropShape={cropShape}
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-search-minus text-on-surface-variant text-sm"></i>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <i className="fas fa-search-plus text-on-surface-variant text-sm"></i>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-2 w-full">
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isLoading}
                                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-surface-container-highest text-on-surface font-medium hover:bg-surface-variant transition-colors cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <i className="fas fa-camera"></i> Change
                                    </button>
                                    
                                    {currentImageUrl && onDeleteAction && (
                                        <button 
                                            type="button"
                                            onClick={onDeleteAction}
                                            disabled={isLoading}
                                            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20 transition-colors cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <i className="fas fa-trash-alt"></i> Delete
                                        </button>
                                    )}
                                </div>

                                <button 
                                    type="button" 
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-6 py-2 rounded-xl bg-primary text-on-primary font-medium shadow-md hover:opacity-90 transition-opacity cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                                    {isLoading ? 'Saving...' : 'Apply & Save'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
