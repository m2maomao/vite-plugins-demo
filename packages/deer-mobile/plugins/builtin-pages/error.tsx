import { defineComponent, h } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: String,
      default: '出了点问题',
    },
  },
  setup(props) {
    return () => (
      <div class="text-center mt-20">
        <p class="text-4xl text-red-400">⚠️</p>
        <p class="text-gray-500 mt-4">{props.message}</p>
      </div>
    );
  },
});
