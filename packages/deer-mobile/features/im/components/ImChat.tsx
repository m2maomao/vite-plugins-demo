/**
 * Deer Mobile — IM ImChat
 * 聊天面板（基础版）：历史消息加载 + 文本消息收发 + 已读回执
 * 对齐 @im/uni ImChat 的核心数据流：
 *   getChatProfile/createChat → $state.setChat → getMessageList + MESSAGE_NEWS 监听
 */

import { defineComponent, ref, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { useIM } from '../composables';
import MessageBubble from './MessageBubble';
import type { IMComMessage } from '../types';

export default defineComponent({
  name: 'DeerImChat',
  props: {
    /** chatId 和 groupId 二选一必传 */
    chatId: { type: String, default: '' },
    groupId: { type: String, default: '' },
    chatType: { type: Number, required: true },
    targetUserId: { type: String, default: '' },
    targetUserName: { type: String, default: '' },
    avatar: { type: String, default: '' },
    hiddenTextarea: { type: Boolean, default: false },
    placeholder: { type: String, default: '输入消息...' },
  },
  emits: ['nav-left', 'nav-right'],
  setup(props) {
    const { im } = useIM();
    const messages = ref<IMComMessage[]>([]);
    const input = ref('');
    const sending = ref(false);
    const loading = ref(false);
    const scrollRef = ref<HTMLDivElement | null>(null);
    let offHandlers: (() => void)[] = [];
    let currentChatId = '';

    const scrollToBottom = async () => {
      await nextTick();
      if (scrollRef.value) {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      }
    };

    const appendMessage = (msg: IMComMessage) => {
      const exists = messages.value.some(
        (m) => (m.msgId && m.msgId === msg.msgId) || (m.requestId && m.requestId === msg.requestId),
      );
      if (!exists) {
        messages.value = [...messages.value, msg];
        scrollToBottom();
      }
    };

    const ensureChat = async (ctx: any) => {
      if (props.chatId || props.groupId) {
        const params: any = { chatType: props.chatType };
        if (props.chatId) params.chatId = props.chatId;
        else params.groupId = props.groupId;
        const { data = {} } = (await ctx.getChatProfile(params)) as any;
        ctx.$state.setChat(data);
        currentChatId = data.chatId || props.chatId;
        if (data.unreadNum) ctx.setMessageRead(data.unreadNum);
        return data;
      }
      if (props.chatType === 1 && props.targetUserId) {
        const { data = {} } = (await ctx.createChat({
          targetUserId: props.targetUserId,
          targetUserName: props.targetUserName,
          targetUserType: '',
        })) as any;
        currentChatId = data.chatId;
        ctx.$state.setChat({
          chatId: data.chatId,
          chatType: props.chatType,
          targetUserId: props.targetUserId,
          targetUserName: props.targetUserName,
        });
        return data;
      }
      return null;
    };

    const loadMessages = async (ctx: any) => {
      if (!currentChatId) return;
      loading.value = true;
      try {
        const res = (await ctx.getMessageList({ chatId: currentChatId, size: 100 })) as any;
        messages.value = (res?.data || []).reverse();
        scrollToBottom();
      } finally {
        loading.value = false;
      }
    };

    const setup = async () => {
      const ctx = im.value;
      if (!ctx) return;
      await ensureChat(ctx);
      await loadMessages(ctx);

      const onNews = (msg: any) => {
        const chatId = (ctx.$state.chat as any)?.chatId;
        if (msg.chatId === chatId || (props.groupId && msg.targetUserId === props.groupId)) {
          appendMessage(msg);
          if (msg.chatType === 1) ctx.setMessageRead();
        }
      };
      const onReceipt = (msg: any) => {
        const idx = messages.value.findIndex((m) => m.requestId && m.requestId === msg.requestId);
        if (idx !== -1) {
          messages.value = messages.value.map((m, i) => (i === idx ? { ...m, ...msg, errorOrLoading: undefined } : m));
        }
      };
      ctx.on(ctx.$event.MESSAGE_NEWS, onNews);
      ctx.on(ctx.$event.MESSAGE_RECEIPT, onReceipt);
      offHandlers.push(() => {
        ctx.off(ctx.$event.MESSAGE_NEWS, onNews);
        ctx.off(ctx.$event.MESSAGE_RECEIPT, onReceipt);
      });
    };

    const send = async () => {
      const ctx = im.value;
      const content = input.value.trim();
      if (!ctx || !content || sending.value) return;
      sending.value = true;
      try {
        const msg = ctx.createTextMessage({ content });
        appendMessage({
          ...msg,
          requestId: `local_${Date.now()}`,
          sendUserId: ctx.$config.userId,
          sendUserName: ctx.$config.userName,
          errorOrLoading: 'loading',
        });
        await ctx.sendMessage(msg);
      } catch (e) {
        console.error('[Deer IM] 发送失败', e);
      } finally {
        sending.value = false;
        input.value = '';
        scrollToBottom();
      }
    };

    onMounted(() => {
      if (im.value) setup();
    });
    watch(im, (ctx) => {
      if (ctx) setup();
    });
    onUnmounted(() => {
      offHandlers.forEach((fn) => fn());
      offHandlers = [];
      const ctx = im.value;
      ctx?.$state.resetChat();
    });

    return () => (
      <div class="flex flex-col h-full bg-[#f7f8fa]">
        {/* 消息列表 */}
        <div ref={scrollRef} class="flex-1 overflow-y-auto px-3 py-2">
          {loading.value && <div class="text-center text-gray-400 text-sm py-8">加载中...</div>}
          {messages.value.map((m, i) => (
            <MessageBubble
              key={m.msgId || m.requestId || i}
              message={m}
              isSelf={m.sendUserId === im.value?.$config.userId}
              avatar={props.avatar}
            />
          ))}
        </div>
        {/* 输入区域 */}
        {!props.hiddenTextarea && (
          <div class="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-100">
            <input
              value={input.value}
              placeholder={props.placeholder}
              class="flex-1 min-w-0 px-3 py-2 bg-[#f7f8fa] rounded-lg text-sm outline-none"
              onInput={(e: any) => {
                input.value = e.target.value;
              }}
              onKeydown={(e: KeyboardEvent) => {
                if (e.key === 'Enter') send();
              }}
            />
            <button
              class="px-4 py-2 rounded-lg bg-[#096aff] text-white text-sm shrink-0 disabled:opacity-50"
              disabled={sending.value || !input.value.trim()}
              onClick={send}>
              发送
            </button>
          </div>
        )}
      </div>
    );
  },
});
