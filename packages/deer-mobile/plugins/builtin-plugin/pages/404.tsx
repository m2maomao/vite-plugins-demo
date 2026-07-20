import { defineComponent, h } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    return () => (
      <div class="text-center mt-20">
        <h1 class="text-6xl font-bold text-gray-300">404</h1>
        <p class="text-gray-500 mt-4">页面未找到</p>
        <button
          class="mt-6 px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700"
          onClick={() => router.push('/')}>
          返回首页
        </button>
      </div>
    );
  },
});
