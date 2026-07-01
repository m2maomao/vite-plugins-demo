import axios from 'axios';
class HttpClient {
    instance;
    constructor(config = {}) {
        this.instance = axios.create({
            baseURL: '/api',
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' },
            ...config,
        });
        // 请求拦截器： 自动带 token
        this.instance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
        // 响应拦截器
        this.instance.interceptors.response.use((response) => response.data, (error) => {
            console.error('🌐 请求失败:', error);
            return Promise.reject(error);
        });
    }
    get(url, params) {
        return this.instance.get(url, { params });
    }
    post(url, data) {
        return this.instance.post(url, data);
    }
    put(url, data) {
        return this.instance.put(url, data);
    }
    delete(url, params) {
        return this.instance.delete(url, { params });
    }
}
export const http = new HttpClient();
export default HttpClient;
