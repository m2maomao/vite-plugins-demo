import { http, HttpClient } from 'deer-mobile/utils';
import type { HttpClientOptions } from 'deer-mobile/utils';

/**
 * useHttp — 在 Vue 组件中便捷使用 HttpClient
 *
 * 用法：
 *   const { http, createClient } = useHttp()
 *   http.get('/api/users')
 *   const customClient = createClient({ baseURL: '/api/v2' })
 */
export function useHttp() {
  /**
   * 创建独立的 HttpClient 实例
   * @param options 配置项（可选，不传则使用默认实例）
   */
  function createClient(options?: HttpClientOptions) {
    return new HttpClient(options);
  }

  return {
    /** 默认 HttpClient 实例（使用 appConfig 配置） */
    http,
    /** 创建独立实例的方法 */
    createClient,
  };
}
