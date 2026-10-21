import type { App, Plugin } from 'vue'
import Drawer from './ux-drawer.vue'
import type { UxDrawerProps, UxDrawerEmits } from './types'

export const UxDrawer = Drawer
export type { UxDrawerProps, UxDrawerEmits }

export default {
    install(app: App) {
        app.component(UxDrawer.name || 'ux-drawer', UxDrawer)
    }
} as Plugin<any>