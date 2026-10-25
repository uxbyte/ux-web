<template>
  <ux-drawer :model-value="modelValue" direction="ltr" title="设置" class="layout_setting" size="348px"
    :show-footer="false" @close="handleClose">

    <div class="theme ux-mb-3.75">
      <div class="ux-text-4 ux-font-600 ux-mb-3">主题模式</div>
      <ux-theme mode="tab" theme="auto" />
    </div>
    <div class="layout ux-mb-3.75">
      <div class="ux-text-4 ux-font-600 ux-mb-3">导航模式</div>
      <div class="ux-flex ux-flex-wrap ux-justify-between ux-gap-2.5">
        <div class="ux-relative ux-cursor-pointer" @click="() => setLayoutTemplate('mix')">
          <img src="../../assets/layout_mix.svg" alt="混合模式" />
          <template v-if="layoutTemplate == 'mix'">
            <img src="../../assets/check.svg" class="ux-absolute ux-bottom-0 ux-right-0" />
          </template>
        </div>
        <div class="ux-relative ux-cursor-pointer" @click="() => setLayoutTemplate('classics')">
          <img src="../../assets/layout_classics.svg" alt="经典模式" />
          <template v-if="layoutTemplate == 'classics'">
            <img src="../../assets/check.svg" class="ux-absolute ux-bottom-0 ux-right-0" />
          </template>
        </div>
        <div class="ux-relative ux-cursor-pointer" @click="() => setLayoutTemplate('aside')">
          <img src="../../assets/layout_aside.svg" alt="侧边模式" />
          <template v-if="layoutTemplate == 'aside'">
            <img src="../../assets/check.svg" class="ux-absolute ux-bottom-0 ux-right-0" />
          </template>
        </div>
        <div class="ux-relative ux-cursor-pointer" @click="() => setLayoutTemplate('nav')">
          <img src="../../assets/layout_nav.svg" alt="NAV模式" />
          <template v-if="layoutTemplate == 'nav'">
            <img src="../../assets/check.svg" class="ux-absolute ux-bottom-0 ux-right-0" />
          </template>
        </div>
        <div class="ux-relative ux-cursor-pointer" @click="() => setLayoutTemplate('top')">
          <img src="../../assets/layout_top.svg" alt="顶部模式" />
          <template v-if="layoutTemplate == 'top'">
            <img src="../../assets/check.svg" class="ux-absolute ux-bottom-0 ux-right-0" />
          </template>
        </div>
      </div>
    </div>
    <el-divider />
    <div :class="['ux-flex ux-mt-2.5 ux-items-center ux-bg-#f2f2f2 ux-py-1.5 ux-px-3',
      'ux-rounded-1.25 dark:ux-bg-[var(--el-bg-color-overlay)]'
    ]" v-for="(item) in options">
      <div class="ux-flex-1 ux-w-0 ux-text-3.5 ux-pr-4 ux-text-justify">{{ item.label }}</div>
      <div class="value">
        <el-switch v-model="item.value" active-text="是" inactive-text="否" @change="handleSettingChange" />
      </div>
    </div>
  </ux-drawer>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'

import { uxSettings, type Options } from '../template/libs/setting'

import type { LayoutTemplate } from '../types'

const { modelValue = false } = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

const layoutTemplate = computed(() => {
  return uxSettings.getter('layout-template') as LayoutTemplate
})

const setLayoutTemplate = (name: LayoutTemplate) => {
  uxSettings.setter({
    'layout-template': name
  })
}

const handleClose = () => emits('update:modelValue', false)

const options = ref<Options>(uxSettings.options.all())

const handleSettingChange = () => {
  uxSettings.setter(options.value)
}

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.layout_setting {
  --el-drawer-bg-color: #f3f3f3 !important;

  .el-drawer__header {
    margin-bottom: 0;
    padding: 12px 12px 12px 16px !important;
  }

  .el-drawer__body {
    --bg-color: white;
    padding: 10px;
    background: var(--bg-color);
    border-radius: 10px;
  }

}

:is(.dark .layout_setting) {
  --el-drawer-bg-color: var(--el-bg-color-overlay) !important;

  .el-drawer__body {
    --bg-color: var(--el-bg-color);
  }
}
</style>