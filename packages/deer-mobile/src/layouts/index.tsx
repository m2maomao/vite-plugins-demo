import { defineComponent, computed, watch, h, Transition } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

    // 从路由 meta 读取布局类型（为后续多布局支持预留）
    const layoutType = computed(() => (route.meta?.layout as string) || 'default');

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

    const handleLogout = () => {
      userStore.logout();
      router.push('/login');
    };

    return () => (
      <div class="min-h-screen flex flex-col">
        {/* 头部 */}
        {showNav.value && (
          <header class="p-4 bg-purple-600 text-white flex items-center justify-between">
            <h2 class="m-0 text-xl font-bold">{pageTitle.value || appConfig.title}</h2>
            <button onClick={handleLogout} class="text-sm text-purple-200 hover:text-white cursor-pointer">
              退出登录
            </button>
          </header>
        )}
        {/* 主内容区（带路由过渡动画） */}
        <main class="flex-1 p-6">
          <router-view>
            {{
              default: ({ Component }: { Component: any }) =>
                transitionName.value
                  ? h(Transition, { name: transitionName.value, mode: 'out-in' }, () => h(Component))
                  : h(Component),
            }}
          </router-view>
        </main>
        {/* 底部 */}
        {showNav.value && <footer class="p-3 text-center text-gray-400 text-sm">© 2026 My Framework Demo</footer>}
      </div>
    );
  },
});
