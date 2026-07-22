import type { Plugin } from 'vite';
import { setFrameworkPlugins } from '../_shared';

// 1、应用配置类型
interface AppConfig {
  title: string;
  description: string;
  author: string;
  base: string;
  theme: {
    primaryColor: string;
    darkMode: boolean;
  };
  layout: 'side' | 'top' | 'mix';
  noNavPages: string[];
  request: {
    baseURL: string;
  };
  /** SM4 加密密钥（hex 格式，32 位十六进制字符串），不配置则不启用加解密 */
  sm4Key?: string;
  /** 国际化 i18n 配置 */
  i18n?: {
    /** 默认语言，如 'zh-CN' */
    locale: string;
    /** 回退语言 */
    fallbackLocale?: string;
    /** vue-i18n 格式的翻译文案 */
    messages?: Record<string, Record<string, Record<string, string>>>;
  };
}

// 2、默认配置
const DEFAULT_CONFIG: AppConfig = {
  title: 'My App',
  description: 'A Vite-powered app',
  author: 'zhangguolong',
  base: '/',
  theme: {
    primaryColor: '#1890ff',
    darkMode: false,
  },
  layout: 'side',
  noNavPages: ['/login', '/404'],
  request: {
    baseURL: '/api',
  },
};

// 3、插件选项类型（用户传参用，都是可选的）
type ConfigPluginOptions = Partial<AppConfig>;

// 4、插件函数

// 新增：虚拟模块标识符
const VIRTUAL_MODULE_ID = 'virtual:app-config';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

export default function configPlugin(
  options: ConfigPluginOptions = {},
  frameworkPlugins: FrameworkPlugin[] = [],
): Plugin {
  // 保存到共享状态
  setFrameworkPlugins(frameworkPlugins);
  // 合并用户配置和默认配置
  const mergedConfig: AppConfig = {
    ...DEFAULT_CONFIG,
    ...options,
  };
  return {
    name: 'config-plugin',
    // 新增：config 钩子，可以修改 Vite 配置
    config() {
      // console.log('⚙️ 应用配置：', mergedConfig)
      // console.log('🔌 框架插件：', frameworkPlugins.map(p => p.name))
      return {
        base: mergedConfig.base,
      };
    },
    // 新增：处理 import 'virtual:app-config'
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `export const appConfig = ${JSON.stringify(mergedConfig)}`;
      }
    },
  };
}

export interface FrameworkPlugin {
  name: string;
  onImport?: () => string;
  // 返回要在浏览器执行的代码字符串
  onRuntime?: () => string;
}
