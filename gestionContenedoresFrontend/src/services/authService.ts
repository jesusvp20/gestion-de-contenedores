import apiClient from './apiClient';

export const authService = {
    login: async (credentials: any) => {
        const response = await apiClient.post('/usuarios/login', credentials);
        return response.data;
    },

    register: async (data: any) => {
        const response = await apiClient.post('/usuarios/registrar', data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await apiClient.post('/usuarios/forgot-password', { email });
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/usuarios/logout');
        localStorage.removeItem('auth_token');
        return response.data;
    },
};
