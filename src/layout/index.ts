import * as vue from 'vue'
import { createLayoutRouter } from '../router'
import { default as UxLayout } from './template/index.vue'

import type { LayoutConfig, LayoutProps, MenuMeta } from './types'

export { menuManager } from './lib/menu'

export { UxLayout }

export type Styles = LayoutProps['styles']
export type { MenuItem, MenuTree, MenuMeta } from './types'

const templates = { UxLayout }

const install = (app: vue.App, options?: LayoutConfig) => {
  if (options == undefined || options == false) {
    return
  }
  // 注册 Layout组件
  if (options === 'template') {
    Object.entries(templates).forEach(([name, component]) => {
      app.component(component.name || name, component)
    })
  }
  if (options !== 'template' && options.routes) {
    const router = createLayoutRouter(options.routes)
    if (options.router) {
      options.router(app, router)
    }
    app.use(router)
  }
}

export default { install }


// 全局组件类型声明（用于扩展 Vue 的全局组件类型）
declare module 'vue' {
  export interface GlobalComponents {
    // UxLayout: typeof import('./template/index.vue'),
  }
}


declare module 'vue-router' {
  interface RouteMeta {
    uxLayout?: false | string | {
      name?: string,
      // 菜单配置
      menu?: MenuMeta
    },
    requiresAuth?: boolean,
  }
}