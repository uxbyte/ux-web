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

import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

import { uxSettings, event } from './libs/setting'
import { showPage } from '../lib/mixin'

import type { LayoutTemplate, LayoutEmits } from '../types'
import type { okVal as okPwdVal } from '../components/update_pwd.vue'


import layoutMix from './pages/mix.vue';
import layoutNav from './pages/nav.vue';
import layoutTop from './pages/top.vue';
import layoutAside from './pages/aside.vue';
import layoutClassics from './pages/classics.vue';


const pUpdatePwd = defineAsyncComponent(() => import('../components/update_pwd.vue'))
const pSetting = defineAsyncComponent(() => import('../components/setting.vue'))


const props = defineProps<{
    layout?: LayoutTemplate
}>()

const emits = defineEmits<LayoutEmits>()

const route = useRoute()

const layoutTmp = ref<LayoutTemplate>(
    props.layout || uxSettings.getter('layout-template') as LayoutTemplate
)

const layout = computed(() => {
    if (layoutTmp.value == 'nav') {
        return layoutNav
    } else if (layoutTmp.value == 'top') {
        return layoutTop
    } else if (layoutTmp.value == 'aside') {
        return layoutAside
    } else if (layoutTmp.value == 'classics') {
        return layoutClassics
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

onMounted(() => {
    if (props.layout) {
        layoutTmp.value = props.layout
    } else if (route.meta?.uxLayout) {
        layoutTmp.value = typeof route.meta?.uxLayout === 'string'
            ? route.meta?.uxLayout
            : (route.meta?.uxLayout?.name || 'mix')
    } else {
        layoutTmp.value = uxSettings.getter('layout-template') as LayoutTemplate
    }
})

type MixSlots = InstanceType<typeof layoutMix>['$slots']
type NavSlots = InstanceType<typeof layoutNav>['$slots']
type AsideSlots = InstanceType<typeof layoutAside>['$slots']
type ClassicsSlots = InstanceType<typeof layoutClassics>['$slots']

defineSlots<MixSlots & NavSlots & AsideSlots & ClassicsSlots>()

defineOptions({
    name: 'ux-layout',
    inheritAttrs: false
})

</script>

<style lang="css">
/* @unocss-placeholder */
</style>
