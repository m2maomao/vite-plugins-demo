import type { Plugin, ResolvedConfig } from 'vite';

// 定义插件的配置参数类型
interface LoggerPluginOptions {
  prefix?: string;
  showFileList?: boolean;
}

export default function loggerPlugin(options: LoggerPluginOptions = {}): Plugin {
  const { prefix = '🔧' } = options;

  // 保存解析后的配置，供其他钩子使用
  let config: ResolvedConfig;

  return {
    name: 'logger-plugin',

    // configResolved在 Vite 配置完全解析后调用
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      console.log(`${prefix} Vite config resolved:`, config.root);
    },

    transform(_code, _id) {
      // console.log(`${prefix} transforming:`, id)
    },
    buildEnd() {
      console.log(`${prefix} build ended`);
    },
  };
}
