import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * 用户认证 Store
 * 管理登录 token、登录状态等认证相关状态
 * 通过 pinia-plugin-persistedstate 自动持久化到 localStorage
 */
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('');
    const isLoggedIn = computed(() => !!token.value);

    function setToken(newToken: string) {
      token.value = newToken;
    }

    function logout() {
      token.value = '';
    }

    return {
      token,
      isLoggedIn,
      setToken,
      logout,
    };
  },
  { persist: true },
);
