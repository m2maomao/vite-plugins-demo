/**
 * Deer Mobile — PWA Plugin
 *
 * PWA 离线访问 Vite 插件。
 * 封装 vite-plugin-pwa，为 deer-mobile 应用提供零配置的 Service Worker +
 * Web App Manifest + 离线缓存支持。
 *
 * @example 基础用法
 * ```ts
 * import { defineConfig } from 'vite';
 * import { deer, pwa } from 'deer-mobile';
 *
 * export default defineConfig({
 *   plugins: [
 *     deer({ config: { title: 'My App' } }),
 *     pwa({ enabled: true }),
 *   ],
 * })
 * ```
 *
 * @example 安全缓存 API（仅缓存公开的 GET 接口，排除登录/auth）
 * ```ts
 * pwa({
 *   enabled: true,
 *   manifest: {
 *     name: 'My App',
 *     short_name: 'App',
 *     theme_color: '#1890ff',
 *   },
 *   runtimeCaching: [
 *     // 仅缓存公开 GET 接口，且排除 auth 相关路径
 *     { urlPattern: /\/api\/public\//, handler: 'NetworkFirst',
 *       options: { cacheName: 'public-api', expiration: { maxAgeSeconds: 300 } } },
 *   ],
 * })
 * ```
 *
 * ⚠️ 安全提示：
 * 默认不缓存任何 API 请求。如需缓存，请确保：
 * - 仅对 GET 请求缓存（POST/PUT/DELETE 等写操作不应缓存）
 * - 排除登录、Token 刷新等认证相关路径
 * - 设置合理的过期时间
 */

import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin } from 'vite';
import type { PWAOptions } from '../../src/build/types';

/**
 * 创建 PWA Vite 插件。
 *
 * 内部封装 vite-plugin-pwa，提供 deer-mobile 默认配置。
 */
export default function pwaPlugin(options?: PWAOptions): Plugin[] {
  const config: PWAOptions = options || { enabled: false };

  if (!config.enabled) {
    return [
      {
        name: 'deer:pwa',
        apply: 'build',
        enforce: 'post' as const,
      } as Plugin,
    ];
  }

  // 构建 Manifest 配置
  const manifest: Record<string, unknown> = {
    name: config.manifest?.name || 'Deer App',
    short_name: config.manifest?.short_name || 'Deer',
    description: config.manifest?.description || 'Powered by Deer Mobile',
    theme_color: config.manifest?.theme_color || '#1890ff',
    background_color: config.manifest?.background_color || '#ffffff',
    display: config.manifest?.display || 'standalone',
    start_url: config.manifest?.start_url || '/',
    icons: config.manifest?.icons || [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
  if (config.manifest?.orientation) {
    manifest.orientation = config.manifest.orientation;
  }

  // 运行时缓存策略
  // 默认不缓存任何 API 请求（含登录、auth 等），
  // 用户须显式通过 runtimeCaching 按需开启，避免安全风险。
  const runtimeCaching: any[] =
    config.runtimeCaching?.map((rc) => ({
      urlPattern: rc.urlPattern,
      handler: rc.handler,
      options: {
        ...(rc.options?.cacheName ? { cacheName: rc.options.cacheName } : {}),
        ...(rc.options?.expiration
          ? {
              expiration: {
                maxEntries: rc.options.expiration.maxEntries,
                maxAgeSeconds: rc.options.expiration.maxAgeSeconds,
              },
            }
          : {}),
      },
    })) || [];

  return VitePWA({
    registerType: config.registerSW !== false ? 'autoUpdate' : 'prompt',
    includeAssets: ['favicon.svg', 'icons.svg'],
    manifest,
    workbox: {
      globPatterns: config.globPatterns || ['**/*.{js,css,html,svg,png,ico}'],
      runtimeCaching,
    },
  }) as unknown as Plugin[];
}
