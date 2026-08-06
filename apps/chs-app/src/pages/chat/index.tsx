/**
 * 沟通列表（tab）— 会话列表，集成 deer-mobile IM 的 ImChatList
 */
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ImChatList } from 'deer-mobile/im';

export const routeMeta = {
  title: '沟通',
  layout: 'tabs',
  auth: true,
  keepAlive: true,
};

export default defineComponent({
  setup() {
    const router = useRouter();

    return () => (
      <div class="h-full bg-white">
        <ImChatList
          onSelect={(item: any) => {
            router.push({
              path: '/chat/session',
              query: {
                chatId: item.chatId || '',
                groupId: item.groupId || '',
                targetUserId: item.targetUserId || '',
                targetUserName: item.targetUserName || item.groupName || '',
                chatType: item.chatType || 1,
              },
            });
          }}
        />
      </div>
    );
  },
});
