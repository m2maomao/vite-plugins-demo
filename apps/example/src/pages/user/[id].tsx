import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    return () => <div>用户详情页 - ID: {route.params.id}</div>;
  },
});
