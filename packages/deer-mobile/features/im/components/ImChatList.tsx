/**
 * Deer Mobile — IM ImChatList
 * 会话列表：基于 @im/sdk 的 getChatList + UPDATE_CHAT_LIST / REMOVE_LIST 事件刷新
 */

import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import { useIM } from '../composables';
import type { IMComChat } from '../types';

export default defineComponent({
  name: 'DeerImChatList',
  emits: ['select'],
  setup(_, { emit }) {
    const chatList = ref<IMComChat[]>([]);
    const loading = ref(false);
    const { im } = useIM();
    let offHandlers: (() => void)[] = [];

    const load = async () => {
      const ctx = im.value;
      if (!ctx) return;
      loading.value = true;
      try {
        const res = (await ctx.getChatList({ size: 100 })) as any;
        chatList.value = (res?.data || []) as IMComChat[];
      } finally {
        loading.value = false;
      }
    };

    const bindEvents = (ctx: any) => {
      const onUpdate = () => load();
      ctx.on(ctx.$event.UPDATE_CHAT_LIST, onUpdate);
      ctx.on(ctx.$event.REMOVE_LIST, onUpdate);
      offHandlers.push(() => {
        ctx.off(ctx.$event.UPDATE_CHAT_LIST, onUpdate);
        ctx.off(ctx.$event.REMOVE_LIST, onUpdate);
      });
    };

    onMounted(() => {
      load();
      if (im.value) bindEvents(im.value);
    });
    watch(im, (ctx) => {
      if (ctx) {
        bindEvents(ctx);
        load();
      }
    });
    onUnmounted(() => {
      offHandlers.forEach((fn) => fn());
      offHandlers = [];
    });

    return () => (
      <div class="h-full bg-white overflow-y-auto">
        {loading.value && <div class="text-center text-gray-400 py-10 text-sm">加载中...</div>}
        {!loading.value && chatList.value.length === 0 && (
          <div class="text-center text-gray-400 py-20 text-sm">暂无会话</div>
        )}
        {chatList.value.map((item) => (
          <div
            key={item.chatId || item.groupId || `${item.targetUserId}-${item.chatType}`}
            class="flex items-center px-4 py-3 border-b border-gray-50 cursor-pointer active:bg-gray-50"
            onClick={() => emit('select', item)}>
            <div class="w-11 h-11 rounded-full bg-[#eef2ff] flex items-center justify-center text-[#096aff] font-medium shrink-0">
              {(item.targetUserName || item.groupName || '?').slice(0, 1)}
            </div>
            <div class="flex-1 min-w-0 ml-3">
              <div class="flex justify-between items-center">
                <span class="text-[15px] font-medium truncate">{item.targetUserName || item.groupName || '会话'}</span>
                <span class="text-xs text-gray-400 shrink-0 ml-2">{item.lastMessageTime || ''}</span>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-sm text-gray-500 truncate">{item.lastMessageContent || item.lastMessage || ''}</span>
                {Number(item.unreadNum) > 0 && (
                  <span class="min-w-[18px] h-[18px] px-1 rounded-full bg-[#ee0a24] text-white text-xs leading-[18px] text-center shrink-0 ml-2">
                    {Number(item.unreadNum) > 99 ? '99+' : item.unreadNum}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
});
