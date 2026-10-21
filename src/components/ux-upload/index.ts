import type { App, Plugin } from 'vue'
import Upload from './ux-upload.vue'

export const UxUpload = Upload as typeof Upload & Plugin

export type UxUploadInstance = InstanceType<typeof Upload>

export default {
    install(app: App) {
        app.component(UxUpload.name || 'ux-upload', UxUpload)
    }
} as Plugin<any>