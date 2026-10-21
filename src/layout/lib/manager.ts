import { ref, type VNode } from 'vue'
import lodash from 'lodash'
import { configManager } from '../../config'

import type { LayoutProps, LayoutEmits } from '../types'

type slotName = 'top-tail' | 'bottom-tail' | 'main-extend'

type Slots = Partial<Record<slotName, VNode | (() => VNode)>>

export type DefineLayout = {
    props?: () => LayoutProps,
    slots?: () => Slots,
    emits?: LayoutEmits,
}

export const props = ref<LayoutProps>()
export const slots = ref<Slots>()
export const emits = ref<LayoutEmits>()

export const layoutManager = {
    props(path: string, value: any) {
        if (!props.value) {
            props.value = {}
        }
        lodash.set(props.value, path, value)
    }
}

export const defineUxLayout = (options: DefineLayout) => {
    const conf = configManager.get('Layout')
    if (conf === false) {
        throw new Error('关闭状态下不支持 defineUxLayout')
    }

    if (options.props) {
        props.value = options.props()
    }

    if (options.slots) {
        slots.value = options.slots()
    }

    if (options.emits) {
        emits.value = options.emits
    }
}