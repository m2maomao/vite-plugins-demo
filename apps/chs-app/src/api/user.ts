/**
 * CHS 用户/隐私/家庭成员 API（apiPlugin 约定：export default ({ $post }) => ({ ... })）
 */
import { CONTEXT } from '@/utils/http-context';

export default ({ $post }: any) => ({
  // ===== 隐私 =====
  /** 查询隐私数据 */
  queryPrivacyData: (params: any) => $post(`${CONTEXT}/resident/privacy/queryUserPrivacy`, params),
  /** 更新隐私数据 */
  updatePrivacyData: (params: any) => $post(`${CONTEXT}/resident/privacy/updatePrivacy`, params),
  /** 修改调阅密码 */
  updateAccessPassward: (params: any) => $post(`${CONTEXT}/resident/privacy/updateAccessPassward`, params),
  /** 获取用户二维码（返回 base64） */
  queryUserQrCode: (params: any) => $post(`${CONTEXT}/resident/privacy/getMyQRCode`, params),
  /** 根据二维码获取家庭成员数据 */
  queryFamilyDataByQrCode: (params: any) => $post(`${CONTEXT}/resident/privacy/getInfoByMyQRCode`, params),
  /** 应用状态验证 */
  validAppStatus: (params: any) => $post(`${CONTEXT}/resident/privacy/projectAccessValid`, params),
  /** 健康档案授权验证 */
  validHealthArchiveAppAuth: (params: any) => $post(`${CONTEXT}/resident/privacy/accessValid`, params),

  // ===== 用户 =====
  /** 发送短信验证码 */
  sendingShortMessage: (params: any) => $post(`${CONTEXT}/resident/user/getVerifyCode`, params),
  /** 修改手机号 */
  updatePhone: (params: any) => $post(`${CONTEXT}/resident/user/updatePhone`, params),
  /** 获取跳转三方票据 */
  queryTicket: (params: any) => $post(`${CONTEXT}/resident/user/getTicket`, params),

  // ===== 健康档案身份验证 =====
  /** 健康档案身份验证 */
  validHealthArchiveAppIdentity: (params: any) => $post(`${CONTEXT}/resident/healthPage/healthArchiveValid`, params),

  // ===== 家庭成员 =====
  /** 解绑家庭成员 */
  unbindFamily: (params: any) => $post(`${CONTEXT}/resident/family/unbind`, params),
  /** 保存家庭成员信息 */
  saveFamily: (params: any) => $post(`${CONTEXT}/resident/family/saveUserFamily`, params),
  /** 获取家庭成员列表 */
  queryFamilyList: (params: any) => $post(`${CONTEXT}/resident/family/getMyFamily`, params),
  /** 获取家庭成员详情 */
  queryFamilyData: (params: any) => $post(`${CONTEXT}/resident/family/queryFamilyDetail`, params),
  /** 获取家庭成员个数 */
  queryFamilyNumber: (params: any) => $post(`${CONTEXT}/resident/family/getMyFamilyCount`, params),
});
