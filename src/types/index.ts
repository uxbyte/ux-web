
import type { LayoutConfig } from '../layout/types'
import type { CryptConfig as UxCryptoConfig } from '../utils/crypto'
import type { ApiRequest as UxRequestConfig } from '../utils/request'
import type { UploadConfig, IconFontConfig } from '../components/types'

export type AppConfig = {
  name: string,
  logo?: string,
  version?: string
}

// 组件库安装选项
export interface UxWebConfig {
  app?: AppConfig,
  Layout?: LayoutConfig,
  Upload?: UploadConfig,
  IconFont?: IconFontConfig,
  uxCrypto?: UxCryptoConfig,
  uxRequest?: UxRequestConfig,
}

export type * from '../utils'

// 全局组件类型声明（用于扩展 Vue 的全局组件类型）
declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Access to the application's UxWeb
     */
    $UxWeb: UxWebConfig
  }
}
