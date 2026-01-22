import apiClient from './apiClient';
import type { ApiResponse, Ubicacion } from '../types';

export const ubicacionService = {
    getUbicaciones: async (): Promise<ApiResponse<Ubicacion[]>> => {
        const response = await apiClient.get('/ubicaciones');
        return response.data;
    },

    createUbicacion: async (data: any): Promise<ApiResponse<Ubicacion>> => {
        const response = await apiClient.post('/ubicaciones', data);
        return response.data;
    },

    updateUbicacion: async (id: number, data: any): Promise<ApiResponse<Ubicacion>> => {
        const response = await apiClient.put(`/ubicaciones/${id}`, data);
        return response.data;
    },

    deleteUbicacion: async (id: number): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/ubicaciones/${id}`);
        return response.data;
    },
};
