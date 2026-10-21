
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
    plugins: [
        vue(),
        UnoCSS({
            content: {
                filesystem: [
                    './src/**/*.{vue,ts,tsx,html}',
                ]
            }
        })
    ],
    test: {
        // 测试环境
        environment: 'jsdom',

        // 强制内联处理 unocss，解决虚拟模块 __uno.css 路径解析错误
        deps: {
            web: {

            }
        },

        // 全局 API
        globals: true,

        // 测试文件匹配
        include: ['__tests__/**/*.test.ts', '__tests__/**/*.spec.ts'],

        // 排除文件
        exclude: ['node_modules', 'dist', '**/dist/**'],

        // 覆盖率配置
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: ['src/**/*.{ts,vue}'],
            exclude: [
                'src/**/*.d.ts',
                'src/**/index.ts',
                'src/**/types.ts',
                'src/**/*.stories.ts'
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 70,
                statements: 80
            }
        },

        // 设置
        setupFiles: ['./__tests__/setup.ts'],

        // 模拟
        mockReset: true,
        clearMocks: true,

        // 超时时间
        testTimeout: 10000,

        // 报告器
        reporters: ['default', 'html'],

    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            'ux-web': resolve(__dirname, 'src/dist/index.d.ts'),
        }
    }
})