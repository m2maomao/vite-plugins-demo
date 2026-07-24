import type { Plugin } from 'vite';

/**
 * 内置页面代码 — 直接返回编译后的纯 JS（Vue h 函数），
 * 避免 rolldown 生产构建时无法处理虚拟模块中的 JSX。
 */
const BUILTIN_PAGE_CODES: Record<string, string> = {
  login: [
    `import { defineComponent, h, ref } from 'vue';`,
    `import { useRouter } from 'vue-router';`,
    `import { useUserStore } from 'deer-mobile/stores';`,
    ``,
    `export const routeMeta = { layout: 'blank', auth: false, title: '登录' };`,
    ``,
    `export default defineComponent({`,
    `  name: 'LoginPage',`,
    `  setup() {`,
    `    const router = useRouter();`,
    `    const userStore = useUserStore();`,
    `    const username = ref('');`,
    `    const password = ref('');`,
    `    const loading = ref(false);`,
    `    const handleLogin = async () => {`,
    `      if (loading.value) return;`,
    `      loading.value = true;`,
    `      try {`,
    `        const token = 'demo-token-' + Date.now();`,
    `        userStore.setToken(token);`,
    `        localStorage.setItem('token', token);`,
    `        await router.push('/');`,
    `      } catch (error) {`,
    `        console.error('Login failed:', error);`,
    `      } finally {`,
    `        loading.value = false;`,
    `      }`,
    `    };`,
    `    return () => h('div', { class: 'max-w-sm mx-auto mt-20 p-6 border border-gray-200 rounded-lg' }, [`,
    `      h('h2', { class: 'text-2xl text-center mb-6 font-bold' }, '登录'),`,
    `      h('div', { class: 'mb-4' }, [`,
    `        h('input', { placeholder: '用户名', value: username.value,`,
    `          onInput: (e) => { username.value = e.target.value; },`,
    `          class: 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500' })`,
    `      ]),`,
    `      h('div', { class: 'mb-4' }, [`,
    `        h('input', { placeholder: '密码', type: 'password', value: password.value,`,
    `          onInput: (e) => { password.value = e.target.value; },`,
    `          class: 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500' })`,
    `      ]),`,
    `      h('button', { onClick: handleLogin, disabled: loading.value,`,
    `        class: 'w-full py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed' },`,
    `        loading.value ? '登录中...' : '登录')`,
    `    ]);`,
    `  },`,
    `});`,
  ].join('\n'),

  '404': [
    `import { defineComponent, h } from 'vue';`,
    `import { useRouter } from 'vue-router';`,
    `export default defineComponent({`,
    `  setup() {`,
    `    const router = useRouter();`,
    `    return () => h('div', { class: 'text-center mt-20' }, [`,
    `      h('h1', { class: 'text-6xl font-bold text-gray-300' }, '404'),`,
    `      h('p', { class: 'text-gray-500 mt-4' }, '页面未找到'),`,
    `      h('button', { onClick: () => router.push('/'),`,
    `        class: 'mt-6 px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700' }, '返回首页')`,
    `    ]);`,
    `  },`,
    `});`,
  ].join('\n'),

  loading: [
    `import { defineComponent, h } from 'vue';`,
    `export default defineComponent({`,
    `  setup() {`,
    `    return () => h('div', { class: 'flex items-center justify-center min-h-[60vh]' },`,
    `      h('p', { class: 'text-gray-400 text-lg' }, '加载中...'));`,
    `  },`,
    `});`,
  ].join('\n'),

  error: [
    `import { defineComponent, h } from 'vue';`,
    `export default defineComponent({`,
    `  props: { message: { type: String, default: '出了点问题' } },`,
    `  setup(props) {`,
    `    return () => h('div', { class: 'text-center mt-20' }, [`,
    `      h('p', { class: 'text-4xl text-red-400' }, '⚠️'),`,
    `      h('p', { class: 'text-gray-500 mt-4' }, props.message),`,
    `    ]);`,
    `  },`,
    `});`,
  ].join('\n'),

  'pinia-demo': [
    `import { defineComponent, h, ref } from 'vue';`,
    `import { useUserStore } from 'deer-mobile/stores';`,
    `export default defineComponent({`,
    `  setup() {`,
    `    const userStore = useUserStore();`,
    `    const inputToken = ref('');`,
    `    const handleSetToken = () => { if (inputToken.value) userStore.setToken(inputToken.value); };`,
    `    const handleLogout = () => { userStore.logout(); };`,
    `    return () => h('div', { class: 'max-w-sm mx-auto mt-10 p-6 border border-gray-200 rounded-lg' }, [`,
    `      h('h2', { class: 'text-2xl text-center mb-6 font-bold' }, 'Pinia 调试页'),`,
    `      h('div', { class: 'mb-6 p-4 bg-gray-50 rounded' }, [`,
    `        h('p', { class: 'mb-2' }, [`,
    `          h('span', { class: 'font-bold' }, '登录状态：'),`,
    `          h('span', { class: userStore.isLoggedIn ? 'text-green-600' : 'text-red-500' },`,
    `            userStore.isLoggedIn ? '已登录' : '未登录')`,
    `        ]),`,
    `        h('p', { class: 'mb-2' }, [`,
    `          h('span', { class: 'font-bold' }, 'Token：'),`,
    `          h('code', { class: 'text-sm bg-gray-200 px-2 py-1 rounded break-all' }, userStore.token || '(空)')`,
    `        ]),`,
    `      ]),`,
    `      h('div', { class: 'mb-4' }, [`,
    `        h('label', { class: 'block text-sm font-bold mb-2' }, '设置 Token'),`,
    `        h('div', { class: 'flex gap-2' }, [`,
    `          h('input', { placeholder: '输入 token...', value: inputToken.value,`,
    `            onInput: (e) => { inputToken.value = e.target.value; },`,
    `            class: 'flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500' }),`,
    `          h('button', { onClick: handleSetToken,`,
    `            class: 'px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700' }, '设置')`,
    `        ]),`,
    `      ]),`,
    `      h('button', { onClick: handleLogout,`,
    `        class: 'w-full py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600' }, '退出登录')`,
    `    ]);`,
    `  },`,
    `});`,
  ].join('\n'),
};

const BUILTIN_PAGES: Record<string, string> = {
  login: 'virtual:builtin/login',
  '404': 'virtual:builtin/404',
  loading: 'virtual:builtin/loading',
  error: 'virtual:builtin/error',
  'pinia-demo': 'virtual:builtin/pinia-demo',
};

export default function builtinPlugin(): Plugin {
  return {
    name: 'builtin-plugin',

    resolveId(id) {
      for (const [, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (id === virtualId) return '\0' + virtualId;
      }
    },

    load(id) {
      const rawId = id.replace(/^\0/, '');
      for (const [name, virtualId] of Object.entries(BUILTIN_PAGES)) {
        if (rawId === virtualId) {
          return BUILTIN_PAGE_CODES[name] || `export default { template: '<div>Page not found: ${name}</div>' }`;
        }
      }
    },
  };
}
