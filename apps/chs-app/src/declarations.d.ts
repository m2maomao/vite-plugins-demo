/**
 * 第三方库类型声明
 */
declare module 'sm-crypto' {
  export const sm4: {
    encrypt: (
      data: string,
      key: string,
      options?: { mode?: 'ecb' | 'cbc'; iv?: string; output?: 'string' | 'array' },
    ) => string;
    decrypt: (
      ciphertext: string,
      key: string,
      options?: { mode?: 'ecb' | 'cbc'; iv?: string; output?: 'string' | 'array' },
    ) => string;
  };
  export const sm3: (data: string | ArrayBuffer) => string;
  export const sm2: any;
}
