/**
 * 聊天会话页 — 集成 deer-mobile IM 的 ImChat
 */
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ImChat } from 'deer-mobile/im';

export const routeMeta = {
  title: '聊天',
  auth: true,
};

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const chatId = String(route.query.chatId || '');
    const groupId = String(route.query.groupId || '');
    const targetUserId = String(route.query.targetUserId || '');
    const targetUserName = String(route.query.targetUserName || '');
    const chatType = Number(route.query.chatType || 1);

    return () => (
      <div class="h-screen flex flex-col">
        {/* 简易导航栏 */}
        <div class="h-11 shrink-0 bg-white flex items-center px-2 border-b border-gray-100">
          <button class="px-2 text-base text-gray-600" onClick={() => router.back()}>
            ‹
          </button>
          <span class="flex-1 text-center text-[15px] font-medium truncate">{targetUserName || '聊天'}</span>
          <span class="w-8" />
        </div>
        <div class="flex-1 overflow-hidden">
          <ImChat
            chatId={chatId}
            groupId={groupId}
            chatType={chatType}
            targetUserId={targetUserId}
            targetUserName={targetUserName}
          />
        </div>
      </div>
    );
  },
});
