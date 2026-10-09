import { axiosInstance } from "../../../../shared/api/axios.js"

export const getServices = async (params: { page?: number, limit?: number, search?: string, filter?: string }) => {
    return await axiosInstance.get('/service', { params })
}

export const addService = async (data: FormData) => {
    return await axiosInstance.post('/service', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const updateService = async ({ id, data }: { id: string, data: FormData }) => {
    return await axiosInstance.patch(`/service/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteService = async (id: string) => {
    return await axiosInstance.delete(`/service/${id}`)
}
