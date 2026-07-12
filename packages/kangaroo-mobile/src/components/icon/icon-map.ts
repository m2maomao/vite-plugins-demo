import { VANT_FALLBACK_ICONS } from './vant-fallback'

export const ICON_MAP: Record<string, string> = {
  'back': 'vant:arrow-left',
  'home': 'mdi:home',
  'close': 'mdi:close',
  'search': 'vant:search',
  'chat': 'mdi:chat',
  'bell': 'mdi:bell',
  'cart': 'mdi:cart',
  'chevron-right': 'vant:arrow',
  'lighting-bolt': 'mdi:lightning-bolt',
  // 箭头方向
  'chevron-up': 'mdi:chevron-up',
  'chevron-down': 'mdi:chevron-down',
  'chevron-left': 'mdi:chevron-left',
  // 本地自定义图标（通过 unplugin-icons 的 deer 集合加载）
  'deer': 'deer:mingcute--deer-line',
}

/**
 * 只返回 iconify 图标名
 * 如果找不到，返回空字符串（表示需要 Vant 兜底）
 */
export function resolveIconName(name: string): string {
  // 1️⃣ 业务映射
  if (ICON_MAP[name]) {
    return ICON_MAP[name]
  }

  // 2️⃣ vant: 前缀兼容
  if (name.startsWith('vant:')) {
    console.warn(`[yhm-icon] "vant:" prefix is deprecated.`)
    const vantName = name.replace('vant:', '')
    if (ICON_MAP[vantName]) return ICON_MAP[vantName]
    if (VANT_FALLBACK_ICONS.has(vantName)) return '' // ← 空字符串
    return `mdi:${vantName}`
  }

  // 3️⃣ Vant 兜底
  if (VANT_FALLBACK_ICONS.has(name)) {
    return '' // ← 空字符串
  }

  // 4️⃣ 兜底：直接返回（可能是 iconify 原生 id）
  return name
}

/**
 * 判断是否是 Vant 兜底图标
 */
export function isVantIcon(name: string): boolean {
  return VANT_FALLBACK_ICONS.has(name)
}