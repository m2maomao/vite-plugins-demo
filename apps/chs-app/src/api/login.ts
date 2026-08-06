/**
 * CHS 登录/认证 API（apiPlugin 约定：export default ({ $post }) => ({ ... })）
 */
import { CONTEXT } from '@/utils/http-context';

export default ({ $post }: any) => ({
  /** 手机号密码登录 */
  phoneLogin: (params: any) => $post(`${CONTEXT}/resident/user/login`, params),
  /** 微信/授权登录 */
  mpLogin: (params: any) => $post(`${CONTEXT}/resident/user/authOperate`, params),
  /** 实名认证 */
  realnameAuth: (params: any) => $post(`${CONTEXT}/resident/user/realNameAuth`, params),
  /** 身份证 OCR 识别 */
  ocr: (params: any) => $post(`${CONTEXT}/resident/user/ocr`, params),
});
