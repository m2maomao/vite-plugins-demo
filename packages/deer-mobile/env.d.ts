declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
}

// sm-crypto — 国密 SM4 加解密（公有包，可选依赖）
declare module 'sm-crypto' {
  interface SM4Config {
    mode?: 'ecb' | 'cbc';
    iv?: string;
    padding?: 'pkcs7' | 'none';
  }
  export const sm4: {
    encrypt(data: string | Buffer, key: string, config?: SM4Config): string;
    decrypt(data: string | Buffer, key: string, config?: SM4Config): string;
  };
}
