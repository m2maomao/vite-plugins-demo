import 'pinia';

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    /**
     * 是否启用 pinia-plugin-persistedstate
     */
    persist?: boolean | object;
  }
}
