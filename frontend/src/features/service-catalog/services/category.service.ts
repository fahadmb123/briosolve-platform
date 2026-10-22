import { apiClient } from "../../../shared/api/Client"
import type { response } from "../../../shared/types/Dtos";

export interface CategoryService {
  id: string;
  name: string;
  description?: string | null;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  image?: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string | null;
  updated_at: string;
  created_at: string;
  services: CategoryService[];
}


type GetCategoriesInput = {
    page?: number;
    limit?: number;
    search?: string;
    filter?: string;
}

export const getCategories = async (params: GetCategoriesInput = {}): Promise<response<{categories:Category[], total: number, totalPages: number}>> => {
    const response = await apiClient.get(`/api/category`, { params })
    return response.data;
}
export const addCategory = async (data: FormData): Promise<response<Category>> => {
    const response = await apiClient.post("/api/category", data);
    return response.data;
}
export const updateCategory = async ({ id, formData }: { id: string; formData: FormData }): Promise<response<Category>> => {
    const response = await apiClient.patch(`/api/category/${id}`, formData)
    return response.data;
}
export const deleteCategory = async (id: string): Promise<response<boolean>> => {
    const response = await apiClient.delete(`/api/category/${id}`)
    return response.data;
}