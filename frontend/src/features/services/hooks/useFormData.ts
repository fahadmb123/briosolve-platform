export const useServiceFormData = ()=>{
    return ( name: string, category_id: string, description: string, status: 'ACTIVE' | 'INACTIVE', imageFile: File | null )=>{
        const formData = new FormData()
        formData.append('name', name)
        formData.append('category_id', category_id)
        formData.append('description', description)
        formData.append('status', status)
        if (imageFile) formData.append('image', imageFile)
        return formData
    }
}
