export interface ServiceQuestion {
    id: string;
    label: string;
    type: "TEXT" | "NUMBER" | "SELECT" | "MULTI_SELECT" | "BOOLEAN";
    options?: string[];
    is_required: boolean;
    placeholder?: string;
}

export const useServiceFormData = () => {
    return (
        name: string,
        category_id: string,
        description: string,
        status: 'ACTIVE' | 'INACTIVE',
        imageFile: File | null,
        questions?: ServiceQuestion[] | null
    ) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category_id', category_id);
        formData.append('description', description);
        formData.append('status', status);
        if (imageFile) formData.append('image', imageFile);
        if (questions !== undefined && questions !== null) {
            formData.append('questions', JSON.stringify(questions));
        }
        return formData;
    };
};
