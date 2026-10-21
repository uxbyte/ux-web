import type { App, Plugin } from 'vue'
import type { TableInstance } from "element-plus";
import { default as Table } from './ux-table.vue'

export const UxTable = Table as typeof Table & Plugin

export type UxTableInstance = TableInstance & InstanceType<typeof Table>

export default {
    install(app: App) {
        app.component(UxTable.name || 'uxtable', UxTable)
    }
} as Plugin<any>