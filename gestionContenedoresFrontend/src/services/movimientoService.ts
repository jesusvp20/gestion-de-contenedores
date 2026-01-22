import apiClient from './apiClient';
import type { ApiResponse, Movimiento } from '../types';

export const movimientoService = {
    getMovimientos: async (): Promise<ApiResponse<Movimiento[]>> => {
        const response = await apiClient.get('/movimientos');
        return response.data;
    },

    createMovimiento: async (data: any): Promise<ApiResponse<Movimiento>> => {
        const response = await apiClient.post('/movimientos', data);
        return response.data;
    },
};
