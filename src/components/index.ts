import * as vue from 'vue'

import { default as UxPages } from './ux-pages'
import { default as UxTable } from './ux-table'
import { default as UxDialog } from './ux-dialog'
import { default as UxDrawer } from './ux-drawer'
import { default as UxIconfont } from './ux-iconfont'
import { default as UxRequest } from './ux-request'
import { default as UxTheme } from './ux-theme'
import { default as UxUpload } from './ux-upload'
import { default as UxPagination } from './ux-pagination'

const components = {
  UxPages, UxTable, UxDialog, UxPagination,
  UxDrawer, UxIconfont, UxRequest, UxTheme, UxUpload
}

export {
  UxPages, UxTable, UxDialog, UxPagination,
  UxDrawer, UxIconfont, UxRequest, UxTheme, UxUpload
}

const install = (app: vue.App) => {
  Object.entries(components).forEach(([name, component]) => {
    if (component.install) {
      app.use(component as vue.Plugin)
    } else {
      app.component(name, component)
    }
  })
}

export default { install }


// 全局组件类型声明（用于扩展 Vue 的全局组件类型）
declare module 'vue' {
  export interface GlobalComponents {
    UxPages: typeof import('./ux-pages')['UxPages'],
    UxTable: typeof import('./ux-table')['UxTable'],
    UxDialog: typeof import('./ux-dialog')['UxDialog'],
    UxDrawer: typeof import('./ux-drawer')['UxDrawer'],
    UxIconfont: typeof import('./ux-iconfont')['UxIconFont'],
    UxRequest: typeof import('./ux-request')['UxRequest'],
    UxTheme: typeof import('./ux-theme')['UxTheme'],
    UxUpload: typeof import('./ux-upload')['UxUpload'],
    UxPagination: typeof import('./ux-pagination')['UxPagination']
  }
}