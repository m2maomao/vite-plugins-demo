import { defineComponent } from 'vue';
export default defineComponent({
    setup() {
        return () => (<div class="flex items-center justify-center min-h-[60vh]">
        <p class="text-gray-400 text-lg">加载中...</p>
      </div>);
    }
});
