/**
 * Deer Mobile — OcrCard 组件
 * 通用身份证 OCR 识别卡片：选图/拍照 → 预览 → 识别 → 回填结构化信息。
 * 接口 URL 通过 props 传入（或自定义 request），不写死业务路径。
 *
 * @example
 * ```tsx
 * <OcrCard
 *   url="/api/rmChsService/v1.0/resident/user/ocr"
 *   onResult={(info) => { form.name = info.name; form.idCard = info.idCard; }}
 * />
 * ```
 */
import { defineComponent, ref } from 'vue';
import { useIdCardOcr } from '../composables';
import type { IdCardInfo, IdCardOcrOptions } from '../types';

export default defineComponent({
  name: 'DeerOcrCard',
  props: {
    /** OCR 识别接口地址（完整 URL） */
    url: { type: String, default: '' },
    /** 自定义请求函数（优先于 url） */
    request: { type: Function as unknown as () => IdCardOcrOptions['request'], default: undefined },
    /** 是否压缩图片（默认 true） */
    compress: { type: Boolean, default: true },
    /** 压缩质量（0-1） */
    compressQuality: { type: Number, default: 0.6 },
    /** 最大图片尺寸 */
    maxSize: { type: Number, default: 1280 },
    /** 按钮文案 */
    recognizeText: { type: String, default: '开始识别' },
    /** 选择图片文案 */
    selectText: { type: String, default: '选择身份证图片' },
    /** 重新选择文案 */
    reselectText: { type: String, default: '重新选择' },
  },
  emits: ['result', 'error'],
  setup(props, { emit, slots }) {
    const fileInput = ref<HTMLInputElement | null>(null);

    const ocr = useIdCardOcr({
      url: props.url || undefined,
      request: props.request || undefined,
      compress: props.compress,
      compressQuality: props.compressQuality,
      maxSize: props.maxSize,
    });

    function handleFileChange(e: Event) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      ocr
        .selectImage(file)
        .then(() => {
          // 选图成功后自动识别
          return ocr.recognize();
        })
        .then((info: IdCardInfo) => {
          emit('result', info);
        })
        .catch((err) => {
          emit('error', err instanceof Error ? err.message : '识别失败');
        });
    }

    function openPicker() {
      fileInput.value?.click();
    }

    function handleRecognize() {
      if (!ocr.image.value) return;
      ocr
        .recognize()
        .then((info: IdCardInfo) => emit('result', info))
        .catch((err) => emit('error', err instanceof Error ? err.message : '识别失败'));
    }

    return () => (
      <div class="deer-ocr-card">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture="environment"
          style="display:none"
          onChange={handleFileChange}
        />

        {/* 图片预览区域 */}
        <div
          class="relative flex items-center justify-center w-full overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50"
          style="height: 200px">
          {ocr.image.value ? (
            <img src={ocr.image.value} alt="身份证" class="max-h-full max-w-full object-contain" />
          ) : (
            <div class="text-center text-gray-400">
              {slots.placeholder ? slots.placeholder() : <div class="text-sm">点击下方按钮选择 / 拍摄身份证人像面</div>}
            </div>
          )}

          {ocr.loading.value && (
            <div class="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm">
              识别中...
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {ocr.error.value && <div class="mt-2 text-sm text-red-500">{ocr.error.value}</div>}

        {/* 操作按钮 */}
        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="flex-1 py-2.5 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style="background:#096aff"
            disabled={ocr.loading.value}
            onClick={ocr.image.value ? handleRecognize : openPicker}>
            {ocr.image.value ? props.recognizeText : props.selectText}
          </button>
          {ocr.image.value && (
            <button
              type="button"
              class="px-4 py-2.5 rounded-lg text-sm text-gray-600 bg-gray-100 disabled:opacity-50"
              disabled={ocr.loading.value}
              onClick={() => {
                ocr.reset();
                if (fileInput.value) fileInput.value.value = '';
              }}>
              {props.reselectText}
            </button>
          )}
        </div>

        {/* 识别结果展示（可自定义） */}
        {ocr.result.value && slots.result && slots.result(ocr.result.value)}
      </div>
    );
  },
});
