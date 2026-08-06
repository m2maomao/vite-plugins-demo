/**
 * Deer Mobile — OCR Feature 统一出口
 * 通过子路径 `deer-mobile/ocr` 或主入口 `deer-mobile` 导入
 */
export { default as OcrCard } from './components/OcrCard';
export { useIdCardOcr } from './composables';

export type { IdCardInfo, IdCardOcrOptions, UseIdCardOcrReturn } from './types';
