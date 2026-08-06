/**
 * 登录目录父路由
 * scan-pages-plugin 约定：目录需存在 index.tsx 才会成为父路由前缀，
 * 使 phone.tsx 注册为子路由 /login/phone（而非扁平化为 /phone）。
 * 父路由组件渲染 <RouterView /> 以显示子路由；访问 /login 时重定向到 /login/phone。
 */
import { defineComponent, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';

export const routeMeta = {
  title: '登录',
  layout: 'blank',
  auth: false,
};

export default defineComponent({
  name: 'LoginIndex',
  setup() {
    const router = useRouter();
    onMounted(() => {
      if (router.currentRoute.value.path === '/login') {
        router.replace('/login/phone');
      }
    });
    return () => <RouterView />;
  },
});
