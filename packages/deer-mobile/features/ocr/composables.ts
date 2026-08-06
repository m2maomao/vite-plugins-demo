/**
 * Deer Mobile — OCR Feature Composables
 * useIdCardOcr：H5 端身份证 OCR 识别（选图 → base64 → 调接口 → 解析结构化信息）
 * 接口地址可配置（options.url 或自定义 request 函数），不写死业务路径。
 */
import { ref, shallowRef } from 'vue';
import type { IdCardInfo, IdCardOcrOptions, UseIdCardOcrReturn } from './types';

/** 默认 OCR 接口路径（可被 options.url 覆盖） */
const DEFAULT_OCR_URL = '/api/rmChsService/v1.0/resident/user/ocr';

/** 默认使用 fetch 发请求（Content-Type: application/json） */
async function defaultRequest(url: string, payload: { idCardImage: string }): Promise<IdCardInfo> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`OCR 请求失败（HTTP ${res.status}）`);
  const json = await res.json();
  return (json?.data ?? json) as IdCardInfo;
}

/** 将 File 转为 base64 data URL */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });
}

/** 从 base64 data URL 中剥离 data 前缀，得到裸 base64（对齐原项目 idCardImage 传参） */
function stripDataPrefix(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

/**
 * canvas 压缩图片（等比缩放至 maxSize 内，质量为 compressQuality）
 */
function compressImage(dataUrl: string, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('图片压缩失败'));
    img.src = dataUrl;
  });
}

/**
 * 身份证 OCR 识别 Composable
 * @example
 * ```ts
 * const { loading, result, image, selectImage, recognize, reset } = useIdCardOcr({
 *   url: '/api/rmChsService/v1.0/resident/user/ocr',
 * });
 * const file = event.target.files[0];
 * await selectImage(file);       // 选图（可选压缩）
 * const info = await recognize(); // 识别
 * ```
 */
export function useIdCardOcr(options: IdCardOcrOptions = {}): UseIdCardOcrReturn {
  const loading = ref(false);
  const error = ref('');
  const result = shallowRef<IdCardInfo | null>(null);
  const image = ref('');

  const url = options.url ?? DEFAULT_OCR_URL;
  const doRequest = options.request ?? ((payload: { idCardImage: string }) => defaultRequest(url, payload));

  async function selectImage(file: File): Promise<string> {
    error.value = '';
    let dataUrl = await fileToDataUrl(file);
    if (options.compress !== false) {
      dataUrl = await compressImage(dataUrl, options.maxSize ?? 1280, options.compressQuality ?? 0.6);
    }
    image.value = dataUrl;
    return dataUrl;
  }

  async function recognize(input?: string): Promise<IdCardInfo> {
    const source = input ?? image.value;
    if (!source) {
      error.value = '请先选择身份证图片';
      throw new Error('请先选择身份证图片');
    }
    loading.value = true;
    error.value = '';
    try {
      const data = await doRequest({ idCardImage: stripDataPrefix(source) });
      const info = (data ?? {}) as IdCardInfo;
      result.value = info;
      return info;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '识别失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    loading.value = false;
    error.value = '';
    result.value = null;
    image.value = '';
  }

  return { loading, result, error, image, selectImage, recognize, reset };
}
