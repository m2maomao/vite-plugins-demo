/**
 * CHS 应用配置状态 store（对齐原 Vuex common 模块）
 * systemInfo / staticParams / baseParams / fileServiceIp 等
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('chs-app', () => {
  // 系统信息
  const systemInfo = ref<any>({});
  // Apollo 静态参数
  const staticParams = ref<any>({});
  // 管理系统设置参数
  const baseParams = ref<any>({
    isRequested: false,
    ocrAuth: 1,
    twoFactorAuth: 0,
    interactEnable: 0,
  });
  // 文件服务地址
  const fileServiceIp = ref('');
  // 患者视图
  const patientView = ref('');
  // 预览文件服务地址
  const preViewFileServiceIp = ref('');
  // 宜健康 WebView 地址
  const yhavWebView = ref('');

  function setSystemInfo(data: any) {
    systemInfo.value = data;
  }
  function setStaticParams(data: any) {
    staticParams.value = data;
  }
  function setBaseParams(data: any) {
    baseParams.value = { ...baseParams.value, ...data };
  }
  function setFileServiceIp(ip: string) {
    fileServiceIp.value = ip;
  }
  function setPatientView(view: string) {
    patientView.value = view;
    localStorage.setItem('patientView', view);
  }
  function setPreViewFileServiceIp(ip: string) {
    preViewFileServiceIp.value = ip;
    localStorage.setItem('preViewFileServiceIp', ip);
  }
  function setYhavWebView(view: string) {
    yhavWebView.value = view;
    localStorage.setItem('yhavWebView', view);
  }

  return {
    systemInfo,
    staticParams,
    baseParams,
    fileServiceIp,
    patientView,
    preViewFileServiceIp,
    yhavWebView,
    setSystemInfo,
    setStaticParams,
    setBaseParams,
    setFileServiceIp,
    setPatientView,
    setPreViewFileServiceIp,
    setYhavWebView,
  };
});
