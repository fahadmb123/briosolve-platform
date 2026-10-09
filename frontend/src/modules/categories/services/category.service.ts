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
    // Axios automatically sets the correct multipart/form-data headers with the boundary
    // when you pass a FormData object directly.
    const response = await apiClient.post("/api/category/category", data);
    return response.data;
}