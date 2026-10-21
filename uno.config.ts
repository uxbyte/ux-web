import { defineConfig, presetAttributify,presetWind4 } from 'unocss'
import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'

export default defineConfig({
    presets: [
        presetWind4({
            prefix: 'ux-',
            preflights: {
                theme: {
                    process: createRemToPxProcessor(),
                }
            },
            postprocess: [createRemToPxProcessor()],
        }),
        presetAttributify({
            prefix: 'ux-',
            prefixedOnly: true,
            ignoreAttributes: ['top', 'border', 'width', 'height']
        })
    ],
    rules: [
        ['ux-flex-center', { display: 'flex', 'justify-content': 'center', 'align-items': 'center' }],
        ['ux-flex-x-center', { display: 'flex', 'flex-direction': 'column', 'justify-content': 'center' }],
        ['ux-flex-y-center', { display: 'flex', 'flex-direction': 'row', 'align-items': 'center' }],
    ],
    content: {
        filesystem: [
            './src/**/*.{vue,ts,tsx,html}',
        ]
    },
    shortcuts: [
    ],
    theme:{
        colors:{
            primary: 'var(--el-color-primary)',
        }
    }
})