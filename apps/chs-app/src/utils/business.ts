/**
 * CHS 业务工具函数（从 uni-app 项目迁移，Web 端适配）
 */
import { AUTH_PLATFORM, YES_NO_INT, SEX } from './enumerate';

/**
 * 数据处理：处理类目切换（首页/健康档案动态排版）
 */
export function formatComposingData(data: any[]): any[] {
  const objDatas: Record<string, any> = {};
  const switchDatas: Record<string, any> = {};
  const switchRela: Record<string, string> = {};
  data.forEach((item) => {
    if (item.allowSwitch === YES_NO_INT.YES) {
      if (item.displayId === item.id) {
        objDatas[item.id] = item;
        switchRela[item.id] = item.matchId;
      } else {
        switchDatas[item.id] = item;
      }
    } else {
      objDatas[item.id] = item;
    }
  });

  Object.keys(switchRela).forEach((key) => {
    const targetSwitchId = switchRela[key];
    objDatas[key].switchData = switchDatas[targetSwitchId];
  });

  const result: any[] = [];
  data.forEach((dataItem) => {
    if (objDatas[dataItem.id]) {
      result.push(objDatas[dataItem.id]);
    }
  });

  return result;
}

/**
 * 解析身份证，获取性别/生日/年龄
 * @returns { sex, birthday, age }
 */
export function getIdcardInfo(idcard: string): { sex: string; birthday: string; age: string } {
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  let sex = '';
  let birthday = '';
  let age = '';
  if (reg.test(idcard)) {
    const orgBirthday = idcard.substring(6, 14);
    const orgGender = idcard.substring(16, 17);
    sex = Number(orgGender) % 2 === 1 ? SEX.MAN.value : SEX.WOMAN.value;
    birthday = `${orgBirthday.substring(0, 4)}-${orgBirthday.substring(4, 6)}-${orgBirthday.substring(6, 8)}`;
    const birthdays = new Date(birthday.replace(/-/g, '/'));
    const d = new Date();
    age = String(
      d.getFullYear() -
        birthdays.getFullYear() -
        (d.getMonth() < birthdays.getMonth() ||
        (d.getMonth() === birthdays.getMonth() && d.getDate() < birthdays.getDate())
          ? 1
          : 0),
    );
  }

  return { sex, birthday, age };
}

/**
 * 获取平台编码（Web 端固定为微信公众号 H5）
 */
export function getPlatformCode(): string {
  return AUTH_PLATFORM.WX_SERVER.value;
}

/**
 * 获取登录地址（Web 端统一手机号登录）
 */
export function getLoginPath(): string {
  return '/login/phone';
}

// 疾病分级颜色
export const GRADE_COLORS = {
  green: { color: '#00955E', bg: '#ECF9F4', border: '#AEE0CB' },
  orange: { color: '#F86D06', bg: '#FEF8EC', border: '#FFCD8E' },
  yellow: { color: '#fea600', bg: 'rgba(254, 166, 0, 0.1)', border: 'rgba(254, 166, 0, 0.3)' },
  red: { color: '#F32929', bg: 'rgba(219, 65, 65, 0.1)', border: '#FFA394' },
  purple: { color: '#7e2fc3', bg: '#FFF4F4', border: 'rgba(126, 47, 195, 0.3)' },
};

// 重点人群类型
export const personTypeArr = [
  {
    id: 'A',
    value: '高血压',
    shortName: '高',
    routePath: '/hypertensionTable',
    grades: [
      { value: '1', label: '一级', color: GRADE_COLORS.green },
      { value: '2', label: '二级', color: GRADE_COLORS.orange },
      { value: '3', label: '三级', color: GRADE_COLORS.red },
    ],
  },
  {
    id: 'B',
    value: '糖尿病',
    shortName: '糖',
    routePath: '/diabetesInterview',
    grades: [
      { value: '1', label: '一级', color: GRADE_COLORS.green },
      { value: '2', label: '二级', color: GRADE_COLORS.orange },
      { value: '3', label: '三级', color: GRADE_COLORS.red },
    ],
  },
  {
    id: 'P',
    value: '慢阻肺病',
    shortName: '阻',
    routePath: '/copd',
    grades: [
      { value: '1', label: 'GOLD1', color: GRADE_COLORS.green },
      { value: '2', label: 'GOLD2', color: GRADE_COLORS.orange },
      { value: '3', label: 'GOLD3', color: GRADE_COLORS.red },
    ],
  },
  { id: 'Y', value: '老年人', shortName: '老', routePath: '/personalInfo' },
  { id: 'D', value: '肺结核', shortName: '肺', routePath: '/tuberculosisFirst' },
  { id: 'C', value: '严重精神障碍', shortName: '障', routePath: '/insanityInfo' },
  { id: 'G', value: '脑卒中', shortName: '卒' },
  { id: 'I', value: '冠心病', shortName: '冠' },
  { id: 'Z', value: '儿童', shortName: '童', routePath: '/children_profile' },
  { id: 'K', value: '孕产妇', shortName: '孕', routePath: '/maternalProfile' },
  { id: 'E', value: '恶性肿瘤', shortName: '瘤', routePath: '/tumorPatientTable' },
  { id: 'H', value: '心脑血管疾病', shortName: '心', routePath: '/cerebrovascular' },
  { id: 'O', value: '残疾人', shortName: '残', routePath: '/disabled-table' },
  { id: 'J', value: '高危项', shortName: '危', routePath: '/riskGroupInfo' },
  { id: 'W', value: '高血脂', shortName: '脂', routePath: '/hyperlipidemiaTable' },
];

/**
 * 手机号和身份证号做脱敏处理
 * @param value 需要脱敏的值
 * @param type 脱敏类型：'phone' 手机号 'idCard' 身份证号 'name' 姓名
 */
export function desensitizeData(value: string | number, type: 'phone' | 'idCard' | 'name'): string {
  switch (type) {
    case 'phone':
      return String(value).replace(/(\d{3})\d*(\d{4})/, '$1****$2');
    case 'idCard':
      return String(value).replace(/(\d{4})\d*(\d{4})/, '$1**********$2');
    case 'name':
      return String(value).replace(String(value).slice(1), '**');
    default:
      return '';
  }
}
