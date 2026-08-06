/**
 * 健康宣教文章详情（动态路由 /article/:id）
 * 富文本用 H5 原生 v-html 渲染（+ 基础样式清洗思路），点赞/浏览数
 */
import { defineComponent, ref, onMounted, Fragment } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'virtual:api';

export const routeMeta = {
  title: '文章详情',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'ArticleDetail',
  setup() {
    const route = useRoute();
    const article = ref<any>({});
    const isLike = ref(false);
    const loading = ref(false);

    async function load() {
      loading.value = true;
      try {
        const id = String(route.params.id || '');
        const res: any = await api.home.queryArticleData(id);
        article.value = res?.data || {};
        // 浏览数+1
        api.home.articleViews(id).catch(() => undefined);
        // 查询是否已点赞
        api.home
          .queryUserIsLike({ articleId: id })
          .then((r: any) => {
            isLike.value = r?.data === 1;
          })
          .catch(() => undefined);
      } catch (e) {
        console.warn('[ArticleDetail] 加载失败', e);
        article.value = {
          title: '示例文章：高血压患者的日常饮食管理',
          releaseTime: '2024-01-15',
          viewsNum: 1200,
          thumbNum: 86,
          releaseContent:
            '<h3>一、控制钠盐摄入</h3><p>每日食盐摄入量不超过 5 克，避免腌制食品。</p><h3>二、合理膳食</h3><p>多吃蔬菜水果，减少高脂肪、高胆固醇食物。</p><h3>三、规律运动</h3><p>每周至少进行 150 分钟中等强度有氧运动。</p>',
        };
      } finally {
        loading.value = false;
      }
    }

    async function toggleLike() {
      try {
        const id = String(route.params.id || '');
        const res: any = await api.home.articleLikes({ articleId: id });
        if (res?.status === 1) {
          isLike.value = !isLike.value;
          article.value.thumbNum = (article.value.thumbNum || 0) + (isLike.value ? 1 : -1);
        }
      } catch (e) {
        console.warn('[ArticleDetail] 点赞失败', e);
      }
    }

    onMounted(load);

    return () => (
      <div class="min-h-screen bg-white p-4">
        {loading.value && <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>}
        {!loading.value && (
          <>
            <h1 class="text-xl font-bold text-gray-800">{article.value.title}</h1>
            <div class="flex mt-3 mb-4 text-xs text-gray-400">
              <span>发布时间 {article.value.releaseTime}</span>
              <span class="ml-3">浏览 {article.value.viewsNum || 0}</span>
            </div>

            {/* 富文本：H5 原生 v-html */}
            <div
              class="prose text-sm text-gray-700 leading-relaxed [&_img]:max-w-full [&_p]:my-2 [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:font-bold [&_h3]:text-gray-800"
              innerHTML={article.value.releaseContent || ''}
            />

            {/* 点赞 */}
            <div class="flex justify-center mt-6 mb-4">
              <button
                class={`flex flex-col items-center justify-center w-16 h-16 rounded-full border ${isLike.value ? 'bg-[#ff8800] border-[#ff8800]' : 'bg-[#FEF8EC] border-[#FFC184]'}`}
                onClick={toggleLike}>
                <span class={`text-lg ${isLike.value ? 'text-white' : 'text-[#ff8800]'}`}>👍</span>
                <span class={`mt-1 text-xs ${isLike.value ? 'text-white' : 'text-gray-600'}`}>
                  {article.value.thumbNum || 0}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  },
});
