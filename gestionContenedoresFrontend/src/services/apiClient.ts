import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
    'https://gestion-de-contenedores.onrender.com/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 12000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const cacheStore = new Map<string, { expiry: number; response: unknown }>();
const TTL_MS = 300000;
const buildKey = (url: string, config?: AxiosRequestConfig<unknown>) => {
    const token = localStorage.getItem('auth_token') || '';
    const params = config?.params ? JSON.stringify(config.params) : '';
    return `${url}|${params}|${token}`;
};
const originalGet = apiClient.get.bind(apiClient) as <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
const originalPost = apiClient.post.bind(apiClient) as <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
const originalPut = apiClient.put.bind(apiClient) as <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
const originalDelete = apiClient.delete.bind(apiClient) as <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
) => Promise<R>;
apiClient.get = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const bypassHeader = (config?.headers as Record<string, unknown> | undefined)?.['x-cache-bypass'];
    const bypass = String(bypassHeader) === 'true';
    if (!bypass) {
        const key = buildKey(url, config as AxiosRequestConfig<unknown>);
        const hit = cacheStore.get(key);
        if (hit && hit.expiry > Date.now()) {
            return Promise.resolve(hit.response as R);
        }
        const res = await originalGet<T, R, D>(url, config);
        cacheStore.set(key, { expiry: Date.now() + TTL_MS, response: res as R });
        return res;
    }
    return originalGet<T, R, D>(url, config);
};
apiClient.post = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const res = await originalPost<T, R, D>(url, data, config);
    cacheStore.clear();
    return res;
};
apiClient.put = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const res = await originalPut<T, R, D>(url, data, config);
    cacheStore.clear();
    return res;
};
apiClient.delete = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const res = await originalDelete<T, R, D>(url, config);
    cacheStore.clear();
    return res;
};

export default apiClient;
