import type { App, Plugin } from 'vue'
import Theme from './ux-theme.vue'

export const UxTheme = Theme as typeof Theme & Plugin

export type UxThemeInstance = InstanceType<typeof Theme>

export default {
    install(app: App) {
        app.component(UxTheme.name || 'ux-theme', UxTheme)
    }
} as Plugin<any>