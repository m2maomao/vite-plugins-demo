import { defineComponent, ref, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';

export const routeMeta = {
  title: '用户资料',
  layout: 'default',
  auth: true,
  transition: 'slide-left',
};

export default defineComponent({
  setup() {
    const { user } = useApi();
    const profile = ref<{ id: number; name: string; email: string } | null>(null);

    onMounted(async () => {
      profile.value = (await user.getProfile(1)).data;
    });
    return () => (
      <div>
        <h3 class="text-2xl font-bold text-purple-600">用户资料</h3>
        {profile.value ? (
          <div>
            <p>ID: {profile.value.id}</p>
            <p>姓名: {profile.value.name}</p>
            <p>邮箱: {profile.value.email}</p>
          </div>
        ) : (
          <p>加载中...</p>
        )}
      </div>
    );
  },
});
