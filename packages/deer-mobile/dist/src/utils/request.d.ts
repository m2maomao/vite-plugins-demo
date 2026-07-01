import type { AxiosRequestConfig } from 'axios';
declare class HttpClient {
    private instance;
    constructor(config?: AxiosRequestConfig);
    get<T>(url: string, params?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
    post<T>(url: string, data?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
    put<T>(url: string, data?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
    delete<T>(url: string, params?: any): Promise<import("axios").AxiosResponse<T, any, {}>>;
}
export declare const http: HttpClient;
export default HttpClient;
