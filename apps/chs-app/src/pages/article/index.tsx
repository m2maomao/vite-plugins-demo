/**
 * 健康宣教文章列表
 * 数据：queryArticlePage（分页）
 */
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';

export const routeMeta = {
  title: '健康宣教',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'ArticleList',
  setup() {
    const router = useRouter();
    const list = ref<any[]>([]);
    const loading = ref(false);
    const pageNum = ref(1);

    async function load(append = false) {
      loading.value = true;
      try {
        const res: any = await api.home.queryArticlePage({ pageNum: pageNum.value, pageSize: 10 });
        const data = res?.data || {};
        const rows = data.records || data.list || [];
        list.value = append ? [...list.value, ...rows] : rows;
      } catch (e) {
        console.warn('[ArticleList] 加载失败', e);
        if (!append) {
          list.value = [
            { id: '1', title: '高血压患者的日常饮食管理', releaseTime: '2024-01-15', viewsNum: 1200, thumbNum: 86 },
            { id: '2', title: '糖尿病的早期信号与预防', releaseTime: '2024-01-10', viewsNum: 980, thumbNum: 54 },
            { id: '3', title: '老年人健康体检指南', releaseTime: '2024-01-05', viewsNum: 1500, thumbNum: 120 },
          ];
        }
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => load());

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        {loading.value && list.value.length === 0 && (
          <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>
        )}
        <div class="space-y-3">
          {list.value.map((item) => (
            <div key={item.id} class="bg-white rounded-lg p-4" onClick={() => router.push(`/article/${item.id}`)}>
              <div class="text-base font-medium text-gray-800 line-clamp-2">{item.title}</div>
              <div class="flex items-center mt-3 text-xs text-gray-400">
                <span>{item.releaseTime}</span>
                <span class="ml-3">浏览 {item.viewsNum || 0}</span>
                <span class="ml-3">点赞 {item.thumbNum || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
