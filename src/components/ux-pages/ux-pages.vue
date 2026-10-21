<template>
  <div :class="`ux_pages ux_pages-${mode}`" :style="`background-color: ${bgColor};`">
    <div class="ux_pages__tips" v-show="!!$slots.tips">
      <slot name="tips"></slot>
    </div>
    <div class="ux_pages__search" v-show="!!$slots.search && showQuery && showSearch">
      <slot name="search"></slot>
    </div>
    <div class="ux_pages__action" v-show="showAction">
      <div class="left">
        <slot name="action"></slot>
      </div>
      <div class="right">
        <template v-if="!!$slots.search">
          <el-tooltip effect="dark" :content="showQuery ? '隐藏搜索' : '显示搜索'" placement="top-end">
            <el-button :icon="Search" circle @click="handleToggleSearch"></el-button>
          </el-tooltip>
        </template>
        <el-tooltip effect="dark" content="刷新数据" placement="top-end">
          <el-button :icon="Refresh" circle @click="handleRefresh()"></el-button>
        </el-tooltip>
      </div>
    </div>
    <template v-if="mode == 'table'">
      <div class="ux_pages__data-table">
        <component ref="uxTableRef" :is="h(UxTable, {
          ...$attrs, ref: componentRef
        }, $slots)" />
      </div>
    </template>
    <template v-else-if="mode == 'body'">
      <div :class="`ux_pages__data-body ${bodyClass}`">
        <el-scrollbar style="height: 100%" :view-class="bodyViewClass" :wrap-class="bodyWrapClass">
          <slot></slot>
        </el-scrollbar>
      </div>
    </template>
    <template v-else-if="mode == 'custom'">
      <div :class="`ux_pages__data-custom ${customClass}`">
        <slot></slot>
      </div>
    </template>
    <div class="ux_pages__footer" v-show="!!$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useAttrs, getCurrentInstance, h, useTemplateRef, type ComponentPublicInstance } from "vue";
import { ElButton, ElTooltip } from "element-plus";
import { Refresh, Search } from '@element-plus/icons-vue'
import lodash from 'lodash'
import type { UxPageProps, UxPageEmits } from './types'

import { UxTable, UxTableInstance } from "../ux-table";

const vm = getCurrentInstance()

const attrs = useAttrs();

const {
  bgColor,
  mode = 'table',
  showQuery = true,
  showAction = true,
  bodyClass = '',
  bodyWrapClass = '',
  bodyViewClass = '',
  customClass = ''
} = defineProps<UxPageProps>()

const emits = defineEmits<UxPageEmits>()

const showSearch = ref(showQuery)

const uxTableRef = ref<UxTableInstance>()

const componentRef = (instance: any) => {
  if (!vm) return false;
  uxTableRef.value = instance
  const exposed = lodash.merge(instance, {
    toggleRowChecked,
    refresh: handleRefresh
  })
  vm.exposed = exposed;
  vm.exposeProxy = exposed;
}

const toggleRowChecked = (key: string, value: any | any[], selected: boolean) => {
  uxTableRef.value?.getListData<any[]>().then((dataTable) => {
    if (value instanceof Array) {
      const rows = dataTable.filter(item => value.includes(item[key]))
      rows.forEach(row => {
        if (row) {
          uxTableRef.value?.toggleRowSelection(row, selected)
        }
      })
    } else {
      const row = dataTable?.find(item => item[key] === value)
      if (row) {
        uxTableRef.value?.toggleRowSelection(row, selected)
      }
    }
  })
}

const handleRefresh = (callback?: () => void) => {
  if (attrs.url && mode === 'table') {
    uxTableRef.value?.request(callback)
  } else {
    emits('refresh')
    if (callback && typeof callback === 'function') {
      callback()
    }
  }
}

const handleToggleSearch = () => {
  showSearch.value = !showSearch.value
}

defineExpose<UxTableInstance & {
  refresh: typeof handleRefresh,
  toggleRowChecked: typeof toggleRowChecked
}>()

defineOptions({
  name: 'ux-pages'
})
</script>

<style lang="css">
  /* @unocss-placeholder */
</style>

<style scoped lang="scss">
.ux_pages {
  flex: 1;
  height: 100%;
  display: flex;
  padding: 10px;
  flex-direction: column;
  box-sizing: border-box;

  &-table {
    padding: 10px;
  }

  &-body {

    &__tips,
    &__search {
      padding: 0px 10px 0 10px;
    }

    &__action {
      padding: 0 10px 0 10px;
    }
  }

  &__tips {
    margin-bottom: 6px;

    :deep(ol) {
      margin: 0;
      padding-inline-start: 20px;
    }
  }

  &__search {
    padding: 10px 10px 0 10px;
    background-color: white;
    margin-bottom: 10px;

    :deep(.el-form-item) {
      margin-bottom: 10px;
      margin-right: 22px;

      .el-select {
        min-width: 192px;
      }
    }
  }

  &__action {
    display: flex;
    grid-gap: 10px;
    margin-bottom: 10px;
    justify-content: space-between;

    .left {
      flex: 1;
      display: flex;
      grid-gap: 10px;

      :deep() {
        .el-button+.el-button {
          margin-left: 0 !important;
        }
      }
    }
  }

  &__data-body,
  &__data-table,
  &__data-custom {
    flex: 1;
    height: 0;
  }

  &__data-table {
    background-color: var(--el-bg-color-overlay);
  }
}

:is(.dark) {
  .ux_pages {

    &__search,
    &__datalist,
    &__datatable {
      background-color: var(--el-bg-color-overlay);
    }
  }
}
</style>