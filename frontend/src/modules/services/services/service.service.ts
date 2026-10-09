import { apiClient } from "../../../shared/api/Client"

export const getServices = async (params: { page?: number, limit?: number, search?: string, filter?: string }) => {
    const response = await apiClient.get('/api/service', { params })
    return response.data;
}

export const addService = async (data: FormData) => {
    const response = await apiClient.post('/api/service', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;
}

export const updateService = async ({ id, data }: { id: string, data: FormData }) => {
    const response = await apiClient.patch(`/api/service/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;
}

export const deleteService = async (id: string) => {
    const response = await apiClient.delete(`/api/service/${id}`)
    return response.data;
}
