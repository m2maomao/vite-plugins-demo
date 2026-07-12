/**
 * Vant 图标兜底白名单
 * 仅用于 Iconify 不存在的 Vant 特有图标
 */
export const VANT_FALLBACK_ICONS = new Set([
  'coupon-o',
  'balance-o',
  'records',
  'todo-list-o',
  'smile-comment-o',
  'photo-fail',
  'back',
  'search',
  'chevron-right',
  // TabBar 常用图标
  'home-o',
  'friends-o',
  'setting-o',
  // Cell 常用图标
  'location-o',
  'shop-o',
  // 通用
  'arrow',
  'arrow-down',
  'arrow-up',
  'arrow-left',
  'cross',
  'success',
  'fail',
  'plus',
])

/**
 * 判断是否是 Vant 兜底图标
 */
export function isVantFallback(name: string): boolean {
  return VANT_FALLBACK_ICONS.has(name)
}