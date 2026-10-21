import type { App, Plugin } from 'vue'
import Pagination from './ux-pagination.vue'

export const UxPagination = Pagination as typeof Pagination & Plugin
export type UxPaginationInstance = InstanceType<typeof Pagination>
export type * from './types'

export default {
    install(app: App) {
        app.component(UxPagination.name || 'ux-pagination', UxPagination)
    }
} as Plugin<any>