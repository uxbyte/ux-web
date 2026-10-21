<template>
    <el-drawer :model-value="modelValue" v-bind="$attrs" :size="size == 'full' ? 'calc(100% - 68px)' : size"
        :title="title" :lock-scroll="false" :class="(size == 'full' || full) ? 'el-drawer-full' : ''"
        :close-on-click-modal="uxSettings.options.get('drawer', 'click')" append-to-body
        :close-on-press-escape="uxSettings.options.get('drawer', 'escape')" @close="handleClose">
        <template #header v-if="showHeader">
            <slot name="header">
                <el-page-header :title="backText" :icon="ArrowLeft" :content="title" @back="handleClose" />
            </slot>
        </template>
        <slot></slot>
        <template #footer v-if="showFooter">
            <slot name="footer">
                <el-button :disabled="showLoading && loading" @click="handleCancel">取消</el-button>
                <el-button type="primary" :loading="showLoading && loading" @click="handleConfrim">确认</el-button>
            </slot>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">

import { ref, watch } from "vue";
import { ArrowLeft } from '@element-plus/icons-vue'
import { uxSettings } from '../../layout/template/libs/setting'
import type { UxDrawerProps, UxDrawerEmits } from './types'

const {
    modelValue = false,
    title = '',
    backText = '关闭',
    size = 'full',
    full = false,
    showLoading = false,
    showHeader = true,
    showFooter = true
} = defineProps<UxDrawerProps>()

const emits = defineEmits<UxDrawerEmits>()

const loading = ref<boolean>(false)

const handleClose = () => {
    emits('update:modelValue', false)
    emits('close')
}

const handleCancel = () => {
    if (!showLoading || !loading.value) {
        emits('close')
        emits('update:modelValue', false)
    } else {
        emits('cancel')
    }
}

const handleConfrim = () => {
    loading.value = true
    emits('ok', () => {
        loading.value = false
    })
}

watch(() => modelValue, (val) => {
    loading.value = false
}, { immediate: true, deep: true })

defineOptions({
    name: 'UxDrawer'
})

</script>

<style lang="css">
  /* @unocss-placeholder */
</style>