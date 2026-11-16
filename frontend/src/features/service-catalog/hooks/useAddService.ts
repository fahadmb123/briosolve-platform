import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { getCroppedImg } from '../../../shared/utils/cropImage';
import { serviceSchema, type ServiceFormData } from '../schemas/service.schema';
import type { ServiceQuestion } from './useServiceFormData';

export interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface UseAddServiceProps {
    initialData?: {
        id?: string;
        categoryId: string;
        name: string;
        description: string;
        status: 'ACTIVE' | 'INACTIVE';
        image?: string | null;
        questions?: ServiceQuestion[] | null;
    } | null;
    onAdd: (data: {
        name: string;
        categoryId: string;
        categoryName: string;
        description: string;
        status: 'ACTIVE' | 'INACTIVE';
        imageFile: File | null;
        questions?: ServiceQuestion[] | null;
    }) => Promise<void> | void;
    onClose: () => void;
    categories: { id: string; name: string }[];
}

export const useAddService = ({ initialData, onAdd, onClose, categories }: UseAddServiceProps) => {
    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: initialData?.name || '',
            categoryId: initialData?.categoryId || '',
            description: initialData?.description || '',
            status: initialData?.status || 'ACTIVE',
            rawImage: undefined as unknown as File,
        },
        mode: 'onChange',
    });

    const [questions, setQuestions] = useState<ServiceQuestion[]>(initialData?.questions || []);

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                categoryId: initialData.categoryId,
                description: initialData.description,
                status: initialData.status,
                rawImage: undefined as unknown as File,
            });
            setQuestions(initialData.questions || []);
        } else {
            form.reset({ name: '', categoryId: '', description: '', status: 'ACTIVE', rawImage: undefined as unknown as File });
            setQuestions([]);
        }
    }, [initialData, form]);

    const { register, handleSubmit, formState: { errors, isValid }, reset, setValue, watch } = form;

    const selectedRawFile = watch('rawImage');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [, setIsCropping] = useState(false);
    const [isCropModified, setIsCropModified] = useState(false);
    const [isFormChanged, setIsFormChanged] = useState(false);
    
    useEffect(() => {
        setIsFormChanged(false);
        setIsCropModified(false);
    }, [initialData]);

    const handleFieldChange = () => {
        setIsFormChanged(true);
    };

    const handleAddQuestion = () => {
        const newQ: ServiceQuestion = {
            id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            label: '',
            type: 'TEXT',
            is_required: false,
            placeholder: ''
        };
        setQuestions((prev) => [...prev, newQ]);
        setIsFormChanged(true);
    };

    const handleRemoveQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        setIsFormChanged(true);
    };

    const handleUpdateQuestion = (id: string, updated: Partial<ServiceQuestion>) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, ...updated } : q))
        );
        setIsFormChanged(true);
    };

    const handleAddQuestionOption = (id: string, optionText: string) => {
        if (!optionText.trim()) return;
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id !== id) return q;
                const existing = q.options || [];
                if (existing.includes(optionText.trim())) return q;
                return { ...q, options: [...existing, optionText.trim()] };
            })
        );
        setIsFormChanged(true);
    };

    const handleRemoveQuestionOption = (id: string, optionIndex: number) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id !== id) return q;
                const existing = q.options || [];
                return { ...q, options: existing.filter((_, idx) => idx !== optionIndex) };
            })
        );
        setIsFormChanged(true);
    };
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCropChange = (newCrop: { x: number, y: number }) => {
        setCrop(newCrop);
    };

    const handleZoomChange = (newZoom: number) => {
        setZoom(newZoom);
    };

    const handleInteractionStart = () => {
        setIsCropModified(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
            
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast.error("Only .jpg, .jpeg, .png and .webp formats are supported");
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast.error("Max image size is 5MB");
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            setValue('rawImage', file, { shouldValidate: true });
            setIsCropping(true);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setIsCropModified(true);
        }
        e.target.value = '';
    };

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        try {
            let croppedImageFile: File | null = null;
            if (selectedRawFile && croppedAreaPixels) {
                croppedImageFile = await getCroppedImg(URL.createObjectURL(selectedRawFile), croppedAreaPixels);
            } else if (initialData?.image && croppedAreaPixels && isCropModified) {
                croppedImageFile = await getCroppedImg(initialData.image, croppedAreaPixels);
            }

            if (croppedImageFile || initialData) {
                const categoryName = categories.find(c => c.id === data.categoryId)?.name || '';

                await onAdd({ 
                    name: data.name,
                    categoryId: data.categoryId,
                    categoryName,
                    description: data.description,
                    status: data.status,
                    imageFile: croppedImageFile,
                    questions
                });
                
                reset();
                setCroppedAreaPixels(null);
                setIsCropModified(false);
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    });

    return {
        register,
        errors,
        isValid,
        selectedRawFile,
        crop,
        setCrop: handleCropChange,
        zoom,
        setZoom: handleZoomChange,
        fileInputRef,
        handleImageChange,
        onCropComplete,
        onSubmit,
        handleFieldChange,
        handleInteractionStart,
        hasChanges: !!initialData ? (isFormChanged || isCropModified) : true,
        questions,
        handleAddQuestion,
        handleRemoveQuestion,
        handleUpdateQuestion,
        handleAddQuestionOption,
        handleRemoveQuestionOption
    };
};
