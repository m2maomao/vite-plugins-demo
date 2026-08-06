/**
 * CHS 用户状态 store
 * 管理 token / user / familyUser / 登录状态
 * 登录时同步 deer-mobile 框架的 useUserStore.token（保证 auth 守卫生效）
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore as useDeerUserStore } from 'deer-mobile/stores';
import { TOKEN_KEY, USER_KEY } from '@/utils/enumerate';

export const useUserStore = defineStore(
  'chs-user',
  () => {
    const token = ref('');
    const user = ref<any>({});
    const familyUser = ref<any>(null);

    const isLoggedIn = computed(() => !!token.value);

    function setToken(newToken: string) {
      token.value = newToken;
      if (newToken) localStorage.setItem(TOKEN_KEY, newToken);
      else localStorage.removeItem(TOKEN_KEY);
      // 同步框架 auth store，使 deer-mobile auth 守卫生效
      useDeerUserStore().setToken(newToken || '');
    }

    function setUser(newUser: any) {
      user.value = newUser || {};
      if (newUser) localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    }

    function setFamilyUser(family: any) {
      familyUser.value = family || null;
    }

    function logout() {
      token.value = '';
      user.value = {};
      familyUser.value = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      useDeerUserStore().logout();
    }

    return {
      token,
      user,
      familyUser,
      isLoggedIn,
      setToken,
      setUser,
      setFamilyUser,
      logout,
    };
  },
  { persist: true },
);
