import type { App, Plugin } from 'vue'
import Dialog from './ux-dialog.vue'

export const UxDialog = Dialog as typeof Dialog & Plugin
export type * from './types'

export default {
    install(app: App) {
        app.component(UxDialog.name || 'ux-dialog', UxDialog)
    }
} as Plugin<any>