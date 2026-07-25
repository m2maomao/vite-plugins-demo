/**
 * Kangaroo Mobile — useTheme
 *
 * Vue 3 组合式 API 封装，提供响应式的主题访问和操作方法。
 *
 * 用法：
 * ```ts
 * const { theme, setPrimaryColor, toggleDarkMode } = useTheme()
 * ```
 */
import { reactive, readonly, onMounted, onUnmounted } from 'vue';
import { themeManager, type ThemeConfig } from './theme-manager';

export { themeManager };

export function useTheme() {
  const theme = reactive<ThemeConfig>({
    primaryColor: themeManager.getTheme().primaryColor,
    darkMode: themeManager.getTheme().darkMode,
  });

  let unsubscribe: (() => void) | null = null;

  onMounted(() => {
    unsubscribe = themeManager.onThemeChange((t) => {
      theme.primaryColor = t.primaryColor;
      theme.darkMode = t.darkMode;
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return {
    /** 当前主题（只读响应式） */
    theme: readonly(theme),

    /** 设置主色 */
    setPrimaryColor: (color: string) => themeManager.setPrimaryColor(color),

    /** 设置暗黑模式 */
    setDarkMode: (enabled: boolean) => themeManager.setDarkMode(enabled),

    /** 切换暗黑模式 */
    toggleDarkMode: () => themeManager.toggleDarkMode(),

    /** 重置为默认主题 */
    resetTheme: () => themeManager.resetTheme(),
  };
}
