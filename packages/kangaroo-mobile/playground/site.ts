/**
 * 对标 Vant 4 demo 的 site 工具函数
 *
 * Vant 源码：
 *   export const cdnURL = (path: string) =>
 *     `https://fastly.jsdelivr.net/npm/@vant/assets/${path}`;
 */

/** 生成 Vant CDN 资源地址 */  
export const cdnURL = (path: string) =>
  `https://fastly.jsdelivr.net/npm/@vant/assets/${path}`
