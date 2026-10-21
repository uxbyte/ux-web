import type { App, Plugin } from 'vue'
import Pages from './ux-pages.vue'

export const UxPages = Pages as typeof Pages & Plugin

export type UxPagesInstance = InstanceType<typeof Pages>

export default {
    install(app: App) {
        app.component(UxPages.name || 'ux-pages', UxPages)
    }
} as Plugin<any>