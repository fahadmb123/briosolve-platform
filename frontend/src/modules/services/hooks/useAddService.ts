import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCroppedImg } from '../../../shared/utils/cropImage';
import { serviceSchema, ServiceFormData } from '../schemas/service.schema';

interface UseAddServiceProps {
    initialData?: { id?: string; categoryId: string; name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; image?: string | null } | null;
    onAdd: (data: { name: string; categoryId: string; categoryName: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => void;
    onClose: () => void;
    categories: { id: string; name: string }[];
}

export const useAddService = ({ initialData, onAdd, onClose, categories }: UseAddServiceProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: initialData?.name || '',
            categoryId: initialData?.categoryId || '',
            description: initialData?.description || '',
            status: initialData?.status || 'ACTIVE'
        },
        mode: 'onChange'
    });

    const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedRawFile(file);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        let finalImageFile: File | null = null;
        if (selectedRawFile && croppedAreaPixels) {
            try {
                finalImageFile = await getCroppedImg(URL.createObjectURL(selectedRawFile), croppedAreaPixels);
            } catch (err) {
                console.error("Error cropping image", err);
                return;
            }
        }
        
        const categoryName = categories.find(c => c.id === data.categoryId)?.name || '';

        onAdd({
            name: data.name,
            categoryId: data.categoryId,
            categoryName,
            description: data.description,
            status: data.status,
            imageFile: finalImageFile
        });
        reset();
        setSelectedRawFile(null);
        setCroppedAreaPixels(null);
    });

    return {
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
    };
};
