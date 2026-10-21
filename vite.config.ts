import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { extractorSplit } from '@unocss/core'

export default defineConfig({
  define: {
    '__UX_WEB_VERSION__': JSON.stringify(process.env.npm_package_version),
  },
  plugins: [
    vue(),
    UnoCSS({
      // mode: 'shadow-dom',
      configFile: './uno.config.ts',
      // 配置提取器，从源码中提取类名
      extractors: [extractorSplit]
    }),
    dts({
      // 输出目录
      outDir: 'dist',
      // 输出类型入口文件名
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.json',
      // 合并所有类型到一个文件
      rollupTypes: false,
      // 包含的文件
      include: ['src/**/*.ts', 'src/**/*.vue'],
      // 排除不需要生成类型的文件
      exclude: ['**/__tests__/**', '**/*.test.ts', '**/*.spec.ts'],
      // 复制 .d.ts 文件
      copyDtsFiles: true,
      // 静态导入
      staticImport: true,
      // 插入类型入口
      insertTypesEntry: true,
      // 清除 Vue 文件类型
      cleanVueFileName: true,
      // 跳过类型检查
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@/*': resolve(import.meta.dirname, 'src/*')
    }
  },
  build: {
    lib: {
      name: 'UxWeb',
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        router: resolve(import.meta.dirname, 'src/router/index.ts'),
        layout: resolve(import.meta.dirname, 'src/layout/index.ts'),
        resolvers: resolve(import.meta.dirname, 'src/resolvers/index.ts')
      },
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es'],
      cssFileName: 'style'
    },
    rollupOptions: {
      external: [
        'vue',
        'pinia',
        'unocss',
        'vue-router',
        'element-plus',
        '@element-plus/icons-vue',
        '@vueuse/core'
      ],
      output: {
        globals: {
          vue: 'Vue',
          pinia: 'Pinia',
          'element-plus': 'ElementPlus',
          '@vueuse/core': 'VueUse',
          'vue-router': 'VueRouter'
        },
        exports: 'named',
        preserveModules: false,
        entryFileNames: (chunkInfo) => {
          const { name } = chunkInfo
          if (['index'].includes(name)) {
            return `${name}.js`
          }
          return `${name}/index.js`
        },
        assetFileNames: (assetInfo) => {
          const { names } = assetInfo
          if (names.includes('style.css')) {
            return 'index.css'
          }
          return names[0] || ''
        },
        chunkFileNames: (chunkInfo) => {
          const { name, isDynamicEntry, moduleIds } = chunkInfo
          if (name === 'chunk') {
            return `assets/${name}.js`
          }

          if (name === 'index') {
            return `${name}.js`
          }

          if (isDynamicEntry) {
            if (moduleIds.some(id => id.includes('layout'))) {
              if (moduleIds.some(id => id.includes('components'))) {
                return `layout/components/${name}.js`
              }
            }
          }

          if (moduleIds.every(id => id.includes('icons-vue'))) {
            return `element-plus/icons-vue.js`
          }

          return `${name}/index.js`
        }
      }
    },
    // 压缩代码
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 生成源映射
    sourcemap: true,
    cssCodeSplit: false,
  }
})