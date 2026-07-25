/**
 * 虚拟模块 virtual:app-config 的 Mock
 * 用于单元测试环境，模拟 Vite 虚拟模块提供的应用配置
 */
export const appConfig: {
  request: {
    baseURL: string;
  };
  sm4Key: string;
} = {
  request: {
    baseURL: '/api',
  },
  sm4Key: '',
};
