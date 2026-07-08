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
])

/**
 * 判断是否是 Vant 兜底图标
 */
export function isVantFallback(name: string): boolean {
  return VANT_FALLBACK_ICONS.has(name)
}