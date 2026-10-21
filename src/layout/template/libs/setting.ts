
import lodash from 'lodash'
import { useEventBus, useStorage } from '@vueuse/core'
import { LayoutTemplate } from '../../types'


type Key = 'layout-template'
    | 'click-close-dialog' | 'escape-close-dialog'
    | 'click-close-drawer' | 'escape-close-drawer'


type OptionKey = Exclude<Key, 'layout-template'>
type OptionItem = { label: string, value: boolean }

export type Options = Record<OptionKey, OptionItem>


type SettingKey = Exclude<Key, OptionKey>
type SettingItem = LayoutTemplate

export type Settings = Record<SettingKey, SettingItem>


const defaultSettings: Settings = {
    'layout-template': 'mix' as LayoutTemplate,
}

const defaultOptions: Options = {
    'click-close-dialog': { label: '点击遮罩关闭弹窗', value: false },
    'escape-close-dialog': { label: '按下Esc键关闭弹窗', value: false },
    'click-close-drawer': { label: '点击遮罩关闭抽屉', value: false },
    'escape-close-drawer': { label: '按下Esc键关闭抽屉', value: false },
}

const key = 'uxSettings'

const storage = useStorage<Options & Settings>(key, {
    ...defaultOptions, ...defaultSettings
})

export const event = useEventBus<'update:settings', Options | Settings>('bus_settings')

const setter = (values: Options | Settings) => {
    const config = storage.value
    storage.value = lodash.merge(config, values)
    event.emit('update:settings', storage.value)
}

const getter = (key: Key) => {
    return storage.value[key]
}

const options = (key?: OptionKey): Options | boolean => {
    let values: Options = { ...defaultOptions }
    Object.keys(defaultOptions).map((k) => {
        const kk = k as (keyof typeof defaultOptions);
        const val = storage.value[kk] as OptionItem
        if (!val) {
            values[kk] = val
        }
    })
    return key ? values[key].value : values
}

export const uxSettings = {
    setter, getter,
    options: {
        all() {
            return options() as Options
        },
        get(type: 'dialog' | 'drawer', event: 'click' | 'escape') {
            return options(`${event}-close-${type}`) as boolean
        }
    }
}