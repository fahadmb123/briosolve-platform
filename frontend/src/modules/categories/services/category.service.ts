import { apiClient } from "../../../shared/api/Client"
import type { response } from "../../../shared/types/Dtos";

interface Category {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  image?: string | null;
  updated_at:string,
  created_at:string,
  services:[]
}



export const addCategory = async (data: FormData): Promise<response<Category>> => {
    const response = await apiClient.post("/api/category/category", data);
    return response.data;
}
export const updateCategory = async ({ id, formData }: { id: string; formData: FormData }): Promise<response<Category>> => {
    const response = await apiClient.patch(`/api/category/category/${id}`, formData)
    return response.data;
}