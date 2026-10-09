import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

  // Keep form in sync if initialData changes (e.g. clicking Edit on a different category)
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        status: initialData.status,
        rawImage: undefined as unknown as File, // User must upload a new image if they edit it, or we can make it optional later
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('rawImage', file, { shouldValidate: true });
      setIsCropping(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    e.target.value = '';
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // If they uploaded a new image, crop it
      let croppedImageFile: File | null = null;
      if (selectedRawFile && croppedAreaPixels) {
        croppedImageFile = await getCroppedImg(URL.createObjectURL(selectedRawFile), croppedAreaPixels);
      }

      // We allow submitting without a new image ONLY if we are editing (initialData exists)
      if (croppedImageFile || initialData) {
        await onAdd({ ...data, imageFile: croppedImageFile });
        reset();
        setCroppedAreaPixels(null);
        onClose(); // Only closes if onAdd didn't throw an error!
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
    setCrop,
    zoom,
    setZoom,
    fileInputRef,
    handleImageChange,
    onCropComplete,
    onSubmit
  };
};
