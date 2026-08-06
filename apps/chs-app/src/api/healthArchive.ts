/**
 * CHS 健康档案 API（apiPlugin 约定：export default ({ $post }) => ({ ... })）
 */
import { CONTEXT } from '@/utils/http-context';

export default ({ $post }: any) => ({
  /** 获取健康档案数据（健康画像/全息画像） */
  queryHealthArchive: (params: any) => $post(`${CONTEXT}/resident/healthPage/queryHealthArchive`, params),
  /** 查询居民体征数据（全息画像 - 体征趋势） */
  queryPhysicalSigns: (params: any) => $post(`${CONTEXT}/resident/healthPage/queryResidentSignInfo`, params),
  /** 查询个人健康档案信息 */
  queryPersonalArchive: (params: any) => $post(`${CONTEXT}/resident/healthPage/queryPersonalArchive`, params),
  /** 更新个人健康档案信息 */
  modPersonalArchive: (params: any) => $post(`${CONTEXT}/resident/healthPage/modPersonalArchive`, params),
});
