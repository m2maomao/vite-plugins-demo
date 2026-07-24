import { defineComponent, computed, watch, h, Transition, KeepAlive } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { appConfig } from 'virtual:app-config';
import { useUserStore } from 'deer-mobile/stores';

/**
 * 路由过渡动画名称映射
 */
const TRANSITION_MAP: Record<string, string> = {
  'slide-left': 'route-slide-left',
  'slide-right': 'route-slide-right',
  fade: 'route-fade',
  'slide-up': 'route-slide-up',
};

/**
 * 默认布局 — 带顶部导航栏、页面标题、底部 footer 和过渡动画
 *
 * 布局插槽（通过 route.meta.slots 传入）：
 * - headerLeft: 头部左侧自定义内容（替换标题）
 * - headerRight: 头部右侧自定义内容（替换退出按钮）
 * - headerClass: 头部自定义 CSS class
 *
 * 缓存控制（通过 route.meta.keepAlive 控制）：
 * - keepAlive: true  （默认）缓存页面状态
 * - keepAlive: false  不缓存
 */
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    // 从路由 meta 读取标题
    const pageTitle = computed(() => (route.meta?.title as string) || '');
    watch(
      pageTitle,
      (title) => {
        document.title = title ? `${title} - ${appConfig.title}` : appConfig.title;
      },
      { immediate: true },
    );

    // 过渡动画名称
    const transitionName = computed(() => {
      const t = route.meta?.transition as string;
      return TRANSITION_MAP[t] || '';
    });

    // 是否显示导航栏
    const showNav = computed(() => {
      if (route.meta?.noNav === true) return false;
      return !(appConfig.noNavPages || []).includes(route.path);
    });

    // 布局插槽
    const slots = computed(() => (route.meta?.slots || {}) as Record<string, any>);

    // 是否缓存页面
    const keepAlive = computed(() => route.meta?.keepAlive !== false);

    const handleLogout = () => {
      userStore.logout();
      router.push('/login');
    };

    // 渲染页面内容（带过渡动画 + KeepAlive）
    const renderContent = () => {
      const content = ({ Component }: { Component: any }) => {
        const inner = transitionName.value
          ? h(Transition, { name: transitionName.value, mode: 'out-in' }, () => h(Component))
          : h(Component);
        return keepAlive.value ? h(KeepAlive, () => inner) : inner;
      };
      return h(RouterView, null, { default: content });
    };

    return () => (
      <div class="min-h-screen flex flex-col">
        {/* 头部 */}
        {showNav.value && (
          <header
            class={`p-4 bg-purple-600 text-white flex items-center justify-between ${slots.value.headerClass || ''}`}>
            {slots.value.headerLeft
              ? slots.value.headerLeft()
              : h('h2', { class: 'm-0 text-xl font-bold' }, pageTitle.value || appConfig.title)}
            {slots.value.headerRight
              ? slots.value.headerRight()
              : h(
                  'button',
                  {
                    onClick: handleLogout,
                    class: 'text-sm text-purple-200 hover:text-white cursor-pointer',
                  },
                  '退出登录',
                )}
          </header>
        )}
        {/* 主内容区 */}
        <main class="flex-1 p-6">{renderContent()}</main>
        {/* 底部 */}
        {showNav.value && <footer class="p-3 text-center text-gray-400 text-sm">© 2026 My Framework Demo</footer>}
      </div>
    );
  },
});
