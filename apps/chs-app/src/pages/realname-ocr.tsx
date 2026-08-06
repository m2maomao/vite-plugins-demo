/**
 * OCR 信息认证 — 身份证拍照识别
 * 使用 deer-mobile features/ocr 的 OcrCard 组件
 */
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { OcrCard } from 'deer-mobile/ocr';
import type { IdCardInfo } from 'deer-mobile/ocr';

export const routeMeta = {
  title: 'OCR 信息认证',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'RealnameOcr',
  setup() {
    const router = useRouter();
    const result = ref<IdCardInfo | null>(null);
    const errorMsg = ref('');

    function handleResult(info: IdCardInfo) {
      result.value = info;
      errorMsg.value = '';
    }

    function handleError(msg: string) {
      errorMsg.value = msg;
    }

    function handleNext() {
      // 回填到信息认证页
      router.push({
        path: '/realname-auth',
        query: {
          source: 'ocr',
          name: result.value?.name || '',
          idCard: result.value?.idCard || '',
        },
      });
    }

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        <div class="mb-4 text-sm text-gray-400">请拍摄或上传身份证人像面</div>

        <OcrCard url="/api/rmChsService/v1.0/resident/user/ocr" onResult={handleResult} onError={handleError} />

        {errorMsg.value && <div class="mt-2 text-sm text-red-500">{errorMsg.value}</div>}

        {result.value && (
          <div class="mt-4 bg-white rounded-lg divide-y divide-gray-100">
            {[
              ['姓名', result.value.name],
              ['身份证号', result.value.idCard],
              ['性别', result.value.gender],
              ['年龄', result.value.age],
              ['住址', result.value.address],
            ].map(([k, v]) => (
              <div key={k} class="flex items-center justify-between p-4">
                <span class="text-sm text-gray-500">{k}</span>
                <span class="text-sm text-gray-800">{v || '-'}</span>
              </div>
            ))}
          </div>
        )}

        {result.value && (
          <button
            class="mt-6 w-full py-3 rounded-lg bg-[#096aff] text-white text-base font-medium"
            onClick={handleNext}>
            下一步：确认信息认证
          </button>
        )}
      </div>
    );
  },
});
