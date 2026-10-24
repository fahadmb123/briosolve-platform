import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { addCategorySchema, type AddCategoryFormData } from '../schemas/category.schema';
import { getCroppedImg } from '../../../shared/utils/cropImage';


export interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface UseAddCategoryProps {
  initialData?: { id?: string; name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; image?: string | null } | null;
  onAdd: (data: { name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => Promise<void> | void;
  onClose: () => void;
}

export const useAddCategory = ({ initialData, onAdd, onClose }: UseAddCategoryProps) => {
  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      status: initialData?.status || 'ACTIVE',
      rawImage: undefined as unknown as File,
    },
    mode: 'onChange',
  });


  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
        rawImage: undefined as unknown as File,
      });
    } else {
      form.reset({ name: '', description: '', status: 'ACTIVE', rawImage: undefined as unknown as File });
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
        await onAdd({ ...data, imageFile: croppedImageFile });
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
    hasChanges: !!initialData ? (isFormChanged || isCropModified) : true
  };
};
