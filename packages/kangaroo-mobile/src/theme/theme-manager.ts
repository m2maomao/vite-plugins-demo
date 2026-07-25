/**
 * Kangaroo Mobile — ThemeManager
 *
 * 运行时主题管理器。
 * 基于 CSS 变量实现，修改 :root 上的 --yh-* 变量即可实时更新所有组件。
 * Vant 4 已用 var(--van-*) 引用 --yh-* 变量，自动级联更新。
 */

// ============================================
// 类型定义
// ============================================

export interface ThemeConfig {
  /** 主色，如 '#1677ff' */
  primaryColor: string;
  /** 是否暗黑模式 */
  darkMode: boolean;
}

export type ThemeListener = (theme: ThemeConfig) => void;

// ============================================
// 默认主题
// ============================================

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#1677ff',
  darkMode: false,
};

const STORAGE_KEY = 'kangaroo-theme';

// ============================================
// 持久化
// ============================================

function loadThemeFromStorage(): ThemeConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ThemeConfig>;
    if (typeof parsed.primaryColor === 'string' && typeof parsed.darkMode === 'boolean') {
      return parsed as ThemeConfig;
    }
    return null;
  } catch {
    return null;
  }
}

function saveThemeToStorage(theme: ThemeConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // localStorage 不可用时静默失败
  }
}

// ============================================
// ThemeManager 类
// ============================================

class ThemeManager {
  private currentTheme: ThemeConfig;
  private listeners = new Set<ThemeListener>();

  constructor() {
    this.currentTheme = loadThemeFromStorage() ?? { ...DEFAULT_THEME };
    this.applyTheme(this.currentTheme);
  }

  // ==========================================
  // 内部方法
  // ==========================================

  /** 将主题应用到 DOM */
  private applyTheme(theme: ThemeConfig) {
    const root = document.documentElement;

    // 1. 设置主色 CSS 变量（所有 --van-*: var(--yh-primary-color) 自动级联）
    root.style.setProperty('--yh-primary-color', theme.primaryColor);

    // 2. 暗黑模式（Vant 官方方案）
    root.classList.toggle('van-theme-dark', theme.darkMode);

    // 3. Tailwind 暗黑模式（class 策略）
    root.classList.toggle('dark', theme.darkMode);

    // 4. 持久化
    saveThemeToStorage(theme);

    // 5. 通知监听器
    this.listeners.forEach((fn) => fn(theme));
  }

  // ==========================================
  // 公开 API
  // ==========================================

  /** 获取当前主题（返回副本，不可直接修改） */
  getTheme(): ThemeConfig {
    return { ...this.currentTheme };
  }

  /** 设置主色 */
  setPrimaryColor(color: string): void {
    this.currentTheme.primaryColor = color;
    this.applyTheme(this.currentTheme);
  }

  /** 设置暗黑模式 */
  setDarkMode(enabled: boolean): void {
    this.currentTheme.darkMode = enabled;
    this.applyTheme(this.currentTheme);
  }

  /** 切换暗黑模式 */
  toggleDarkMode(): void {
    this.setDarkMode(!this.currentTheme.darkMode);
  }

  /** 重置为主题默认值 */
  resetTheme(): void {
    this.currentTheme = { ...DEFAULT_THEME };
    this.applyTheme(this.currentTheme);
  }

  /** 订阅主题变化，返回取消订阅函数 */
  onThemeChange(callback: ThemeListener): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

/** 全局单例 */
export const themeManager = new ThemeManager();
