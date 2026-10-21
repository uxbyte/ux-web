import type { App, Plugin } from 'vue'
import IconFont from './ux-iconfont.vue'

export const UxIconFont = IconFont as typeof IconFont & Plugin

export default {
    install(app: App) {
        app.component(UxIconFont.name || 'ux-iconfont', UxIconFont)
    }
} as Plugin<any>