/**
 * kangaroo-uni 全局组件类型声明
 *
 * easycom 自动引入的组件无需 import，但 TS 无法识别 <k-* /> 标签，
 * 需通过 GlobalComponents 接口声明，让 Vue 模板获得类型提示。
 *
 * 使用：将本包加入工程的 tsconfig include 或 types 引用即可生效。
 */
declare module 'vue' {
  export interface GlobalComponents {
    YhuButton: (typeof import('./components/yhu-button/yhu-button.vue'))['default'];
    YhuCell: (typeof import('./components/yhu-cell/yhu-cell.vue'))['default'];
    YhuField: (typeof import('./components/yhu-field/yhu-field.vue'))['default'];
    YhuTag: (typeof import('./components/yhu-tag/yhu-tag.vue'))['default'];
  }
}

export {};
