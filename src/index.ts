import { version as pkgVersion } from '../package.json'

import * as vue from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import type { UxWebConfig } from './types'
import { configManager } from './config'
import components from './components'
import layout from './layout'
import stores from './stores'
import {
  uxUtils, uxVerify, uxCrypto, uxMaths,
  uxModal, uxCached, uxRequest, uxComponent
} from './utils'

import 'virtual:uno.css'
import './styles/index.scss'

const install = (app: vue.App, options?: UxWebConfig) => {
  // 初始化配置管理器
  const config = configManager.init(app, options)
  // 注册全局工具对象，使其可在模板中直接使用（与下方 ComponentCustomProperties 类型声明保持一致）
  Object.assign(app.config.globalProperties, {
    uxUtils, uxVerify, uxCrypto, uxMaths,
    uxModal, uxCached, uxRequest, uxComponent
  })
  // 注册所有图标
  Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(`ElIcon${key}`, component)
  })
  // 注册Layout组件
  layout.install(app, config.Layout)
  // 注册所有组件
  components.install(app)
  app.use(stores)
}

export default {
  install,
  version: pkgVersion
}

export { configManager }

export * from './utils'
export * from './layout'
export * from './components'
export type * from './types'
export type * from './components/types'

declare module 'vue' {
  interface ComponentCustomProperties {
    uxUtils: typeof import('./utils')['uxUtils']
    uxVerify: typeof import('./utils')['uxVerify']
    uxCrypto: typeof import('./utils')['uxCrypto']
    uxMaths: typeof import('./utils')['uxMaths']
    uxModal: typeof import('./utils')['uxModal']
    uxCached: typeof import('./utils')['uxCached']
    uxRequest: typeof import('./utils')['uxRequest']
    uxComponent: typeof import('./utils')['uxComponent']
  }
}

