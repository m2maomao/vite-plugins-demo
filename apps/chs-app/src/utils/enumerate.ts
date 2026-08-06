/**
 * CHS 业务枚举常量（从 uni-app 项目迁移，Web 端路由适配）
 */
import { enumerateCreator } from './enum';

// 认证 TOKEN KEY
export const TOKEN_KEY = 'chs-auth-token';

// 用户信息 KEY
export const USER_KEY = 'chs-auth-user';

// 患者/居民（档案）信息 KEY
export const RESIDENT_KEY = 'chs-resident-user';

// 用户信息 KEY
export const IP_ADDRESS = 'chs-ipAddress';

// 健康档案信息
export const HEALTH_ARCHIVE_KEY = 'chs-health-archive-local';

// 请求订阅的参数Key
export const REQUEST_EMIT_KEY = '__chs_request_key__';

// 无需登录的白名单（Web 路由）
export const LOGIN_WHITE_LIST = ['/', '/login/phone', '/login/weixin', '/agreement'];

// 标签颜色
export const COLORS = {
  green: { color: '#02d4aa', bgColor: '#e3f9f4' },
  red: { color: '#ff3d2c', bgColor: '#ffe3e2' },
  orange: { color: '#fb8733', bgColor: '#ffeee1' },
  purple: { color: '#8059ff', bgColor: '#eee7ff' },
  yellow: { color: '#feae04', bgColor: '#fff5d6' },
  gray: { color: '#38618e', bgColor: '#e2e8ef' },
  lightGray: { color: '#595959', bgColor: '#eee' },
};

// 登录状态
export const LOGIN_TYPES = enumerateCreator({
  card: { label: '证件登录', value: '1' },
  phone: { label: '手机登录', value: '2' },
});

// 有无 int
export const HAVE_NONE = enumerateCreator({
  NONE: { label: '无', value: 0 },
  HAVE: { label: '有', value: 1 },
});

// 是否 int
export const YES_NO_INT = enumerateCreator({
  YES: { label: '是', value: 1 },
  NO: { label: '否', value: 0 },
});

// 操作
export const OPERATION_MODE = enumerateCreator({
  ADD: { label: '新增', value: 1 },
  EDIT: { label: '编辑', value: 2 },
  PREVIEW: { label: '预览', value: 3 },
});

// 授权平台类型
export const AUTH_PLATFORM = enumerateCreator({
  ALIPAY: { label: '支付宝小程序', value: '01' },
  WEIXIN: { label: '微信小程序', value: '02' },
  WX_SERVER: { label: '微信公众号', value: '03' },
  APP: { label: 'APP', value: '04' },
});

// 验证码类型
export const VERIFY_TYPE = enumerateCreator({
  REGISTER: { label: '用户注册', value: 1 },
  LOGIN: { label: '用户登录', value: 2 },
  RESET_PASSWORD: { label: '密码重置', value: 3 },
  CANCELLATION: { label: '注销账号', value: 4 },
  CAHNGE_PHONE: { label: '更换手机号', value: 5 },
  BIND_FAMILY: { label: '绑定家庭成员', value: 6 },
  ACCESS_VERIFY: { label: '调阅验证', value: 7 },
  REALNAME_AUTH: { label: '实名认证', value: 8 },
});

// 用户状态
export const USER_STATUS = enumerateCreator({
  NORMAL: { label: '正常', value: 1 },
  CANCEL: { label: '注销', value: 2 },
  DIE: { label: '死亡', value: 3 },
});

// 性别
export const SEX = enumerateCreator({
  OTHER: { label: '未知的性别', value: '0' },
  MAN: { label: '男', value: '1' },
  WOMAN: { label: '女', value: '2' },
});

// 家庭成员绑定方式
export const FAMILY_BIND_TYPE = enumerateCreator({
  WRITE: { label: '录入绑定', value: 1 },
  SCAN: { label: '扫码绑定', value: 2 },
});

// 排版类型
export const COMPOSING_TYPE = enumerateCreator({
  HOME: { label: '首页', value: 1 },
  RECORD: { label: '健康档案', value: 2 },
});

// 文章类型
export const ARTICLE_TYPE = enumerateCreator({
  ARTICLE: { label: '文章', value: '01' },
  VIDEO: { label: '视频', value: '02' },
});

// 文章点赞类型
export const ARTICLE_LIKE_TYPE = enumerateCreator({
  LIKE: { label: '点赞', value: 1 },
  UNLIKE: { label: '取消点赞', value: 2 },
});

// 消息类型
export const MESSAGE_TYPE = enumerateCreator({
  ACCESS_RECORDS: { label: '调阅记录', value: 1 },
  SYSTEM_NOTIFY: { label: '系统通知', value: 2 },
});

// 消息通知 - 系统通知类型
export const SYSTEM_NOTIFY_TYPE = enumerateCreator({
  BIND: { label: '成员绑定通知', value: 1 },
  LOGIN: { label: '登录成功通知', value: 2 },
  THIRD: { label: '三方业务通知', value: 3 },
});

// 调阅类型
export const ACCESS_TYPE = enumerateCreator({
  PERSINAL: { label: '人员调阅', value: 1 },
  ORGAN: { label: '机构调阅（医生）', value: 2 },
});

// 健康档案 - 全息画像
export const HEALTH_PROFILE_TABS = enumerateCreator({
  BASE: { label: '基础信息', value: 1 },
  PHYSICAL: { label: '体征信息', value: 2 },
});

// 健康档案 - 我的健康档案
export const MY_HEALTH_RECORDS = enumerateCreator({
  BASE: { label: '基础信息', value: 1 },
  HEALTH: { label: '健康信息', value: 2 },
});

// 表单类型
export const FORM_TYPE = enumerateCreator({
  INPUT: { label: '输入表单', value: 1 },
  SELECT: { label: '选择表单', value: 2 },
  TEXT: { label: '描述表单', value: 3 },
  RADIO: { label: '单选表单', value: 4 },
  CHECKBOX: { label: '多选表单', value: 5 },
});

// 健康档案 - 体征信息 - 数据趋势
export const PHYSICAL_SIGNS_TRENDS = enumerateCreator({
  HIGHER: { label: '偏高', value: 2, icon: 'arrow-upward' },
  LOWER: { label: '偏低', value: 1, icon: 'arrow-downward' },
});

// 主页/健康档案动态模板样式
export const PAGE_SETTING_STYLE = enumerateCreator({
  STYLE1: { label: '样式一', value: 1 },
  STYLE2: { label: '样式二', value: 2 },
  STYLE3: { label: '样式三', value: 3 },
  STYLE4: { label: '样式四', value: 4 },
});

// 健康档案 - 安全验证类型
export const SECURITY_VERIFY_TYPE = enumerateCreator({
  PASSWORD: { label: '密码', value: 1 },
  CODE: { label: '验证码', value: 2 },
});

// 隐私权限设置
export const PRIVACY_SCOPE_OPTION = enumerateCreator({
  ALL_OPEN: { label: '全部开放', value: '01' },
  SOME_BLOCKED: { label: '部分屏蔽', value: '03' },
  ALL_BLOCKED: { label: '全部屏蔽', value: '02' },
});

// 健康画像类型
export const HEALTH_PORTRAY_TYPE_TEXT = 'text';
export const HEALTH_PORTRAY_TYPE_TEXT_TAG = 'text-tag';
export const HEALTH_PORTRAY_TYPE_TEXT_LR = 'text-left-right';
export const HEALTH_PORTRAY_TYPE_TEXT_CARD_INDEX = 'card-index';

// 健康画像模块
export const HEALTH_PORTRAY = enumerateCreator({
  SHXG: {
    label: '生活习惯',
    value: '07',
    isPortrait: false,
    isProfile: true,
    number: 0,
    data: [],
    icon: '/static/local-resource/lifestyle-habits.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT,
  },
  JWS: {
    label: '既往史',
    value: '01',
    isPortrait: true,
    isProfile: true,
    number: 0,
    data: [],
    icon: '/static/local-resource/patient-history.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT,
  },
  GMS: {
    label: '过敏史',
    value: '02',
    isPortrait: true,
    isProfile: true,
    number: 0,
    data: [],
    icon: '/static/local-resource/allergy-history.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT,
  },
  JZS: {
    label: '家族史',
    value: '03',
    isPortrait: true,
    isProfile: true,
    number: 0,
    data: [],
    icon: '/static/local-resource/family-history.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT,
  },
  YC_SHUJU: {
    label: '异常数据',
    value: '04',
    isPortrait: true,
    isProfile: false,
    number: 0,
    data: [],
    icon: '/static/local-resource/abnormal-data.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT_CARD_INDEX,
  },
  YC_SHIJIAN: {
    label: '异常事件',
    value: '05',
    isPortrait: true,
    isProfile: false,
    number: 0,
    data: [],
    icon: '/static/local-resource/abnormal-events.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT_LR,
  },
  RQXZ: {
    label: '人群标签',
    value: '06',
    isPortrait: true,
    isProfile: false,
    number: 0,
    data: [],
    icon: '/static/local-resource/crowd.svg',
    type: HEALTH_PORTRAY_TYPE_TEXT_TAG,
  },
});

// 指标趋势
export const INDEX_TREND = enumerateCreator({
  NORMAL: { label: '正常', value: 0 },
  LOW: { label: '偏低', value: 1 },
  HIGH: { label: '偏高', value: 2 },
});

// 项目配置 => 项目跳转端
export const PROJECT_LINK_TYPES = enumerateCreator({
  wx: { label: '微信小程序', value: '02', uniPlatform: 'mp-weixin' },
  my: { label: '支付宝小程序', value: '01', uniPlatform: 'mp-alipay' },
  app: { label: 'APP', value: '04', uniPlatform: 'app' },
  h5: { label: 'H5', value: '05', uniPlatform: 'web' },
});

// 项目应用状态
export const PROJECT_APP_STATUS = enumerateCreator({
  ABNORMAL: { label: '异常或下架', value: 0 },
  NORMAL: { label: '正常或上架', value: 1 },
});
