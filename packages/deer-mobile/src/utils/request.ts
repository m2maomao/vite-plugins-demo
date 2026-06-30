import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

class HttpClient {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig = {}) {
    this.instance = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      ...config,
    })

    // 请求拦截器： 自动带 token
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    })

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('🌐 请求失败:', error);
        return Promise.reject(error);
      }
    )
  }

  get<T>(url: string, params?: any) {
    return this.instance.get<T>(url, { params })
  }

  post<T>(url: string, data?: any) {
    return this.instance.post<T>(url, data)
  }

  put<T>(url: string, data?: any) {
    return this.instance.put<T>(url, data)
  }

  delete<T>(url: string, params?: any) {
    return this.instance.delete<T>(url, { params })
  }
}

export const http = new HttpClient();
export default HttpClient;