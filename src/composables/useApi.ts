import { getCurrentInstance } from 'vue';
import type { api } from 'virtual:api';

export function useApi() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useApi() 必须在 setup() 或生命周期钩子中调用');
  }
  return (instance.proxy as any).$api as typeof api;
}