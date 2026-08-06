/**
 * 消息中心（tab）— 调阅记录 + 系统通知
 */
import { defineComponent, ref } from 'vue';

export const routeMeta = {
  title: '消息',
  layout: 'tabs',
  auth: true,
  keepAlive: true,
};

const TABS = [
  { key: 'access', label: '调阅记录' },
  { key: 'notify', label: '系统通知' },
];

export default defineComponent({
  setup() {
    const active = ref(0);

    return () => (
      <div class="h-full bg-gray-50 flex flex-col">
        {/* Tab 栏 */}
        <div class="flex bg-white border-b border-gray-100">
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              class={`flex-1 py-3 text-[15px] text-center relative ${
                active.value === i ? 'text-[#096aff] font-medium' : 'text-gray-500'
              }`}
              onClick={() => (active.value = i)}>
              {tab.label}
              {active.value === i && (
                <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#096aff] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div class="flex-1 overflow-y-auto">
          {active.value === 0 && <div class="text-center text-gray-400 text-sm py-20">暂无调阅记录</div>}
          {active.value === 1 && <div class="text-center text-gray-400 text-sm py-20">暂无系统通知</div>}
        </div>
      </div>
    );
  },
});
