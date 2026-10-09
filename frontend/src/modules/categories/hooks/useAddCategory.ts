import { useState, useRef, useCallback } from 'react';
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
  onAdd: (data: { name: string; description: string; status: 'ACTIVE' | 'INACTIVE'; imageFile: File | null }) => Promise<void> | void;
  onClose: () => void;
}

export const useAddCategory = ({ onAdd, onClose }: UseAddCategoryProps) => {
  const form = useForm<AddCategoryFormData>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'ACTIVE',
      rawImage: undefined as unknown as File,
    },
    mode: 'onChange',
  });

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
    if (!selectedRawFile || !croppedAreaPixels) return;

    try {
      const croppedImageFile = await getCroppedImg(URL.createObjectURL(selectedRawFile), croppedAreaPixels);
      if (croppedImageFile) {
        await onAdd({ ...data, imageFile: croppedImageFile })
        reset();
        setCroppedAreaPixels(null);
        onClose()
      }
    } catch (err) {
      console.error(err)
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
