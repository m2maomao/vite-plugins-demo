/**
 * 移动端适配方案 — 运行时 rem 动态缩放
 *
 * 原理（与 uni-app H5 一致，类似 lib-flexible）：
 *   动态设置 <html> 的 font-size，使所有 rem 单位按屏幕宽度等比缩放。
 *   公式：rootFontSize = 16 * (clientWidth / baseWidth)
 *
 * 使用方式：
 *   项目启动时调用一次即可：import 'deer-mobile/utils/flexible'
 */

export interface FlexibleOptions {
  /** 设计稿基准宽度（px），默认 375（iPhone SE 宽度） */
  baseWidth?: number;
  /** 最大适配宽度（px），超过此宽度不再缩放，默认 960 */
  maxWidth?: number;
  /** 基础字体大小（px），默认 16 */
  rootFontSize?: number;
  /** 是否禁用自动缩放，默认 false */
  disabled?: boolean;
}

/**
 * 启动移动端 rem 适配
 * @param options 配置选项
 * @returns 清理函数，用于移除 resize 监听
 */
export function setupFlexible(options: FlexibleOptions = {}): () => void {
  const { baseWidth = 375, maxWidth = 960, rootFontSize = 16, disabled = false } = options;

  if (disabled || typeof document === 'undefined') {
    return () => {};
  }

  function setRootFontSize() {
    const clientWidth = document.documentElement.clientWidth;
    // 超过最大宽度时固定为基准值，停止放大
    const width = clientWidth > maxWidth ? baseWidth : clientWidth;
    const scale = width / baseWidth;
    document.documentElement.style.fontSize = rootFontSize * scale + 'px';
  }

  // 首次设置
  setRootFontSize();

  // 监听窗口变化
  window.addEventListener('resize', setRootFontSize);

  // 返回清理函数
  return () => {
    window.removeEventListener('resize', setRootFontSize);
  };
}

// 默认导出，直接调用 setupFlexible()
export default setupFlexible;
