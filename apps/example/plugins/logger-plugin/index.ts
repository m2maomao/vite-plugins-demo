import type { Plugin, ResolvedConfig } from 'vite';

// 定义插件的配置参数类型
interface LoggerPluginOptions {
  prefix?: string;
  showFileList?: boolean;
}

export default function loggerPlugin(options: LoggerPluginOptions = {}): Plugin {
  // 解构参数，设置默认值
  const { prefix = '🔧', showFileList = false } = options;

  // 保存解析后的配置，供其他钩子使用
  let config: ResolvedConfig;

  return {
    name: 'logger-plugin',

    // configResolved在 Vite 配置完全解析后调用
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    transform(code, id) {},
    buildEnd() {},
  };
}
