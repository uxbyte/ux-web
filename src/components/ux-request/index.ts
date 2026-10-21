import type { App, Plugin } from 'vue'
import Request from './ux-request.vue'

export const UxRequest = Request as typeof Request & Plugin

export type UxRequestInstance = InstanceType<typeof Request>

export default {
    install(app: App) {
        app.component(UxRequest.name || 'ux-request', UxRequest)
    }
} as Plugin<any>