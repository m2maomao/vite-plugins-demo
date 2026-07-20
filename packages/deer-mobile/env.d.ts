declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}

// SM4 加解密包（私有仓库，可选依赖）
declare module '@business/plugin-sm4' {
  interface SM4UtilInstance {
    secretKey: string;
    encryptData_ECB(data: string): string;
    decryptData_ECB(data: string): string;
  }
  const SM4Util: new () => SM4UtilInstance;
  export default SM4Util;
}
