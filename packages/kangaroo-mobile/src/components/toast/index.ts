import Toast from './Toast.vue'

export const YhmToast = Toast
export default Toast

export {
  showToast,
  closeToast,
  showLoadingToast,
  showSuccessToast,
  showFailToast,
  allowMultipleToast,
  setToastDefaultOptions,
  resetToastDefaultOptions,
} from 'vant'
