import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

/**
 * 用户认证 Store
 * 管理登录 token、登录状态等认证相关状态，自动同步 localStorage
 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') ?? '');
  const isLoggedIn = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  }

  function logout() {
    token.value = '';
    localStorage.removeItem('token');
  }

  return {
    token,
    isLoggedIn,
    setToken,
    logout,
  };
});
