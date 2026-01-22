import apiClient from './apiClient';
import type { ApiResponse, Cliente } from '../types';

export const clienteService = {
    getClientes: async (): Promise<ApiResponse<Cliente[]>> => {
        const response = await apiClient.get('/clientes');
        return response.data;
    },

    createCliente: async (data: any): Promise<ApiResponse<Cliente>> => {
        const response = await apiClient.post('/clientes', data);
        return response.data;
    },

    updateCliente: async (id: number, data: any): Promise<ApiResponse<Cliente>> => {
        const response = await apiClient.put(`/clientes/${id}`, data);
        return response.data;
    },

    deleteCliente: async (id: number): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/clientes/${id}`);
        return response.data;
    },
};
