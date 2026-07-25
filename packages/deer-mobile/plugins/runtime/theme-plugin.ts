/**
 * Deer Mobile — Theme Runtime Plugin
 *
 * 运行时主题切换插件。
 * 从 appConfig.theme 读取初始配置，自动应用到 kangaroo-mobile 的 ThemeManager。
 *
 * 优先级: 0（主题应最先初始化，在其他插件之前生效）
 * 钩子: onAppCreated（应用主题配置）
 */
import { themeManager, useTheme } from 'kangaroo-mobile';
import type { RuntimePlugin } from '../../src/runtime/types';

const themeRuntimePlugin: RuntimePlugin = {
  name: 'deer:theme',
  priority: 0,

  onAppCreated: (_app, ctx) => {
    const { theme } = ctx.config;
    if (theme) {
      // 主色：有值才设置
      if (theme.primaryColor) {
        themeManager.setPrimaryColor(theme.primaryColor);
      }
      // 暗黑模式：显式指定 undefined 判断，确保 false 也能关闭暗黑
      if (theme.darkMode !== undefined) {
        themeManager.setDarkMode(theme.darkMode);
      }
    }
  },
};

export default themeRuntimePlugin;
export { themeManager, useTheme };
