/**
 * Deer Mobile — OCR Feature Types
 * 身份证 OCR 识别相关类型定义
 */
import type { Ref, ShallowRef } from 'vue';

/** 身份证 OCR 识别结果（结构化信息） */
export interface IdCardInfo {
  /** 姓名 */
  name?: string;
  /** 身份证号 */
  idCard?: string;
  /** 年龄 */
  age?: string;
  /** 性别 */
  gender?: string;
  /** 家庭住址 */
  address?: string;
  /** 证件类型编码（如 '01'） */
  idType?: string;
  /** 证件类型名称 */
  idTypeName?: string;
  /** 民族 */
  nation?: string;
  /** 出生日期 */
  birth?: string;
}

/** OCR 配置选项 */
export interface IdCardOcrOptions {
  /** OCR 识别接口地址（完整 URL，如 /api/rmChsService/v1.0/resident/user/ocr） */
  url?: string;
  /**
   * 自定义请求方法（默认用 HTTP POST，Content-Type: application/json）
   * 业务方可注入 HttpClient 或 axios 实例，实现统一鉴权/拦截器
   */
  request?: (payload: { idCardImage: string }) => Promise<IdCardInfo | unknown>;
  /** 是否压缩图片（默认 false；H5 端可选 canvas 压缩） */
  compress?: boolean;
  /** 压缩质量（0-1，默认 0.6） */
  compressQuality?: number;
  /** 最大图片尺寸（像素，压缩时限制，默认 1280） */
  maxSize?: number;
}

/** OCR 识别状态 */
export interface UseIdCardOcrReturn {
  /** 是否识别中（ref） */
  loading: Ref<boolean>;
  /** 识别结果（shallowRef） */
  result: ShallowRef<IdCardInfo | null>;
  /** 错误信息（ref） */
  error: Ref<string>;
  /** 已选择的图片 base64 data URL（ref） */
  image: Ref<string>;
  /**
   * 选择图片（input[type=file] 触发）
   * 返回 base64 data URL；若配置 compress 则 canvas 压缩后返回
   */
  selectImage: (file: File) => Promise<string>;
  /**
   * 执行识别
   * @param image 可选：直接传入 base64 data URL（不传则用已选择的 image）
   */
  recognize: (image?: string) => Promise<IdCardInfo>;
  /** 重置状态 */
  reset: () => void;
}
