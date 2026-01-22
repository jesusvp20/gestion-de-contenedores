import apiClient from './apiClient';
import type { ApiResponse, Contenedor } from '../types';

export const contenedorService = {
    getContenedores: async (): Promise<ApiResponse<Contenedor[]>> => {
        const response = await apiClient.get('/contenedores');
        return response.data;
    },

    createContenedor: async (data: any): Promise<ApiResponse<Contenedor>> => {
        const response = await apiClient.post('/contenedores', data);
        return response.data;
    },

    updateContenedor: async (id: number, data: any): Promise<ApiResponse<Contenedor>> => {
        const response = await apiClient.put(`/contenedores/${id}`, data);
        return response.data;
    },

    deleteContenedor: async (id: number): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/contenedores/${id}`);
        return response.data;
    },
};
