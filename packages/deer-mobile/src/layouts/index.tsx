import { defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import { appConfig } from 'virtual:app-config';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = useStorage('token', '');
    const showNav = computed(() => !(appConfig.noNavPages || []).includes(route.path));

    const handleLogout = () => {
      token.value = '';
      router.push('/login');
    }

    return () => (
      <div class="min-h-screen flex flex-col">
        {/* 头部 */}
        {
          showNav.value && (
            <header class="p-4 bg-purple-600 text-white flex items-center justify-between">
              <h2 class="m-0 text-xl font-bold">My Framework</h2>
              <button onClick={handleLogout} class="text-sm text-purple-200 hover:text-white cursor-pointer">
                退出登录
              </button>
            </header>
          )
        }
        {/* 主内容区 */}
        <main class="flex-1 p-6">
          <router-view />
        </main>
        {/* 底部 */}
        {
          showNav.value && (
            <footer class="p-3 text-center text-gray-400 text-sm">© 2026 My Framework Demo</footer>
          )
        }
      </div>
    )
  }
})