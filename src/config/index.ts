import type { App, InjectionKey } from 'vue'
import { reactive } from 'vue'
import lodash, { type GetFieldType } from 'lodash'
import { name as pkgName, version as pkgVersion } from '../../package.json'

import { UxWebConfig } from '../types'

type ConfigDynamic = Omit<UxWebConfig, 'router'>

// 默认配置
const defaultConfig: Required<Omit<UxWebConfig, 'router'>> = {
    app: {
        logo: 'UX',
        name: pkgName,
        version: pkgVersion
    },
    IconFont: {
        size: '1em',
        color: 'currentColor'
    },
    Layout: false,
    Upload: {
        baseURL: '',
        urls: {
            file: `/upload/file`,
            image: `/upload/image`,
            video: `/upload/video`,
            audio: `/upload/audio`,
        },
        maxSize: {
            file: 1024 * 1024 * 20,
            image: 1024 * 1024 * 2,
            audio: 1024 * 1024 * 10,
            video: 1024 * 1024 * 500
        },
    },
    uxRequest: {
        baseURL: '/',
    },
    uxCrypto: {
        iv: '9627F8751BAC3190',
        key: 'AE14D873A093C352'
    }
}

export const configDefault = defaultConfig

// 定义 InjectionKey 用于 provide/inject
export const UX_WEB_CONFIG_KEY: InjectionKey<UxWebConfig> = Symbol('ux-web-config')

class ConfigManager {

    private globalConfig: ConfigDynamic

    constructor() {
        this.globalConfig = reactive(defaultConfig)
    }

    init(app: App, options?: Partial<ConfigDynamic>) {
        if (options) {
            this.globalConfig = lodash.merge(this.globalConfig, options)
        }
        // 通过 provide 注入配置到整个应用
        app.provide(UX_WEB_CONFIG_KEY, this.globalConfig)
        // 挂载配置到全局属性
        app.config.globalProperties.$UxWeb = this.globalConfig
        return this.globalConfig
    }

    // 获取配置（响应式）
    getConfig(): Readonly<ConfigDynamic> {
        return this.globalConfig
    }

    get<K extends keyof ConfigDynamic>(key: K, defaults?: ConfigDynamic[K]): Readonly<ConfigDynamic[K]>
    get<K extends string>(key: K, defaults?: GetFieldType<ConfigDynamic, K>): Readonly<GetFieldType<ConfigDynamic, K>>
    get<K extends keyof ConfigDynamic>(key: K | string, defaults?: ConfigDynamic[K]): Readonly<ConfigDynamic[K]> {
        const configKeys = Object.keys(this.globalConfig) as Array<keyof ConfigDynamic>
        if (configKeys.includes(key as keyof ConfigDynamic)) {
            return this.globalConfig[key as K] as Readonly<ConfigDynamic[K]>
        }
        return lodash.get(this.globalConfig, key, defaults || defaultConfig[key as K])
    }

    set<K extends keyof ConfigDynamic>(key: K | string, value: ConfigDynamic[K]) {
        lodash.set(this.globalConfig, key, value)
    }

    update(config: Partial<ConfigDynamic>) {
        this.globalConfig = lodash.merge(this.globalConfig, config)
    }
}

export const configManager = new ConfigManager()
