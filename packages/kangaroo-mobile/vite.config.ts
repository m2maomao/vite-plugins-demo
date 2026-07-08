import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { optimize } from 'svgo';

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      autoInstall: false,
      // 自定义图标集合（设计师SVG）
      customCollections: {
        deer: FileSystemIconLoader(
          'src/assets/icons',
          (svg) => optimizeSvg(svg)
        ),
      },
    }),
  ],

  optimizeDeps: {
    include: ['@iconify/vue'],
  },

  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'KangarooMobile',
      fileName: 'kangaroo-mobile',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})

// SVG 预处理函数
function optimizeSvg(svg: string): string {
  const result = optimize(svg, {
    multipass: true,
    plugins: [
      'preset-default',
      'removeDimensions',
      {
        name: 'removeAttrs',
        params: {
          attrs: '(fill|stroke|class|style|data-*)',
        },
      },
      {
        name: 'convertColors',
        params: {
          currentColor: /^(?!url|none).*/,
        },
      },
      'convertPathData',
      'convertTransform',
      'collapseGroups',
    ],
  })

  // 兜底处理
  const cleaned = result.data.replace(/<svg([^>]*)>/, (_, attrs) => {
    attrs = attrs
        .replace(/\sstyle="[^"]*"/g, '')
        .replace(/\sfill="[^"]*"/g, '')
        .replace(/\sstroke="[^"]*"/g, '')

    if (!attrs.includes('fill=')) attrs += ' fill="currentColor"'
    if (!attrs.includes('stroke=')) attrs += ' stroke="currentColor"'

    return `<svg${attrs}>`
  })

  return cleaned
}