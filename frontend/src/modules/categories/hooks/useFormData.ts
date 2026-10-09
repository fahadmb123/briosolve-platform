export const useCategoryFormData = ()=>{
    return ( name: string, description: string, status: 'ACTIVE' | 'INACTIVE', imageFile: File | null )=>{
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description',description)
        formData.append('status',status)
        if (imageFile) formData.append('image',imageFile)
        return formData
    }
}