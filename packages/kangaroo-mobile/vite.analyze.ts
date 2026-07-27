/**
 * kangaroo-mobile 构建体积分析配置
 *
 * 使用方式: pnpm build:analyze
 * 产出: dist/stats.html (交互式树图) + dist/stats.json (原始数据)
 */
import { defineConfig, mergeConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import baseConfig from './vite.config';

export default defineConfig(
  mergeConfig(baseConfig, {
    plugins: [
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap', // treemap | sunburst | network
      }),
    ],
  }),
);
