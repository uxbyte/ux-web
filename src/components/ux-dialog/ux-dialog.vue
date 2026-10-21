<template>
    <el-dialog :model-value="modelValue" draggable :lock-scroll="false" :append-to-body="true"
        :close-on-click-modal="uxSettings.options.get('dialog', 'click')" v-bind="$attrs" :top="top"
        :close-on-press-escape="uxSettings.options.get('dialog', 'escape')" @close="handleClose">
        <slot></slot>
        <template #header v-if="showHeader">
            <slot name="header"></slot>
        </template>
        <template #footer v-if="showFooter">
            <slot name="footer">
                <el-button :disabled="showLoading && loading" @click="handleCancel">取消</el-button>
                <el-button type="primary" :loading="showLoading && loading" @click="handleConfrim">确认</el-button>
            </slot>
        </template>
    </el-dialog>
</template>


<script setup lang="ts">

import { ref, watch } from "vue";
import { ElButton, ElDialog } from "element-plus";
import { uxSettings } from '../../layout/template/libs/setting'
import type { UxDialogProps, UxDialogEmits } from './types'

const {
    modelValue = false,
    top = '20px',
    showHeader = true,
    showFooter = true,
    showLoading = false
} = defineProps<UxDialogProps>()

const emits = defineEmits<UxDialogEmits>()

const loading = ref<boolean>(false)
const handleConfrim = async () => {
    loading.value = true
    emits('ok', () => {
        loading.value = false
    })
}

const handleCancel = () => {
    if (!showLoading || !loading.value) {
        emits('close')
        emits('update:modelValue', false)
    } else {
        emits('cancel')
    }
}

const handleClose = () => {
    emits('update:modelValue', false)
    emits('close')
}

watch(() => modelValue, (val) => {
    loading.value = false
}, { immediate: true, deep: true })

defineOptions({
    name: 'UxDialog'
})
</script>

<style lang="css">
/* @unocss-placeholder */
</style>