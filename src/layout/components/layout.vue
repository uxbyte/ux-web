<template>

    <slot></slot>

    <p-update-pwd v-model="showPage.updatePassword" @ok="(val: okPwdVal) => {
        emits('update_pwd', val)
    }" />
    <p-setting v-model="showPage.setting" />

</template>
<script setup lang="ts">

import { defineAsyncComponent } from 'vue'

import { showPage } from '../lib/mixin'

import type { LayoutTemplate, LayoutEmits } from '../types'
import type { okVal as okPwdVal } from '../components/update_pwd.vue'

const pUpdatePwd = defineAsyncComponent(() => import('./update_pwd.vue'))
const pSetting = defineAsyncComponent(() => import('./setting.vue'))

const props = defineProps<{
    layout?: LayoutTemplate
}>()

const emits = defineEmits<LayoutEmits>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>
