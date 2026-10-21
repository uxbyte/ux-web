<template>
    <component :is="layout" v-bind="$attrs">
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>
    </component>

    <p-update-pwd v-model="showPage.updatePassword" @ok="(val: okPwdVal) => {
        emits('update_pwd', val)
    }" />
    <p-setting v-model="showPage.setting" />

</template>
<script setup lang="ts">

import { ref, computed, watch, defineAsyncComponent } from 'vue'

import { showPage } from '../lib/mixin'
import { uxSettings, event } from './libs/setting'

import type { LayoutTemplate, LayoutEmits } from '../types'

import layoutMix from './pages/mix.vue'
import layoutSide from './pages/side.vue'
import layoutAside from './pages/aside.vue'

import type { okVal as okPwdVal } from '../components/update_pwd.vue'

const pUpdatePwd = defineAsyncComponent(() => import('../components/update_pwd.vue'))
const pSetting = defineAsyncComponent(() => import('./block/setting.vue'))

const props = defineProps<{
    layout?: LayoutTemplate
}>()

const emits = defineEmits<LayoutEmits>()

const layoutTmp = ref<LayoutTemplate>(
    props.layout || uxSettings.getter('layout-template') as LayoutTemplate
)

const layout = computed(() => {
    if (layoutTmp.value == 'aside') {
        return layoutAside
    }
    if (layoutTmp.value == 'side') {
        return layoutSide
    }
    return layoutMix
})

event.on((e) => {
    if (e == 'update:settings') {
        layoutTmp.value = uxSettings.getter('layout-template') as LayoutTemplate
        emits('update:layout', layoutTmp.value)
    }
})

watch(() => props.layout, (val) => {
    if (val) {
        uxSettings.setter({ 'layout-template': val })
    }
}, { immediate: true })

type MixSlots = InstanceType<typeof layoutMix>['$slots']
type AsideSlots = InstanceType<typeof layoutAside>['$slots']
type SideSlots = InstanceType<typeof layoutSide>['$slots']

defineSlots<MixSlots & AsideSlots & SideSlots>()

defineOptions({ inheritAttrs: false })

</script>

<style lang="css">
/* @unocss-placeholder */
</style>
