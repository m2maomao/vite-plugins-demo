import { defineComponent, h } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import type { VNode } from 'vue';

/**
 * 用户模块布局 — 嵌套在 DefaultLayout 内部的子布局
 *
 * 使用方式：
 * ```typescript
 * // 页面文件内
 * export const routeMeta = { layout: ['default', 'user'], title: '资料' };
 * ```
 *
 * 渲染结果：
 * <DefaultLayout>
 *   <UserLayout>    ← 本组件
 *     <profile页面 />
 *   </UserLayout>
 * </DefaultLayout>
 */
export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    return (props: any, ctx: any) => {
      const children: VNode | undefined = ctx?.slots?.default?.();

      return (
        <div class="max-w-3xl mx-auto">
          {/* 用户模块导航 */}
          <div class="flex gap-4 mb-6 border-b border-gray-200 pb-2">
            {[
              { path: '/user/profile', label: '资料' },
              { path: '/user/setting', label: '设置' },
            ].map((tab) => (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                class={`pb-2 px-1 cursor-pointer transition-colors ${
                  route.path.startsWith(tab.path)
                    ? 'text-purple-600 border-b-2 border-purple-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* 页面内容 */}
          {children || h(RouterView)}
        </div>
      );
    };
  },
});
