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

const MAX_RETRIES = 5;
const baseDelayMs = 1000;
const isTransientError = (err: any) => {
    const status = err?.response?.status;
    return (
        err?.code === 'ECONNABORTED' ||
        !err?.response ||
        (typeof status === 'number' && status >= 500 && status <= 504)
    );
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const notifyColdStart = (attempt: number, delayMs: number) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('backend:coldstart', { detail: { attempt, delayMs } }));
    }
};
const notifyRecovered = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('backend:recovered'));
    }
};
const withRetry = async <R>(fn: () => Promise<R>, opts?: { silent?: boolean }): Promise<R> => {
    let lastErr: any;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const res = await fn();
            if (attempt > 0) notifyRecovered();
            return res;
        } catch (err: any) {
            lastErr = err;
            if (!isTransientError(err) || attempt === MAX_RETRIES) break;
            const delay = baseDelayMs * Math.pow(2, attempt);
            if (!opts?.silent) notifyColdStart(attempt + 1, delay);
            await sleep(delay);
        }
    }
    throw lastErr;
};

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
    const silent = String((config?.headers as Record<string, unknown> | undefined)?.['x-silent']) === 'true';
    if (!bypass) {
        const key = buildKey(url, config as AxiosRequestConfig<unknown>);
        const hit = cacheStore.get(key);
        if (hit && hit.expiry > Date.now()) {
            return Promise.resolve(hit.response as R);
        }
        const res = await withRetry(() => originalGet<T, R, D>(url, config), { silent });
        cacheStore.set(key, { expiry: Date.now() + TTL_MS, response: res as R });
        return res;
    }
    return withRetry(() => originalGet<T, R, D>(url, config), { silent });
};
apiClient.post = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const silent = String((config?.headers as Record<string, unknown> | undefined)?.['x-silent']) === 'true';
    const res = await withRetry(() => originalPost<T, R, D>(url, data, config), { silent });
    cacheStore.clear();
    return res;
};
apiClient.put = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    data?: D | undefined,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const silent = String((config?.headers as Record<string, unknown> | undefined)?.['x-silent']) === 'true';
    const res = await withRetry(() => originalPut<T, R, D>(url, data, config), { silent });
    cacheStore.clear();
    return res;
};
apiClient.delete = async <T = any, R = AxiosResponse<T, any, {}>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D> | undefined
): Promise<R> => {
    const silent = String((config?.headers as Record<string, unknown> | undefined)?.['x-silent']) === 'true';
    const res = await withRetry(() => originalDelete<T, R, D>(url, config), { silent });
    cacheStore.clear();
    return res;
};

export default apiClient;
