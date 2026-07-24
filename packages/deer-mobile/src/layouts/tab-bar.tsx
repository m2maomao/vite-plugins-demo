import { defineComponent, h, KeepAlive } from 'vue';
import { RouterView } from 'vue-router';
import { YhmTabBar } from 'kangaroo-mobile';
import { appConfig } from 'virtual:app-config';

/** Tab 项类型（匹配 YhmTabBar 的 TabItem 接口） */
interface TabConfig {
  name: string | number;
  label?: string;
  icon?: string;
  activeIcon?: string;
  to?: string;
  badge?: string | number;
  dot?: boolean;
}

/**
 * 默认 Tab 列表（可通过 appConfig.tabs 覆盖）
 */
const DEFAULT_TABS: TabConfig[] = [
  { name: 'home', label: '首页', icon: 'home-o', activeIcon: 'home', to: '/' },
  { name: 'about', label: '关于', icon: 'info-o', activeIcon: 'info', to: '/about' },
  { name: 'profile', label: '我的', icon: 'user-o', activeIcon: 'user', to: '/user/profile' },
];

/**
 * TabBar 布局 — 使用 kangaroo-mobile 的 YhmTabBar 组件
 *
 * 底层基于 Vant 4 VanTabbar，支持：
 * - route 模式自动路由联动、高亮
 * - 双态图标（icon / activeIcon）
 * - 徽标（badge / dot）
 * - SafeArea 底部安全区适配
 * - placeholder 防遮挡
 *
 * 使用方式（在页面文件中）：
 * ```typescript
 * export const routeMeta = { layout: 'tabs' };
 * ```
 *
 * Tab 列表配置（在 vite.config.ts 中）：
 * ```typescript
 * deer({ config: { tabs: [
 *   { name: 'home', label: '首页', icon: 'home', to: '/' },
 * ]}})
 * ```
 */
export default defineComponent({
  setup() {
    // Tab 列表：优先使用 appConfig 中的配置
    const tabs: TabConfig[] = (appConfig as any).tabs || DEFAULT_TABS;

    return (props: any, ctx: any) => {
      const children = ctx?.slots?.default?.();
      return (
        <div class="min-h-screen flex flex-col">
          {/* 页面内容区域 */}
          <main class="flex-1 overflow-auto">
            {children
              ? children() // 嵌套布局
              : h(RouterView, null, {
                  default: ({ Component }: { Component: any }) => h(KeepAlive, () => h(Component)),
                })}
          </main>

          {/* 使用 kangaroo-mobile 的 YhmTabBar（基于 Vant 4） */}
          {h(YhmTabBar, {
            items: tabs,
            route: true,
            fixed: true,
            placeholder: true,
            'safe-area-inset-bottom': true,
          })}
        </div>
      );
    };
  },
});
